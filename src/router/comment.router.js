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

// API: Lấy bình luận cho nhà hàng
commentRouter.get("/commentsRestaurant", (req, res) => {
  const { restaurant_id } = req.query;
  console.log("Restaurant ID:", restaurant_id);

  if (!restaurant_id) {
    return res.status(400).json({ error: "restaurant_id is required" });
  }

  const query = `
    SELECT comments_restaurant.id, 
           comments_restaurant.comment_text, 
           comments_restaurant.created_at, 
           users.displayName 
    FROM comments_restaurant
    JOIN users ON comments_restaurant.user_id = users.id
    WHERE comments_restaurant.restaurant_id = ?
    ORDER BY comments_restaurant.created_at DESC
  `;

  connection.query(query, [restaurant_id], (error, results) => {
    if (error) {
      console.error("Error fetching comments for restaurant:", error);
      return res.status(500).json({ error: "Error fetching comments" });
    }
    res.status(200).json(results);
  });
});

// API: Thêm mới bình luận cho nhà hàng
commentRouter.post("/commentsRestaurant", (req, res) => {
  const { restaurant_id, user_id, comment_text } = req.body;
  console.log("Received Restaurant Comment Data:", req.body);

  if (!restaurant_id || !user_id || !comment_text) {
    return res.status(400).json({ error: "restaurant_id, user_id, and comment_text are required" });
  }

  const query = `
    INSERT INTO comments_restaurant (restaurant_id, user_id, comment_text, created_at)
    VALUES (?, ?, ?, NOW())
  `;

  connection.query(query, [restaurant_id, user_id, comment_text], (error, results) => {
    if (error) {
      console.error("Error adding comment for restaurant:", error);
      return res.status(500).json({ error: "Error adding comment" });
    }
    res.status(201).json({ message: "Comment added successfully", id: results.insertId });
  });
});

// API: Xóa bình luận từ bảng comments_location
commentRouter.delete("/deleteCommentLocation", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Comment ID is required" });
  }

  const query = `DELETE FROM comments_location WHERE id = ?`;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting comment from comments_location:", error);
      return res.status(500).json({ error: "Error deleting comment" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  });
});

// API: Sửa bình luận từ bảng comments_location
commentRouter.put("/editCommentLocation", (req, res) => {
  const { id, comment } = req.body;

  if (!id || !comment) {
    return res.status(400).json({ error: "Comment ID and updated comment text are required" });
  }

  const query = `UPDATE comments_location SET comment = ?, updated_at = NOW() WHERE id = ?`;

  connection.query(query, [comment, id], (error, results) => {
    if (error) {
      console.error("Error updating comment in comments_location:", error);
      return res.status(500).json({ error: "Error updating comment" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment updated successfully" });
  });
});

// API: Xóa bình luận từ bảng comments_hotel
commentRouter.delete("/deleteCommentHotel", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Comment ID is required" });
  }

  const query = `DELETE FROM comments_hotel WHERE id = ?`;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting comment from comments_hotel:", error);
      return res.status(500).json({ error: "Error deleting comment" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  });
});

// API: Sửa bình luận từ bảng comments_hotel
commentRouter.put("/editCommentHotel", (req, res) => {
  const { id, comment_text } = req.body;

  if (!id || !comment_text) {
    return res.status(400).json({ error: "Comment ID and updated comment text are required" });
  }

  const query = `UPDATE comments_hotel SET comment_text = ?, updated_at = NOW() WHERE id = ?`;

  connection.query(query, [comment_text, id], (error, results) => {
    if (error) {
      console.error("Error updating comment in comments_hotel:", error);
      return res.status(500).json({ error: "Error updating comment" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment updated successfully" });
  });
});

// API: Xóa bình luận từ bảng comments_restaurant
commentRouter.delete("/deleteCommentRestaurant", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Comment ID is required" });
  }

  const query = `DELETE FROM comments_restaurant WHERE id = ?`;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting comment from comments_restaurant:", error);
      return res.status(500).json({ error: "Error deleting comment" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  });
});

// API: Sửa bình luận từ bảng comments_restaurant
commentRouter.put("/editCommentRestaurant", (req, res) => {
  const { id, comment_text } = req.body;

  if (!id || !comment_text) {
    return res.status(400).json({ error: "Comment ID and updated comment text are required" });
  }

  const query = `UPDATE comments_restaurant SET comment_text = ?, updated_at = NOW() WHERE id = ?`;

  connection.query(query, [comment_text, id], (error, results) => {
    if (error) {
      console.error("Error updating comment in comments_restaurant:", error);
      return res.status(500).json({ error: "Error updating comment" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment updated successfully" });
  });
});

module.exports = commentRouter;
