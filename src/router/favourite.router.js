const express = require("express");
const mysql = require("mysql2");
const favouriteRouter = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "travels-web",
  port: 3307,
});

// Kết nối cơ sở dữ liệu
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to the database.");
});

// API: Thêm yêu thích địa điểm
favouriteRouter.post("/favouriteLocation", (req, res) => {
  const { user_id, location_id } = req.body;

  if (!user_id || !location_id) {
    return res.status(400).json({ error: "user_id and location_id are required" });
  }

  const query = `
    INSERT INTO favorites (user_id, location_id, created_at)
    VALUES (?, ?, NOW())
  `;

  connection.query(query, [user_id, location_id], (error, results) => {
    if (error) {
      console.error("Error adding favourite location:", error);
      return res.status(500).json({ error: "Error adding favourite location" });
    }
    res.status(200).json(results);
    
  });
});

// API: Thêm yêu thích khách sạn
favouriteRouter.post("/favouriteHotel", (req, res) => {
  const { user_id, hotel_id } = req.body;

  if (!user_id || !hotel_id) {
    return res.status(400).json({ error: "user_id and hotel_id are required" });
  }

  const query = `
    INSERT INTO favorites (user_id, hotel_id, created_at)
    VALUES (?, ?, NOW())
  `;

  connection.query(query, [user_id, hotel_id], (error, results) => {
    if (error) {
      console.error("Error adding favourite hotel:", error);
      return res.status(500).json({ error: "Error adding favourite hotel" });
    }
    res.status(200).json(results);
  });
});

// API: Thêm yêu thích nhà hàng
favouriteRouter.post("/favouriteRestaurant", (req, res) => {
  const { user_id, restaurant_id } = req.body;

  if (!user_id || !restaurant_id) {
    return res.status(400).json({ error: "user_id and restaurant_id are required" });
  }

  const query = `
    INSERT INTO favorites (user_id, restaurant_id, created_at)
    VALUES (?, ?, NOW())
  `;

  connection.query(query, [user_id, restaurant_id], (error, results) => {
    if (error) {
      console.error("Error adding favourite restaurant:", error);
      return res.status(500).json({ error: "Error adding favourite restaurant" });
    }
    res.status(200).json(results);
  });
});

// API: Xóa bài viết yêu thích theo id
favouriteRouter.delete("/removeFavourite", (req, res) => {
  const { id } = req.body; // Lấy id từ body của request

  if (!id) {
    return res.status(400).json({ error: "ID of the favourite item is required" });
  }

  const query = `
    DELETE FROM favorites WHERE id = ?
  `;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error removing favourite item:", error);
      return res.status(500).json({ error: "Error removing favourite item" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Favourite item not found" });
    }

    res.status(200).json({ message: "Favourite item removed successfully" });
  });
});

favouriteRouter.post('/getFavourite', async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    // Lấy danh sách ID yêu thích
    const [locations] = await connection.promise().query(`
      SELECT location_id FROM favorites WHERE user_id = ?`, [user_id]);
    const [hotels] = await connection.promise().query(`
      SELECT hotel_id FROM favorites WHERE user_id = ?`, [user_id]);
    const [restaurants] = await connection.promise().query(`
      SELECT restaurant_id FROM favorites WHERE user_id = ?`, [user_id]);

    // Gộp các ID
    const locationIds = locations.map((row) => row.location_id);
    const hotelIds = hotels.map((row) => row.hotel_id);
    const restaurantIds = restaurants.map((row) => row.restaurant_id);

    // Lấy chi tiết từng loại
    const [locationDetails] = await connection.promise().query(`
      SELECT * FROM location WHERE id IN (?)`, [locationIds]);
    const [hotelDetails] = await connection.promise().query(`
      SELECT * FROM hotels WHERE id IN (?)`, [hotelIds]);
    const [restaurantDetails] = await connection.promise().query(`
      SELECT * FROM restaurants WHERE id IN (?)`, [restaurantIds]);

    // Kết quả gộp
    const allFavorites = [
      ...locationDetails,
      ...hotelDetails,
      ...restaurantDetails,
    ];
    console.log(allFavorites);

    res.status(200).json(allFavorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Error fetching favorites" });
  }
});



module.exports = favouriteRouter;
