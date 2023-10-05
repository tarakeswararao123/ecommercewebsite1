const express = require('express');
const app = express.Router();
const connect = require('../dbconnection'); // Import the connect object
app.use(express.json())
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { request } = require('../app');

const verifyAccessToken = (request, response, next) => {
    let jwtToken = null;
    const header = request.headers["authorization"];
    if (header !== undefined) {
        jwtToken = header.split(" ")[1];
    }
    if (jwtToken === undefined) {
        response.status(401);
        response.send("Invalid Access Token");
    } else {
        jwt.verify(jwtToken, "token", async (error, payload) => {
            if (error) {
                response.status(401);
                response.send("Invalid Access Token");
            } else {
                next();
            }
        });
    }
};

// register API
// app.post("/register", async (req, res) => {
//     // console.log(req.body);
//     const { id, name, username, password, gender, } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 15);
//     const checkUserQuery = "SELECT * FROM users WHERE username = ?";
//     const verifiedUser =  null;
//     connect.query(checkUserQuery, [username], (err, result)=>{
//         if(err){
//             res.status(400)
//         }else{
//             console.log(result);
//             if (result.length === 0) {
//                 const createUserQuery = "INSERT INTO users ( id, name, username, password, gender, ) VALUES (?, ?, ?, ?, ?,?)";
//                  connect.query(createUserQuery, [ id, name, username, hashedPassword, gender, ]);
//                 res.status(201).send("User created successfully");
//               } else {
//                 res.status(400).send("The user name is already exists");
//               }
//         }
//     });

//   });
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
// app.post("/login", async (req, res) =>{
//     const {username, password} =req.body;
//     const checkUserQuery = "SELECT * FROM user WHERE username = ?";
//     connect.query(checkUserQuery, [username],  async (err, result)=>{
//         if(err){
//             res.status(400)
//         }else{
//             if (result.length !== 0) {
//                 // res.send("login succesfull")
//                 const resultpassword = result[0].password
//                 const verifypassword = await bcrypt.compare(password, resultpassword);
//                 // console.log(verifypassword);
//                 if(verifypassword) {
//                     const payload = {username: username}
//                     const jwttoken = jwt.sign(payload, "token");
//                     res.send({jwttoken});
//                 }
//               } else {
//                 res.status(400).send("The user name is already exists");
//               }
//         }
//     });
// })

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