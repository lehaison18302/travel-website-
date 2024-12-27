const express = require("express");
const rootRouter = require("./router");
const cors = require("cors");
const mysql = require("mysql2");
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
 // app.use("/api/v1", rootRouter);
 app.use("/", rootRouter);

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

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'travels-web',
  port: 3307,
});

connection.connect((error) => {
  if (error) {
      console.error('Error connecting to MySQL database:', error);
      return;
  }
  console.log('Connected to MySQL database successfully!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
