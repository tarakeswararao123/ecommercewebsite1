const mysql = require('mysql2');

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql@roone',
  database: 'ecommerce',
  port: '3306'
});

db.connect((err) => {
  if (err) throw err;
  else{
  console.log('Connected to MySQL');
  }
});

module.exports = db;