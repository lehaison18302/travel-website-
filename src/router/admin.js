const express = require("express");
const mysql = require("mysql2");
const adminRouter = express.Router();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'travels-web',
    port: 3307,
})

adminRouter.get('/admin',(req, res) =>{
    connection.query('SELECT * FROM contact',(err, results) =>{
        if (err) {
            console.error('Error executing query:', error);
            res.status(500).send({ message: 'Error retrieving trip details' });
            return;
        }
        console.log(results);
        res.json(results);
    });
});

module.exports = adminRouter;