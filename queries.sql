CREATE TABLE products (
    product_id INT ,
    product_name VARCHAR(99),
     description TEXT,
    product_price DECIMAL(10, 2) NOT NULL,
    product_category  VARCHAR(99),
    product_image  VARCHAR(99),
    
    PRIMARY KEY (product id)
);



CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(99),
    user_email VARCHAR(99),
    user_mobilenumber VARCHAR(99),
    user_password VARCHAR(99)
);



-- CREATE TABLE rating_review (
--   rate_id INT AUTO_INCREMENT PRIMARY KEY,
--   user_id INT,
--   product_name VARCHAR(255), -- Assuming the product_name is a string
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

ALTER TABLE products
ADD COLUMN product number INT;

ALTER TABLE products
MODIFY COLUMN product_image VARCHAR(2500); -- Adjust the size (255 in this example)

