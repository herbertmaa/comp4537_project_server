const mysql = require("../../databases/mysqlDB");
const { verifyToken, decodeToken } = require("./utils/tokens");
const checkIfCourseExists = require("./utils/courses");

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
      req.app.locals.enrollments.getCount++;
      return getHandler(req, res);
    case "PUT":
      req.app.locals.enrollments.putCount++;
      res.status(400).json({status: "error", error: "Invalid request"});
      return;
    case "DELETE":
      req.app.locals.enrollments.deleteCount++;
      return deleteHandler(req, res);
    case "POST":
      req.app.locals.enrollments.postCount++;
      return postHandler(req, res);
  }
};

// ENDPOINT HANDLER
const getHandler = async (req, res) => {

  // Token has already been verified from the handler

  const payload = decodeToken(req.body.token);

  // If for some reason the token does not have a role
  if(!payload.role){
    res.status(400).json({status: "error", error: "Invalid request"});
    return;
  }

  // Handle student viewing all courses they've enrolled into
  if(payload.role === "STUDENT"){
    const result = await getStudentEnrolledCourses(payload.id);
    res.status(200).json(result);
    return;
  } else if(payload.role === "PROFESSOR"){
    // Handle teacher viewing all courses they're teaching
    const result = await getProfesserEnrolledCourses(payload.id);
    res.status(200).json(result);
    return;
  }else{
    res.status(400).json({
      status: "error",
      error: "Invalid request"
    });
  }


  
};

``
// ENDPOINT HANDLER
const postHandler = async (req, res) => {
  
  // Token has already been verified from the handler

  const payload = decodeToken(req.body.token);

  // If for some reason the token does not have a role
  if(!payload.role){
    res.status(400).json({status: "error", error: "Invalid request"});
    return;
  }

  if(!req.body.courseId){
    res.status(400).json({status: "error", error: "Invalid request, missing courseId"});
    return;
  }

  // Handle student viewing all courses they've enrolled into
  if(payload.role === "STUDENT"){

    const courseExists = await checkIfCourseExists(req.body.courseId);

    if(!courseExists){
      res.status(400).json({status: "error", error: "Course does not exist"});
      return;
    }
    // Handle student enrolling in a course
    const enrolled = await checkIfStudentEnrolled(payload.id, req.body.courseId);

    if(enrolled === false){
      const added = await addStudentEnrollment(payload.id, req.body.courseId);
      res.status(200).json({status: "success", added});
      return;
    }else{
      res.status(400).json({status: "error", error: "Student already enrolled"});
      return;
    }

  } else if(payload.role === "PROFESSOR"){
    // Handle teacher enrolling in a course
    const enrolled = await checkIfProfessorEnrolled(payload.id, req.body.courseId);

    if(enrolled) {
      res.status(400).json({status: "error", error: "Invalid request, professor already enrolled"});
      return;
    }

    const added = await addProfessorEnrollment(payload.id, req.body.courseId);

    if(added !== true){
      res.status(400).json({status: "error", error: added});
      return;
    }else{
      res.status(200).json({status: "success", added});
      return;
    }
  }
};

// ENDPOINT HANDLER
const deleteHandler = async (req, res) => {
  
  // Token has already been verified from the handler

  const payload = decodeToken(req.body.token);

  // If for some reason the token does not have a role
  if(!payload.role){
    res.status(400).json({status: "error", error: "Invalid request"});
    return;
  }
  if(!req.body.courseId){
    res.status(400).json({status: "error", error: "Invalid request, missing courseId"});
    return;
  }

  if(payload.role === "STUDENT"){
  // Handle student dropping a course
    const dropped = await dropStudentEnrollment(payload.id, req.body.courseId);

    console.log("I AM HERE");
    console.log(dropped);
    res.status(200).json({dropped});

  } else if(payload.role === "PROFESSOR"){
  // Handle teacher dropping a course
    const enrolled = await checkIfProfessorEnrolled(payload.id, req.body.courseId)

    if(enrolled === true){
      const dropped = await dropProfessorEnrollment(payload.id, req.body.courseId);
      res.status(200).json({status: "success", dropped});

    }else{
      res.status(400).json({status: "error", error: "Invalid request, professor is not enrolled"});
      return;
    }

  }
};

const getStudentEnrolledCourses = async (studentId) => {
  const queryString = `
    SELECT CourseID, CourseName, Description, p.Email
    FROM ENROLLMENT e
    INNER JOIN COURSE c
    ON c.Id = e.CourseID 
    INNER JOIN PERSON p
    ON c.PersonID = p.ID 
    WHERE e.PersonId = '${studentId}'
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

}

const getProfesserEnrolledCourses = async (professorId) => {
  const queryString = `
  SELECT * 
  FROM COURSE
  WHERE PersonId = '${professorId}';
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
}

const dropStudentEnrollment = async (studentId, courseId) => {

  const queryString = `
    DELETE FROM ENROLLMENT
    WHERE PersonID = '${studentId}' AND CourseID = '${courseId}'
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      console.log(rows);
      resolve(rows.affectedRows > 0);
    });
  });

}

const dropProfessorEnrollment = async (professorId, courseId) => {

  const queryString = `
    UPDATE COURSE
    SET PersonID = NULL
    WHERE ID = '${courseId}' AND PersonID = '${professorId}';
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      resolve(rows.affectedRows > 0);
    });
  });
}

const addStudentEnrollment = async (studentId, courseId) => {

  const queryString = `
    INSERT INTO ENROLLMENT
    (PersonID, CourseID)
    VALUES('${studentId}', '${courseId}');
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      resolve(rows.affectedRows > 0);
    });
  });
}

const addProfessorEnrollment = async (professorId, courseId) => {

  const queryString = `
    UPDATE COURSE
    SET PersonID='${professorId}'
    WHERE ID = '${courseId}';
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      resolve(rows.affectedRows > 0);
    });
  });



}

const checkIfStudentEnrolled = async (studentId, courseId) => {

  const queryString = `
    SELECT * 
    FROM ENROLLMENT
    WHERE PersonID = '${studentId}' AND CourseID = ${courseId};
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      console.log(rows);
      resolve(rows.length > 0);
    });
  });
}

const checkIfProfessorEnrolled = async (professorId, courseId) => {
  const queryString = `
    SELECT c.ID as CourseID, c.PersonID as PersonID, c.CourseName 
    FROM COURSE c 
    INNER JOIN COURSE c2 
    ON c2.CourseName = c.CourseName 
    WHERE c.PersonID = ${professorId} AND c2.ID = ${courseId}
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      console.log(rows);
      resolve(rows.length > 0);
    });
  });
}

module.exports = handler;