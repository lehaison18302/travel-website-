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
  const query = 'SELECT * FROM trips';
  connection.query(query, (err,results) =>{
    res.json(results);
  });
});



tripsRouter.get('/tripsID/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);

    const query = 'SELECT * FROM tripdetails WHERE id = ?';
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send({ message: 'Error retrieving trip details' });
        return;
      }

      if (results.length === 0) {
        res.status(404).send({ message: 'Trip not found' });
        return;
      }

      console.log(results);
      res.status(200).json(results[0]);
    });
});

module.exports = tripsRouter;