const { verifyToken, decodeToken } = require("./utils/tokens");
const mysql = require("../../databases/mysqlDB");
const { checkIfUserExistsById } = require("../v1/utils/users");
const checkIfCourseExists = require("../v1/utils/courses");
const { checkIfFavoriteExists, createFavorite, deleteFavorite } = require("../v1/utils/favorites");

const handler = async (req, res) => {

  // User must provide a valid token
  if (!req.body.token || !verifyToken(req.body.token)) {

    console.log(req.method);
    console.log(req);
    res.status(403).json({
      status: "error",
      error: "Invalid request: Token provided is invalid",
    });
    return;
  }

  switch (req.method) {
    case "GET":
      req.app.locals.favorites.getCount++;
      return getHandler(req, res);
    case "PUT":
      req.app.locals.favorites.putCount++;
      res.status(400).json({status: "error", error: "Invalid request"});
      return;
    case "DELETE":
      req.app.locals.favorites.deleteCount++;
      deleteHandler(req, res);
      return;
    case "POST":
      req.app.locals.favorites.postCount++;
      postHandler(req, res);
      return;
    }
};

// ENDPOINT HANDLER
// Gets all the favorites for a user
const getHandler = async (req, res) => {
  const payload = decodeToken(req.body.token);
  if(payload.id){
    const favorites = await getFavorites(payload.id);
    res.status(200).json(favorites);
  }else{
    res.status(400).json({status: "error", error: "No personId provided"})
  }
};

const postHandler = async (req, res) => {
    if(req.body.courseId){

    const payload = decodeToken(req.body.token);

    // Check if course and user exists
    const courseExists = await checkIfCourseExists(req.body.courseId);
    const favoriteExists = await checkIfFavoriteExists(req.body.personId, req.body.courseId);

    if(courseExists && !favoriteExists){
      // Create a favorite
      const result = await createFavorite(payload.id, req.body.courseId);
      res.status(200).json({status: "success"}); // Display a heart if this response is received on client side
    }else{
      res.status(400).json({status: "error", error: "Bad request, invalid parameters"});
    }
  }
  else{
    res.status(400).json({status: "error", error: "Bad request, missing parameters"})
  }
};

const deleteHandler = async (req, res) => {

  if(req.body.courseId){

    const payload = decodeToken(req.body.token);

    const courseExists = await checkIfCourseExists(req.body.courseId);
    const favoriteExists = await checkIfFavoriteExists(payload.id, req.body.courseId);

    if(courseExists && favoriteExists){
      // Create a favorite
      const result = await deleteFavorite(payload.id, req.body.courseId);
      res.status(200).json({status: "success"}); // Display a heart if this response is received on client side
    }else{
      res.status(400).json({status: "error", error: "Bad request, invalid parameters"});
    }
  }
  else{
    res.status(400).json({status: "error", error: "Bad request, missing parameters"})
  }

};


// Helper function for getting all courses
const getFavorites = async (personId) => {
  return new Promise((resolve, reject) => {
    const queryCourses = `
      SELECT c.CourseName, c.Description, c.ID
      FROM FAVORITE_COURSE f
      INNER JOIN COURSE c 
      ON c.ID = f.CourseID 
      INNER JOIN PERSON p
      ON f.PersonID = p.ID 
      WHERE f.PersonID = ${personId}
    `;

    mysql.query(queryCourses, (err, rows) => {
      if (err) {
        console.log(err);
        reject({
          status: "error",
          error: err,
        });
      }
      resolve(rows.length > 0 ? rows : []);

    });
  });
};

module.exports = handler;
