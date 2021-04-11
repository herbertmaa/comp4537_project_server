const jwt = require("jsonwebtoken"); //a library to manage JWT generation
const KEY = process.env.JWT_KEY;

const verifyToken = (jwtToken) => {
  try {
    return jwt.verify(jwtToken, KEY);
  } catch (e) {
    return null;
  }
};

const decodeToken = (jwtToken) => {
  try {
    return jwt.decode(jwtToken, KEY);
  } catch (e) {
    console.log("e:", e);
    return null;
  }
};

module.exports =  { verifyToken, decodeToken };
