const mysql = require("../../../databases/mysqlDB");

const checkIfUserExistsById = async (personId) => {
  const queryString = `
    SELECT *
    FROM PERSON  
    WHERE ID = '${personId}'
  `
  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if(err){
        reject({
          status: "error",
          error: err,
        });
      }else{
        resolve(rows.length > 0);
      }
    });
  });

};

const checkIfUserExistsByEmail = async (email) => {
  const queryString = `
    SELECT *
    FROM PERSON  
    WHERE Email = '${email}'
  `
  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if(err){
        reject({
          status: "error",
          error: err,
        });
      }else{
        resolve(rows.length > 0);
      }
    });
  });

};

// Must check that the user exists by email before calling this method
const getUserIdByEmail = async (email) => {
  const queryString = `
    SELECT ID
    FROM PERSON
    WHERE Email = '${email}';
  `
  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if(err){
        reject({
          status: "error",
          error: err,
        });
      }else{
        resolve(rows[0].ID);
      }
    });
  });
}

module.exports = { checkIfUserExistsById, checkIfUserExistsByEmail, getUserIdByEmail};


