const express = require("express");
const mysql = require("mysql2");
const contactRouter = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'travels-web',
  port: 3307,
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
});

// Middleware để phân tích cú pháp JSON
contactRouter.use(express.json());

// API POST để nhận form từ client
contactRouter.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)';
  connection.query(query, [name, email, message], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send({ message: 'Error saving contact message' });
    }
    res.status(200).send({ message: 'Message sent successfully' });
  });
});

module.exports = contactRouter;