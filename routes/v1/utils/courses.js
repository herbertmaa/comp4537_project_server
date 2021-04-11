const mysql = require("../../../databases/mysqlDB");

const checkIfCourseExists = async (courseId) => {
  const queryString = `
    SELECT *
    FROM COURSE  
    WHERE ID = '${courseId}'
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


module.exports = checkIfCourseExists;


