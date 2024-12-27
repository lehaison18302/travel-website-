const express = require("express");
const mysql = require("mysql2");
const commentRouter = express.Router();

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

// API: Lấy bình luận cho khách sạn
commentRouter.get("/commentsHotel", (req, res) => {
  const { hotel_id } = req.query;
  console.log("Hotel ID:", hotel_id);

  if (!hotel_id) {
    return res.status(400).json({ error: "hotel_id is required" });
  }

  const query = `
    SELECT comments_hotel.id, 
           comments_hotel.comment_text, 
           comments_hotel.created_at, 
           users.displayName 
    FROM comments_hotel
    JOIN users ON comments_hotel.user_id = users.id
    WHERE comments_hotel.hotel_id = ?
    ORDER BY comments_hotel.created_at DESC
  `;

  connection.query(query, [hotel_id], (error, results) => {
    if (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Error fetching comments" });
    }
    res.status(200).json(results);
  });
});

// API: Thêm mới bình luận khách sạn
commentRouter.post("/commentsHotel", (req, res) => {
  const { hotel_id, user_id, comment_text } = req.body;
  console.log("Received Comment Data:", req.body);

  if (!hotel_id || !user_id || !comment_text) {
    return res.status(400).json({ error: "hotel_id, user_id, and comment_text are required" });
  }

  const query = `
    INSERT INTO comments_hotel (hotel_id, user_id, comment_text, created_at)
    VALUES (?, ?, ?, NOW())
  `;

  connection.query(query, [hotel_id, user_id, comment_text], (error, results) => {
    if (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ error: "Error adding comment" });
    }
    res.status(201).json({ message: "Comment added successfully", id: results.insertId });
  });
});

// API: Lấy bình luận cho địa điểm
commentRouter.get("/commentsLocation", (req, res) => {
  const { trip_id } = req.query;

  if (!trip_id) {
    return res.status(400).json({ error: "trip_id is required" });
  }

  const query = `
    SELECT comments_location.id AS comment_id, 
           comments_location.comment AS comment_text, 
           comments_location.created_at AS comment_created_at, 
           users.displayName AS user_display_name
    FROM comments_location
    INNER JOIN users 
    ON comments_location.user_id = users.id
    WHERE comments_location.location_id = ?
    ORDER BY comments_location.created_at DESC
  `;

  connection.query(query, [trip_id], (error, results) => {
    if (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Error fetching comments" });
    }
    res.status(200).json(results);
    console.log(results);
  });
});

// API: Thêm mới bình luận địa điểm
commentRouter.post("/commentsLocation", (req, res) => {
  const { trip_id, user_id, comment } = req.body;

  if (!trip_id || !user_id || !comment) {
    return res.status(400).json({ error: "trip_id, user_id, and comment are required" });
  }

  const query = `
    INSERT INTO comments_location 
    (location_id, user_id, comment, created_at) 
    VALUES (?, ?, ?, NOW())
  `;

  connection.query(query, [trip_id, user_id, comment], (error, results) => {
    if (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ error: "Error adding comment" });
    }

    res.status(201).json({ 
      message: "Comment added successfully", 
      comment_id: results.insertId 
    });
  });
});

module.exports = commentRouter;
