const mysql = require("../../../databases/mysqlDB");

const checkIfRole = (role, validRoles) => {
  return validRoles.includes(role);
};

// Must verify that the user exists before calling this function
const checkRoleByEmail = async (email) => {
  const queryString = `
    SELECT sr.RoleName 
    FROM PERSON p 
    INNER JOIN SCHOOL_ROLE sr 
    ON p.ID = sr.ID 
    WHERE p.Email = '${email}';
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      rows.length > 0 ? resolve(rows[0].RoleName) : reject({
        status: "error",
        error: "No user found",
      });
    });
  });
}

// Must verify that the user exists before calling this function
const checkRoleById = async (id) => {
  const queryString = `
    SELECT sr.RoleName 
    FROM PERSON p 
    INNER JOIN SCHOOL_ROLE sr 
    ON p.RoleID = sr.ID 
    WHERE p.ID = '${id}';
  `;

  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, rows) => {
      if (err) {
        reject({
          status: "error",
          error: err,
        });
      }
      rows.length > 0 ? resolve(rows[0].RoleName) : reject({
        status: "error",
        error: "No user found",
      });
    });
  });
}
module.exports = { checkIfRole, checkRoleByEmail, checkRoleById };
