// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const mysql = require("../../databases/mysqlDB");
const { verifyToken, decodeToken } = require("./utils/tokens");
const { checkIfRole, checkRoleById } = require("./utils/roles");
const { checkIfUserExistsById} = require("../v1/utils/users");

// SWITCH CASES FOR ENDPOINTS
const handler = async (req, res) => {

  // User must provide a valid token
  if (!req.body.token || !verifyToken(req.body.token)) {
    res.status(403).json({
      status: "error",
      error: "Invalid request: Token provided is invalid",
    });
    return;
  }

  // The user has provided a valid token
  switch (req.method) {
    case "GET":
      req.app.locals.courses.getCount++;
      return getHandler(req, res);
    case "PUT":
      req.app.locals.courses.putCount++;
      return putHandler(req, res);
    case "DELETE":
      req.app.locals.courses.deleteCount++;
      return deleteHandler(req, res);
    case "POST":
      req.app.locals.courses.postCount++;
      return postHandler(req, res);
  }
};

// ENDPOINT HANDLER
const getHandler = async (req, res) => {
  const result = await getCourses();
  return res.status(200).json(result);
};

// ENDPOINT HANDLER
const putHandler = async (req, res) => {
  
  const payload = decodeToken(req.body.token);

  if(!payload){
    res.status(400).json({status: "error", error: "Invalid token"});
    return;
  }

  // Only admins / teachers can edit a course
  if (!checkIfRole(payload.role, ["ADMIN", "TEACHER"])) {
    res.status(403).json({
      status: "error",
      error: "Invalid permissions",
    });
    return;
  }

  if(!req.body.courseName || !req.body.description || !req.body.personId){
    res.status(400).json({
      status: "error",
      error: "Missing query information"
    });
    return;
  }

  const courseExists = await checkIfCourseExists(req.body.courseName);

  if(!courseExists){
    res.status(400).json({
      status: "error",
      error: "Course name does not exist"
    });
    return;
  }
  
  // User with provided email should exist
  const userExists = await checkIfUserExistsById(req.body.personId);

  if(!userExists){
    res.status(400).json({
      status: "error",
      error: "User with provided id does not exist",
    });
    return;
  }

  // User with provided ID should be a professor
  const userRole = await checkRoleById(req.body.personId);

  if(userRole !== "PROFESSOR"){
    res.status(400).json({
      status: "error",
      error: "Id provided is not a professor's account",
    });
    return;
  }
  await updateCourse(req.body.courseName, req.body.description, req.body.personId);
  res.status(200).json({
    success: true,
    CourseName: req.body.courseName,
    CourseDescription: req.body.description
  });
  
};

// ENDPOINT HANDLER
const postHandler = async (req, res) => {
  
  // Body should have a courseName
  if (!req.body.courseName) {
    res.status(400).json({
      status: "error",
      error: "No course name provided",
    });
    return;
  }

  // Body should have a description
  if (!req.body.description) {
    res.status(400).json({
      status: "error",
      error: "No description provided",
    });
    return;
  }

  // Body should have an ID
  if (!req.body.personId) {
    res.status(400).json({
      status: "error",
      error: "No id provided",
    });
    return;
  }

  // User with provided id should exist
  const userExists = await checkIfUserExistsById(req.body.personId);

  if(!userExists){
    res.status(400).json({
      status: "error",
      error: "User with provided id does not exist",
    });
    return;
  }

  // User with provided id should be a professor
  const userRole = await checkRoleById(req.body.personId);

  if(userRole !== "PROFESSOR"){
    res.status(400).json({
      status: "error",
      error: "ID provided is not a professor's ID",
    });
    return;
  }

  // The creator of this course must be an admin
  const payload = decodeToken(req.body.token);

  if (!checkIfRole(payload.role, ["ADMIN"])) {
    res.status(403).json({
      status: "error",
      error: "Invalid permissions",
    });
    return;
  }

  // Remove extra spacing from the name and the description
  req.body.courseName = req.body.courseName.trim();
  req.body.description = req.body.description.trim();

  // Check the course name format 
  if (verifyCourseNameFormat(req.body.courseName) === false) {
    res.status(403).json({
      status: "error",
      error: "Invalid course name",
    });
    return;
  }

  // Course should not already exist
  const courseExists = await checkIfCourseExists(req.body.courseName);

  if (courseExists === true) {
    res.status(403).json({
      status: "error",
      error: "Course already exists",
    });
    return;
  }


  const response = await createCourse(req.body.courseName, req.body.description, req.body.personId);
  if (response.status) {
    res.status(400).json(response);
    
  } else {
    res.status(201).json({
      success: true,
      response,
    });
  }
};

// ENDPOINT HANDLER
const deleteHandler = (req, res) => {
  //TODO
  res.status(200).json({ CourseName: "COMP1234" });
};

// Must check if the course already exists before calling this method
// Helper function for creating a course
const createCourse = (courseName, description, professorId) => {
  const queryString = `
    INSERT INTO COURSE (CourseName, Description, PersonID)
    VALUES('${courseName}', '${description}', '${professorId}');
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      resolve(rows);
    });
  });
};

// Helper functionfor verifying if a course exists
const checkIfCourseExists = (courseName) => {
  const courseNameFormatted = courseName.toUpperCase();
  const queryString = `
    SELECT * FROM COURSE
    WHERE CourseName = '${courseNameFormatted}';
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      resolve(rows.length > 0);
    });
  });
};

// Helper function for verifying course name format
const verifyCourseNameFormat = (courseName) => {
  if (courseName.length != 8) return false;
  const regex = new RegExp(/\b\D{4}\d{4}\b/gm);
  return regex.test(courseName);
};

// Helper function for getting all courses
const getCourses = async () => {
  return new Promise((resolve, reject) => {
    const queryCourses = `SELECT * FROM COURSE`;

    mysql.query(queryCourses, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      resolve(rows);
    });
  });
};


// Helper function to modify the description of a course
// Does not perform checks to see if the course exists
// Does not perform checks to see if the user is a professor
const updateCourse = async (courseName, newDescription, personId) => {
  const queryString = `
    UPDATE COURSE
    SET DESCRIPTION = '${newDescription}', PersonID = '${personId}'
    WHERE CourseName = '${courseName}'
  `
  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if(err){
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

module.exports = handler;
