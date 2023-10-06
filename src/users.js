const express = require('express');
const app = express.Router();
const connect = require('../dbconnection'); // Import the connect object
app.use(express.json())
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { request } = require('../app');
const Redis = require("ioredis");
const redisClient = new Redis();



// register API

app.post('/register', async (req, res) => {
    const { user_name, user_email, user_mobilenumber, user_password } = req.body;
    const hashedPassword = await bcrypt.hash(user_password, 15);

    const checkUserQuery = "SELECT * FROM users WHERE user_name = ?";

    connect.query(checkUserQuery, [user_name], (err, result) => {
        if (err) {
            res.status(400).send("Error occurred while checking user");
        } else {
            console.log(result);
            if (result.length === 0) {
                const createUserQuery = "INSERT INTO users (user_name, user_email, user_mobilenumber, user_password) VALUES (?, ?, ?, ?)";
                connect.query(createUserQuery, [user_name, user_email, user_mobilenumber, hashedPassword], (err, result) => {
                    if (err) {
                        res.status(400).send("Error occurred while creating user");
                    } else {
                        res.status(201).send("User created successfully");
                    }
                });
            } else {
                res.status(400).send("The user name already exists");
            }
        }
    });
});




// login api

app.post("/login", async (req, res) => {
    const { user_mobilenumber, user_password } = req.body;
    const checkUserQuery = "SELECT * FROM users WHERE user_mobilenumber = ?";
    
    connect.query(checkUserQuery, [user_mobilenumber], async (err, result) => {
        if (err) {
            res.status(400).send("Error occurred while logging in");
        } else {
            if (result.length === 1) { // Check for a single user matching the mobile number
                const storedPassword = result[0].user_password;
                const isPasswordValid = await bcrypt.compare(user_password, storedPassword);
                
                if (isPasswordValid) {
                    const payload = { user_mobilenumber: user_mobilenumber };
                    const jwttoken = jwt.sign(payload, "token"); // Replace with your secret key
                    await redisClient.set(
                        "authorizationToken",
                        jwttoken,
                        "EX",
                        1800
                      );
                    res.send({ jwttoken });
                } else {
                    res.status(400).send("Incorrect password");
                }
            } else {
                res.status(400).send("User not found");
            }
        }
    });
});

module.exports = app;