// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 2;
const mysql = require("../../databases/mysqlDB");
const { verifyToken } = require("./utils/tokens");
const { createUser } = require("./utils/accounts");
const { decodeToken } = require("./utils/tokens");
const handler = async (req, res) => {


  switch (req.method) {
    case "GET":
      req.app.locals.users.getCount++;
      return getHandler(req, res);
    case "PUT":
      req.app.locals.users.putCount++;
      return putHandler(req, res);
    case "POST":
      req.app.locals.users.postCount++;
      await postHandler(req, res);
      break;
    default:
      res.status(405).json({
        status: "error",
        error: "Invalid request",
      });
  }
};

const getHandler = async (req, res) => {

  // User must provide a valid token
  if (!req.body.token || !verifyToken(req.body.token)) {
    res.status(403).json({
      status: "error",
      error: "Invalid request: Token provided is invalid",
    });
    return;
  }

  if(!req.body.personId){
    const result = await getAllUsers();
    console.log(result);
    return res.status(200).json(result);
  }else{
    const result = await getUserById(req.body.personId);
    console.log(result);
    return res.status(200).json(result);
  }

};

const putHandler = async (req, res) => {

  // User must provide a valid token
  if (!req.body.token || !verifyToken(req.body.token)) {
    res.status(403).json({
      status: "error",
      error: "Invalid request: Token provided is invalid",
    });
    return;
  }

  if(!req.body.firstName || !req.body.lastName){
    res.status(403).json({
      status: "error",
      error: "Invalid request: missing first name and last name",
    });
    return;
  }

  const payload = decodeToken(req.body.token);

  const result = await updateUserById(payload.id, req.body.firstName, req.body.lastName);

  if(result === true){
    res.status(200).json({
      status: "success",
    });
  }else{
    res.status(403).json({
      status: "error",
      error: result,
    });
  }


};

//TODO add check to see if the user exists already...
//for now this just creates a user with a hashed password
const postHandler = async (req, res) => {
  const { email, firstName, lastName, password, role } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then(async (hashedPassword) => {
      console.log(hashedPassword);
      if (hashedPassword) {
        const userInfo = {
          email: email,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
          role: parseInt(role, 10),
        };

        await createUser(userInfo)
          .then((user) => {
            if (user.status === "success") {
              console.log("NEW USER CREATED: ", user);
              return res.status(201).json({ status: "success", user: user });
            }
          })
          .catch((err) => {
            return res
              .status(400)
              .json({ status: "error", error: err.sqlMessage });
          });
      }
    })
    .catch((err) => {
      console.log(`[HASHED PASSWORD] ERROR: ${err}`);
    });
};

const getAllUsers = () => {
  const queryUsers = `SELECT * FROM PERSON;`
  return new Promise((resolve, reject) => {
    mysql.query(queryUsers, (err, rows) => {
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

const getUserById = async (id) => {
  const queryString = `
    SELECT * 
    FROM PERSON
    WHERE ID = '${id}'
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

const updateUserById = async(id, firstName, lastName) => {
  const queryString = `
    UPDATE PERSON
    SET FirstName='${firstName}', LastName='${lastName}'
    WHERE ID='${id}';
  `
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

module.exports = handler;
