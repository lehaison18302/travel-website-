const express = require("express");
const mysql = require("mysql2");
const userRouter = require("express").Router();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'travels-web',
    port: 3307,
  });

  userRouter.get('/user', (req,res) =>{
    try{
      connection.query('SELECT * FROM users', (error, user) => {
        if (error) throw error;
        console.log(user);

      })
    }
    catch(err){
      res.status(500).json(err);
    }
  });
  

module.exports = userRouter;
