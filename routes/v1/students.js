// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const mysql = require("../../databases/mysqlDB");
const { verifyToken } = require("./utils/tokens");

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
      req.app.locals.students.getCount++;
      return getHandler(req, res);
  }
};

// ENDPOINT HANDLER
const getHandler = async (req, res) => {
  const students = await getStudents();
  return res.status(200).json(students);
};

const getStudents = async () => {

  // Role ID 1 = STUDENT
  // Role ID 2 = PROFESSOR
  // Role ID 3 = ADMIN

  const queryString = `
    SELECT ID, FirstName, LastName, Email
    FROM PERSON
    WHERE RoleID = 1
  `

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
module.exports = handler;
