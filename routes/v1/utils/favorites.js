const mysql = require("../../../databases/mysqlDB");

const checkIfFavoriteExists = async (personId, courseId) => {
  const queryString = `
    SELECT *
    FROM FAVORITE_COURSE  
    WHERE PersonId = '${personId}' && CourseId = '${courseId}';
  `
  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if(err){

        console.log(err);
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


// Does not check if any of the parameters are valid
// Must perform checks before calling this function

const createFavorite = async(personId, courseId) => {

  const queryString = `
    INSERT INTO FAVORITE_COURSE
    (PersonID, CourseID)
    VALUES('${personId}', '${courseId}');
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if(err){

        console.log(err);
        reject({
          status: "error",
          error: err,
        });
      }else{
        resolve(rows);
      }
    });
  });
}

const deleteFavorite = (personId, courseId) => {

  const queryString = `
    DELETE FROM FAVORITE_COURSE
    WHERE PersonID = '${personId}' AND CourseID = '${courseId}';
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if(err){

        console.log(err);
        reject({
          status: "error",
          error: err,
        });
      }else{
        resolve(rows);
      }
    });
  });

}

module.exports = { checkIfFavoriteExists, createFavorite, deleteFavorite};


