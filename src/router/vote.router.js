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
  handleVote(req, res, 'locations', 'id', 'location_id');
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
voteRouter.get("/vote", (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  // Lấy dữ liệu từ bảng vote
  const voteQuery = `
    SELECT location_id, hotel_id, restaurant_id 
    FROM vote 
    WHERE user_id = ?
  `;

  connection.query(voteQuery, [user_id], (voteError, voteResults) => {
    if (voteError) {
      console.error("Error fetching vote data:", voteError);
      return res.status(500).json({ error: "Error fetching vote data" });
    }

    if (voteResults.length === 0) {
      return res.status(404).json({ error: "No vote data found for the user" });
    }

    const locations = [];
    const hotels = [];
    const restaurants = [];

    // Tách các ID từ kết quả truy vấn
    const locationIds = voteResults.filter(v => v.location_id).map(v => v.location_id);
    const hotelIds = voteResults.filter(v => v.hotel_id).map(v => v.hotel_id);
    const restaurantIds = voteResults.filter(v => v.restaurant_id).map(v => v.restaurant_id);

    // Lấy dữ liệu từ bảng locations
    const locationQuery = `SELECT * FROM locations WHERE id IN (?)`;
    connection.query(locationQuery, [locationIds], (locationError, locationResults) => {
      if (locationError) {
        console.error("Error fetching locations:", locationError);
        return res.status(500).json({ error: "Error fetching locations" });
      }
      locations.push(...locationResults);

      // Lấy dữ liệu từ bảng hotels
      const hotelQuery = `SELECT * FROM hotels WHERE id IN (?)`;
      connection.query(hotelQuery, [hotelIds], (hotelError, hotelResults) => {
        if (hotelError) {
          console.error("Error fetching hotels:", hotelError);
          return res.status(500).json({ error: "Error fetching hotels" });
        }
        hotels.push(...hotelResults);

        // Lấy dữ liệu từ bảng restaurants
        const restaurantQuery = `SELECT * FROM restaurants WHERE id IN (?)`;
        connection.query(restaurantQuery, [restaurantIds], (restaurantError, restaurantResults) => {
          if (restaurantError) {
            console.error("Error fetching restaurants:", restaurantError);
            return res.status(500).json({ error: "Error fetching restaurants" });
          }
          restaurants.push(...restaurantResults);

          // Tổng hợp dữ liệu
          const responseData = { locations, hotels, restaurants };

          // Ghi dữ liệu vào file JSON
          const filePath = path.join(__dirname, "vote_data.json");
          fs.writeFile(filePath, JSON.stringify(responseData, null, 2), (fileError) => {
            if (fileError) {
              console.error("Error writing to file:", fileError);
              return res.status(500).json({ error: "Error writing data to file" });
            }

            res.status(200).json({
              message: "Data fetched and saved successfully",
              data: responseData,
            });
          });
        });
      });
    });
  });
});


module.exports = voteRouter;
