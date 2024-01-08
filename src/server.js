//import express from 'express';
const express = require("express");
const rootRouter = require("./routes");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5500;
const mysql = require('mysql2');

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    status: "error",
    message: error.message,
  });
});

// Tạo kết nối
const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
      console.error('Error connecting to database:', err);
      return;
  }
  console.log('Connected to database');
});

app.listen(port, () =>
{
  console.log('server is running on port ${port}');
});


