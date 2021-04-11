const mysql = require("../../../databases/mysqlDB");

// Helper function to get the role of the user
const getRole = async (user) => {
  const queryUserRole = `
    SELECT RoleName from Person p
    INNER JOIN SCHOOL_ROLE sr
    ON sr.ID = p.ID
    WHERE p.ID = ${user.ID}
  `;
  await new Promise((resolve, reject) => {
    mysql.query(queryUserRole, (err, rows) => {
      if (err) reject(err);
      console.log(rows[0]);
      resolve(rows[0]);
    });
  })
    .then((rows) => {
      return rows;
    })
    .catch((err) => {
      console.log("[GET ROLE] ERROR: ", err.stack);
      return { result: err.stack };
    });
};

const getUserInformation = async (email) => {
  const queryUserInfo = `
    SELECT p.ID, sr.RoleName, a.AccountPassword FROM PERSON p 
    INNER JOIN SCHOOL_ROLE sr ON sr.ID = p.RoleID
    INNER JOIN ACCOUNT a ON p.Email = a.AccountEmail
    WHERE p.Email = '${email}'; 
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryUserInfo, (err, rows) => {
      if (err) reject(err);

      if (rows.length === 0)
        resolve({
          status: "error",
          error: "user does not exist",
        }); // user does not exist

      resolve(rows[0]); // return the user information, there should only ever be one row
    });
  }).catch((err) => {
    console.log(`[GET USER INFORMATION] ERROR: ${err}`);
  });
};

// NOTE THIS FUNCTION DOES NOT HANDLING HASHING
// NOTE THIS FUNCTION DOES NOT CHECK IF THE USER EXISTS BEFORE HAND
// INFORMATION MUST BE HASHED PRIOR TO CALLING THIS
// SAMPLE USER INFO
/*
  userInfo = {
    email: "abc@gmail.com",
    password: "HASHEDPASSWORD",
    firstName: "Bob",
    lastName: "Joe",
    role: 1,
    email: "abc@gmail.com"
  }
*/
const createUser = async (userInfo) => {
  const queryString = `
    INSERT INTO ACCOUNT 
    (AccountEmail, AccountPassword)
    VALUES('${userInfo.email}', '${userInfo.password}');

    INSERT INTO PERSON
    (FirstName, LastName, RoleID, Email)
    VALUES('${userInfo.firstName}', '${userInfo.lastName}', ${userInfo.role}, '${userInfo.email}');
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) reject(err);

      resolve({ status: "success", user: rows }); // return the user information, there should only ever be one row
    });
  }).catch((err) => {
    console.error(`[CREATE USER] ERROR: ${err}`);
    throw err;
  });
};

module.exports = { createUser, getRole, getUserInformation };
