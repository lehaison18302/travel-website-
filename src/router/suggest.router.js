const express = require('express');
const mysql = require("mysql2");
const suggestRouter = express.Router();

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
  
  suggestRouter.get('/suggestLocation', (req, res) => {
    const query = `
      SELECT id, title, address, latitude, longitude, rating, ratingCount, category, image, phoneNumber, website
      FROM location
      ORDER BY rating DESC, ratingCount DESC
      LIMIT 10
    `;
  
    connection.query(query, (error, results1) => {
      if (error) {
        console.error("Error fetching suggested locations:", error);
        return res.status(500).json({ error: "Error fetching suggested locations" });
      }
  
      res.status(200).json(results1);
    });
  });

  suggestRouter.get('/suggestHotel', (req, res) => {
    const query = `
      SELECT id, title, address, latitude, longitude, rating, ratingCount, category, image, phoneNumber, website
      FROM hotels
      ORDER BY rating DESC, ratingCount DESC
      LIMIT 10
    `;
  
    connection.query(query, (error, results2) => {
      if (error) {
        console.error("Error fetching suggested hotels:", error);
        return res.status(500).json({ error: "Error fetching suggested hotels" });
      }
  
      res.status(200).json(results2);
    });
  });

  suggestRouter.get('/suggestRestaurant', (req, res) => { //con thieu truong image cua restaurant
    const query = `
      SELECT id, title, address, latitude, longitude, rating, ratingCount, category, image, phoneNumber, website 
      FROM restaurants
      ORDER BY rating DESC, ratingCount DESC
      LIMIT 10
    `;
  
    connection.query(query, (error, results3) => {
      if (error) {
        console.error("Error fetching suggested restaurants:", error);
        return res.status(500).json({ error: "Error fetching suggested restaurants" });
      }
  
      res.status(200).json(results3);
    });
  });
  
  
  module.exports = suggestRouter;