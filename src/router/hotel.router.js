const express = require('express');
const mysql = require("mysql2");
const hotelRouter = express.Router();

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
  
  hotelRouter.get('/hotels',(req,res) =>{
    const query = 'SELECT * FROM hotels';
    connection.query(query, (err,results) =>{
      res.json(results);
    });
  });
  
  hotelRouter.get('/hotelID/:id', (req, res) => {
    const id = req.params.id;
  
    const query = 'SELECT * FROM hotels WHERE id = ?';
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send({ message: 'Error retrieving hotel details' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ message: 'Hotel not found' });
        return;
      }
  
      res.status(200).json(results[0]);
    });
  });
  
  module.exports = hotelRouter;