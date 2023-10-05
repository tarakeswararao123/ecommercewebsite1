DROP TABLE IF EXISTS product;

CREATE TABLE product (
    'product_id' INT NOT NULL AUTO_INCREMENT,
    'product_name' VARCHAR(99) NOT NULL,
    'description' TEXT,
    'product_price' DECIMAL(10, 2) NOT NULL,
    'product_category' VARCHAR(99) NOT NULL,
    'product_image' VARCHAR(99) NOT NULL,
    
    PRIMARY KEY (product id)
);
CREATE TABLE users (
    users_firstname VARCHAR(99),
     users_lastname VARCHAR(99),
     user_password VARCHAR(99),
     user_gmail VARCHAR(99)
    

);
-- CREATE TABLE rating_review (
--   rate_id INT PRIMARY KEY AUTO_INCREMENT,
--   user_id INT,
--   ratings_reviews JSON,
--   FOREIGN KEY (user_id) REFERENCES users(user_id)
-- );

CREATE TABLE rating_review (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL,
  review TEXT NOT NULL
);

-- CREATE DATABASE myecommerce;
-- USE myecommerce;

-- CREATE TABLE products (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   description TEXT,
--   price DECIMAL(10, 2) NOT NULL
-- );
