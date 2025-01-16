const express = require("express");
const mysql = require("mysql2");
const voteRouter = express.Router();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'travels-web',
    port: 3307,
  });

// Hàm xử lý vote chung
const handleVote = (req, res, tableName, idField, voteField) => {
  const { id, user_id, ratingScore } = req.body;

  if (!id || !user_id || !ratingScore) {
    return res.status(400).json({ error: "id, user_id, and ratingScore are required" });
  }

  // Lấy thông tin đối tượng trước khi cập nhật
  const selectQuery = `
    SELECT rating, ratingCount 
    FROM ${tableName} 
    WHERE ${idField} = ?
  `;

  connection.query(selectQuery, [id], (selectError, results) => {
    if (selectError || results.length === 0) {
      console.error("Error fetching target data:", selectError);
      return res.status(500).json({ error: "Error fetching target data" });
    }

    const { rating, ratingCount } = results[0];
    const newRatingCount = ratingCount + 1;
    const newRating = ((rating * ratingCount) + ratingScore) / newRatingCount;

    // Cập nhật điểm và số lượng đánh giá
    const updateQuery = `
      UPDATE ${tableName} 
      SET rating = ?, ratingCount = ?
      WHERE ${idField} = ?
    `;

    connection.query(updateQuery, [newRating, newRatingCount, id], (updateError) => {
      if (updateError) {
        console.error("Error updating target data:", updateError);
        return res.status(500).json({ error: "Error updating target data" });
      }

      // Cập nhật vào bảng vote
      const voteInsertQuery = `
        INSERT INTO vote (user_id, ${voteField}, rating, created_at) 
        VALUES (?, ?, ?, NOW())
      `;

      connection.query(voteInsertQuery, [user_id, id, ratingScore], (voteError) => {
        if (voteError) {
          console.error("Error inserting vote data:", voteError);
          return res.status(500).json({ error: "Error inserting vote data" });
        }

        res.status(201).json({
          message: "Vote recorded successfully",
          newRating: parseFloat(newRating.toFixed(2)),
          newRatingCount,
        });
      });
    });
  });
};

// API: Vote cho Location
voteRouter.post('/voteLocation', (req, res) => {
  handleVote(req, res, 'location', 'id', 'location_id');
});

// API: Vote cho Hotel
voteRouter.post('/voteHotel', (req, res) => {
  handleVote(req, res, 'hotels', 'id', 'hotel_id');
});

// API: Vote cho Restaurant
voteRouter.post('/voteRestaurant', (req, res) => {
  handleVote(req, res, 'restaurants', 'id', 'restaurant_id');
});

// API: Lấy thông tin các đối tượng đã vote
voteRouter.post("/vote", async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    // Lấy dữ liệu từ bảng vote
    const [voteResults] = await connection.promise().query(`
      SELECT location_id, hotel_id, restaurant_id 
      FROM vote 
      WHERE user_id = ?`, [user_id]);

    if (voteResults.length === 0) {
      return res.status(404).json({ error: "No vote data found for the user" });
    }

    // Tách các ID từ kết quả truy vấn
    const locationIds = voteResults.filter(v => v.location_id).map(v => v.location_id);
    const hotelIds = voteResults.filter(v => v.hotel_id).map(v => v.hotel_id);
    const restaurantIds = voteResults.filter(v => v.restaurant_id).map(v => v.restaurant_id);

    // Khởi tạo các mảng chi tiết
    let locations = [], hotels = [], restaurants = [];

    // Lấy chi tiết nếu có ID
    if (locationIds.length > 0) {
      [locations] = await connection.promise().query(`
        SELECT * FROM location WHERE id IN (?)`, [locationIds]);
    }

    if (hotelIds.length > 0) {
      [hotels] = await connection.promise().query(`
        SELECT * FROM hotels WHERE id IN (?)`, [hotelIds]);
    }

    if (restaurantIds.length > 0) {
      [restaurants] = await connection.promise().query(`
        SELECT * FROM restaurants WHERE id IN (?)`, [restaurantIds]);
    }

    // Tổng hợp dữ liệu
    const responseData = [
      ...locations,
      ...hotels,
      ...restaurants,
    ];
    console.log(responseData);

    res.status(200).json(responseData);

  } catch (error) {
    console.error("Error fetching vote data:", error);
    res.status(500).json({ error: "Error fetching vote data" });
  }
});


module.exports = voteRouter;
