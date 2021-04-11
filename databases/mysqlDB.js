const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  multipleStatements: true,
});

connection.connect(err => {
  if(err){
    console.error('Connection error', err.stack)
  }else{
    console.log("Connected to MYSQL DB successfully");
  }
});

module.exports = connection;