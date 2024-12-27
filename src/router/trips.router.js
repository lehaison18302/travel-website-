const express = require("express");
const mysql = require("mysql2");
const tripsRouter = express.Router();

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

tripsRouter.get('/trips',(req,res) =>{
  const query = 'SELECT * FROM location';
  connection.query(query, (err,results) =>{
    res.json(results);
  });
});



tripsRouter.get("/tripID/:id", (req, res) => {
  const tripId = req.params.id;


  const query = "SELECT * FROM location WHERE id = ?";
  connection.query(query, [tripId], (error, results) => {
    if (error) {
      console.error("Error fetching trip details:", error);
      return res.status(500).json({ error: "Error fetching trip details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json(results[0]);
  });
});

module.exports = tripsRouter;