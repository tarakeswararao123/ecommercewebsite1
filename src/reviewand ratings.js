const express = require('express');
const mysql = require('mysql');
const connect = require('../dbconnection'); // Import the connect object
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express app
const app = express();

// Middleware for parsing JSON requests
app.use(bodyParser.json());

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

app.post('/review', (req, res) => {
    const { user_id, product_name, rating, review } = req.body;
  
    // Assuming you have already validated and authenticated the user
  
    // First, fetch the existing ratings_reviews JSON from the database
    const fetchSql = 'SELECT rating_review FROM rating_review WHERE user_id = ? AND product_name = ?';
    connect.query(fetchSql, [user_id, product_name], (fetchErr, fetchResults) => {
      if (fetchErr) {
        console.error('Error fetching existing ratings_reviews: ' + fetchErr.message);
        res.status(500).json({ message: 'Error fetching existing ratings_reviews' });
        return;
      }
  
      let existingRatingsReviews = [];
      if (fetchResults.length > 0) {
        // If there are existing ratings_reviews, parse it from JSON
        existingRatingsReviews = JSON.parse(fetchResults[0].ratings_reviews);
      }
  
      // Add the new rating and review to the existing array
      existingRatingsReviews.push({ rating, review });
  
      // Convert the updated array back to JSON
      const updatedRatingsReviews = JSON.stringify(existingRatingsReviews);
  
      // Update the database with the updated ratings_reviews
      const updateSql = 'UPDATE rating_review SET ratings_reviews = ? WHERE user_id = ? AND product_name = ?';
      connect.query(updateSql, [updatedRatingsReviews, user_id, product_name], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error updating ratings_reviews: ' + updateErr.message);
          res.status(500).json({ message: 'Error updating ratings_reviews' });
          return;
        }
  
        // Check if the update was successful
        if (updateResult.affectedRows > 0) {
          res.status(201).json({ message: 'Review and rating posted successfully' });
        } else {
          res.status(404).json({ message: 'User or product not found' });
        }
      });
    });
  });
  

  
// ratings.post('/rating-review',async(req,res)=>{
//     try{
//         const {user_id, ratings_reviews } = req.body;
//         const sql = 'INSERT INTO onelove.rating_review(user_id, ratings_reviews) VALUES(?, ?)';
//         const values = [user_id, JSON.stringify(ratings_reviews)]

//         const [result] = await db.query(sql,values);
//         res.status(200).json({
//             data: result,
//             message: "Data posted"
//         });

//     }catch(err){
//         console.error('Error posting data:', err.message);
//         res.status(400).json({
//             message: err
//         });
//     }
// });


// ratings.post('/rating-review', async (req, res) => {
//     try {
//         const { user_id, ratings_reviews } = req.body;

//         // Check if a row with the specified user_id exists
//         const checkIfExistsQuery = 'SELECT ratings_reviews FROM onelove.rating_review WHERE user_id = ?';
//         const [existingRows] = await db.query(checkIfExistsQuery, [user_id]);

//         let updatedReviews = [];

//         if (existingRows.length > 0) {
//             // If a row exists, fetch the existing JSON array
//             const existingReviews = existingRows[0].ratings_reviews;
            
//             if (Array.isArray(existingReviews)) {
//                 // If it's an array, concatenate the new data
//                 updatedReviews = existingReviews.concat(ratings_reviews);
//             } else {
//                 try {
//                     // If it's not an array, parse it and then concatenate
//                     const parsedReviews = JSON.parse(existingReviews);
//                     updatedReviews = parsedReviews.concat(ratings_reviews);
//                 } catch (parseError) {
//                     // Handle JSON parsing error here
//                     console.error('Error parsing existingReviews:', parseError);
//                     res.status(400).json({
//                         message: 'Error parsing existingReviews',
//                     });
//                     return;
//                 }
//             }
            
//             // Update the JSON data in the database
//             const updateQuery = 'UPDATE onelove.rating_review SET ratings_reviews = ? WHERE user_id = ?';
//             const updateValues = [JSON.stringify(updatedReviews), user_id];
//             await db.query(updateQuery, updateValues);
//         } else {
//             // If no row exists, insert a new row with the new data
//             const insertQuery = 'INSERT INTO onelove.rating_review (user_id, ratings_reviews) VALUES (?, ?)';
//             const insertValues = [user_id, JSON.stringify(ratings_reviews)];
//             await db.query(insertQuery, insertValues);
//         }

//         res.status(200).json({
//             message: "Data posted or updated"
//         });
//     } catch (err) {
//         console.error('Error posting/updating data:', err.message);
//         res.status(400).json({
//             message: err
//         });
//     }
// });





// ratings.get('/rating-review',async(req,res)=>{
//    try{
//     const sql = `SELECT r.,u.,a.,c.,s.*,i.image_id AS user_image_id,i.image_url as user_image_url
//     FROM onelove.rating_review r
//     LEFT JOIN users u ON r.user_id = u.user_id
//     LEFT JOIN address a ON u.address_id = a.address_id
//     LEFT JOIN contact_details c ON u.contact_id = c.contact_id
//     LEFT JOIN images i ON u.image_id = i.image_id
//     LEFT JOIN service s ON u.service_id = s.service_id`;

//     const [result] = await db.query(sql);
//     const ratingData = JSON.parse(JSON.stringify(result));
//     res.status(200).json({
//         ratingData,
//         message: messages.SUCCESS_MESSAGE,
//     });

//       }catch(err){
//         console.error('Error fetching  data:', err);
//         res.status(500).json({
//             message: messages.FAILURE_MESSAGE,
//         });
//      }
// });


// ratings.get('/rating-review-user',async(req,res)=>{
//        const user_id = req.query.user_id

//     try{
//      const sql = `SELECT r.,u.,a.,c.,s.*,i.image_id AS user_image_id,i.image_url as user_image_url
//      FROM onelove.rating_review r
//      LEFT JOIN users u ON r.user_id = u.user_id
//      LEFT JOIN address a ON u.address_id = a.address_id
//      LEFT JOIN contact_details c ON u.contact_id = c.contact_id
//      LEFT JOIN images i ON u.image_id = i.image_id
//      LEFT JOIN service s ON u.service_id = s.service_id
//      WHERE r.user_id = ?`;
 
//      const [result] = await db.query(sql,user_id);
//      const ratingData = JSON.parse(JSON.stringify(result));
//      res.status(200).json({
//          ratingData,
//          message: messages.SUCCESS_MESSAGE,
//      });
 
//        }catch(err){
//          console.error('Error fetching  data:', err);
//          res.status(500).json({
//              message: messages.FAILURE_MESSAGE,
//          });
//       }
//  });


module.exports = app;