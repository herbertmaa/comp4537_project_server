const { getUserInformation }= require('./utils/accounts')
const bcrypt =  require("bcryptjs"); //a library used to hash paswords
const jwt = require("jsonwebtoken"); //a library to manage JWT generation

//https://medium.com/swlh/jwt-json-web-tokens-user-authentication-in-next-js-web-application-51deab8f2e96
/* JWT secret key */
const KEY = process.env.JWT_KEY;

const handler = async (req, res) => {
  const { method } = req;
  const { email, password } = req.body;
  try {
    switch (method) {
      case "POST":
        /* If email or password is blank */
        if (!email || !password) {
          res.status(400).json({
            status: "error",
            error: "Request missing username or password",
          });
        }
        /* Get user email + hashed password + role from DB */
        const userInformation = await getUserInformation(email);
        /* Check if exists */
        if (userInformation.status === "error") {
          /* Send error with message */
          res.status(400).json({
            userInformation,
          });
          return;
        } else {
          userInformation.Email = email;
          const response = await verifyPassword(password, userInformation);
          if (response.status !== "error" && response.success === true) {
            // Passwords match
            const jwtToken = await createJwtPayload({
              id: userInformation.ID,
              email: userInformation.Email,
              role: userInformation.RoleName,
            });

            jwtToken.status === "ERROR"
              ? res.status(500).json(jwtToken)
              : res.status(201).json(jwtToken);
          } else {
            // Invalid password or account information
            res.status(400).json(response);
          }
        }
        break;
      default:
        res.status(405).json({
          status: "error",
          error: "Invalid request",
        });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

const verifyPassword = (pass, userInfo) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, userInfo.AccountPassword, (err, isMatch) => {
      if (err)
        reject({
          status: "error",
          err,
        });
      if (isMatch) {
        resolve({
          success: true,
        });
      } else {
        reject({
          status: "error",
          error: "Invalid account information",
        });
      }
    });
  }).catch((err) => {
    return {
      status: "error",
      error: err,
    };
  });
};

const createJwtPayload = (userInfo) => {
  console.log("INFO PROVIDED TO JWT FOR PROCESSING", userInfo);
  const payload = {
    id: userInfo.id,
    email: userInfo.email,
    role: userInfo.role,
  };

  /* Sign token */
  const expiration = {
    expiresIn: 432000, // 5 days in seconds
  };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, KEY, expiration, (err, token) => {
      if (err) reject(err);

      /* Send success with token */
      resolve({
        success: true,
        token,
      });
    });
  }).catch((err) => {
    return {
      status: "error",
      error: err,
    };
  });
};

module.exports = handler;
