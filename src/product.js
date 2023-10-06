// Import required packages
const express = require('express');
const mysql = require('mysql');
const connect = require('../dbconnection'); // Import the connect object
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const cors = require('cors');
const Redis = require("ioredis");
const redisClient = new Redis();

// Create an Express app
const app = express();

// Middleware for parsing JSON requests
app.use(bodyParser.json());
app.use(cors());


// const verifyAccessToken = (request, response, next) => {
//     const header = request.headers["authorization"];
    
//     if (!header) {
//         response.status(401);
//         response.send("Invalid Access Token");
//         return;
//     }
    
//     const jwtToken = header.split(" ")[1];
    
//     if (!jwtToken) {
//         response.status(401);
//         response.send("Invalid Access Token");
//         return;
//     }

//     jwt.verify(jwtToken, "token", (error, payload) => {
//         if (error) {
//             response.status(401);
//             response.send("Invalid Access Token");
//         } else {
//             // Token is valid, you can access payload data if needed.
//             // For example: const userId = payload.userId;
//             next();
//         }
//     });
// };


// Create a product (Create operation)

const verifyAccessToken = async (request, response, next) => {
    let jwtToken = await redisClient.get("authorizationToken");
    console.log(jwtToken);
    // const header = request.headers["authorization"];
    // if (header !== undefined) {
    //   jwtToken = header.split(" ")[1];
    // }
    if (jwtToken === null) {
      response.status(401);
      response.send("Invalid Access Token");
    } else {
      jwt.verify(jwtToken, "token", async (error, playLoad) => {
        if (error) {
          response.status(401);
          response.send("Invalid Access Token");
        } else {
          next();
        }
      });
    }
  };





app.post('/api/products', verifyAccessToken, (req, res) => {
    const { product_name, description, product_category, product_price, product_image } = req.body;
    const sqlquery = 'INSERT INTO products (product_name, description, product_category, product_price, product_image) VALUES (?, ?, ?, ?, ?)';
    connect.query(sqlquery, [product_name, description, product_category, product_price, product_image], (err, result) => {
        if (err) {
            console.error('Error creating product: ' + err.message);
            res.status(500).send('Error creating product');
            return;
        }
        res.status(201).json({ message: 'Product created successfully', id: result.insertId });
    });
});


// Fetch product details (Read operation)
app.get('/api/products/:product_id', verifyAccessToken, (req, res) => {
    const productId = req.params.product_id;
    const sqlquery = 'SELECT * FROM products WHERE product_id = ?';
    connect.query(sqlquery, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product details: ' + err.message);
            res.status(500).send('Error fetching product details');
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Update a product (Update operation)
app.put('/api/products/:product_id',  verifyAccessToken, (req, res) => {
    const productId = req.params.product_id;
    const { product_name, description, product_category, product_price, product_image } = req.body;
    const sqlquery = 'UPDATE products SET product_name = ?, description = ?, product_category = ?, product_price = ?, product_image = ? WHERE product_id = ?';
    connect.query(sqlquery, [product_name, description, product_category, product_price, product_image, productId], (err, result) => {
        if (err) {
            console.error('Error updating product: ' + err.message);
            res.status(500).send('Error updating product');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json({ message: 'Product updated successfully' });
        }
    });
});

// Delete a product (Delete operation)
app.delete('/deleteproduct/:product_id', verifyAccessToken, (req, res) => {
    const productId = req.params.product_id;
    const sqlquery = 'DELETE FROM products WHERE product_id = ?';
    connect.query(sqlquery, [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product: ' + err.message);
            res.status(500).json({ message: 'Error deleting product' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(202).json({ message: 'Product deleted successfully' });
        }
    });
});

module.exports = app;