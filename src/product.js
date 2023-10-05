// Import required packages
const express = require('express');
const mysql = require('mysql');
const connect = require('../dbconnection'); // Import the connect object
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express app
const app = express();

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Create a product (Create operation)
app.post('/api/products', (req, res) => {
    const { product_name, description, product_category, product_price, product_image } = req.body;
    const sql = 'INSERT INTO products (product_name, description, product_category, product_price, product_image) VALUES (?, ?, ?, ?, ?)';
    connect.query(sql, [product_name, description, product_category, product_price, product_image], (err, result) => {
        if (err) {
            console.error('Error creating product: ' + err.message);
            res.status(500).send('Error creating product');
            return;
        }
        res.status(201).json({ message: 'Product created successfully', id: result.insertId });
    });
});


// Fetch product details (Read operation)
app.get('/api/products/:product_id', (req, res) => {
    const productId = req.params.product_id;
    const sql = 'SELECT * FROM products WHERE product_id = ?';
    connect.query(sql, [productId], (err, results) => {
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
app.put('/api/products/:product_id', (req, res) => {
    const productId = req.params.product_id;
    const { product_name, description, product_category, product_price, product_image } = req.body;
    const sql = 'UPDATE products SET product_name = ?, description = ?, product_category = ?, product_price = ?, product_image = ? WHERE product_id = ?';
    connect.query(sql, [product_name, description, product_category, product_price, product_image, productId], (err, result) => {
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
app.delete('/deleteproduct/:product_id', (req, res) => {
    const productId = req.params.product_id;
    const sql = 'DELETE FROM products WHERE product_id = ?';
    connect.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product: ' + err.message);
            res.status(500).json({ message: 'Error deleting product' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(204).json({ message: 'Product deleted successfully' });
        }
    });
});

module.exports = app;