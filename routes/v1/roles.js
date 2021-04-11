// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const mysql = require("../../databases/mysqlDB");
const { verifyToken, decodeToken } = require("./utils/tokens");

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
      req.app.locals.roles.getCount++;
      return getHandler(req, res);
  }
};

// ENDPOINT HANDLER
const getHandler = (req, res) => {
  const payload = decodeToken(req.body.token);
  console.log(payload);
  return res.status(200).json({role: payload.role});
};

module.exports = handler;
