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

    const fetchQuery = `
      SELECT * FROM locations WHERE id = ?
    `;

    connection.query(fetchQuery, [location_id], (error, locationData) => {
      if (error) {
        console.error("Error fetching location data:", error);
        return res.status(500).json({ error: "Error fetching location data" });
      }

      res.status(201).json({ message: "Location favourited successfully", data: locationData });
    });
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

    const fetchQuery = `
      SELECT * FROM hotels WHERE id = ?
    `;

    connection.query(fetchQuery, [hotel_id], (error, hotelData) => {
      if (error) {
        console.error("Error fetching hotel data:", error);
        return res.status(500).json({ error: "Error fetching hotel data" });
      }

      res.status(201).json({ message: "Hotel favourited successfully", data: hotelData });
    });
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

    const fetchQuery = `
      SELECT * FROM restaurants WHERE id = ?
    `;

    connection.query(fetchQuery, [restaurant_id], (error, restaurantData) => {
      if (error) {
        console.error("Error fetching restaurant data:", error);
        return res.status(500).json({ error: "Error fetching restaurant data" });
      }

      res.status(201).json({ message: "Restaurant favourited successfully", data: restaurantData });
    });
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

favouriteRouter.get("/favouriteLocation1", async (req, res) => {
  try {
    // Kết nối đến database
    const connection = await mysql.createConnection(dbConfig);

    // Lấy danh sách location_id từ bảng favorites
    const [favoriteRows] = await connection.query("SELECT location_id FROM favorites");

    if (favoriteRows.length === 0) {
      res.status(404).json({ message: "Không tìm thấy dữ liệu trong bảng favorites." });
      return;
    }

    // Lấy thông tin từ bảng locations dựa trên location_id
    const locationIds = favoriteRows.map((row) => row.location_id); // Mảng location_id
    const [locationRows] = await connection.query(
      `SELECT * FROM locations WHERE id IN (?)`,
      [locationIds]
    );

    // Đóng kết nối
    await connection.end();

    // Trả về kết quả
    res.status(200).json({ locations: locationRows });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
});


module.exports = favouriteRouter;
