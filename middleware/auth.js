const jwt = require("jsonwebtoken");
require('dotenv').config()

const config = process.env;

const userToken = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    res.send("Access Token Required");
    return;
  }
  try {
    const userObj = jwt.verify(token, config.SecurityKey);
    req.user = userObj;
    return next();
  } catch (error) {
    res.send(`Something went wrong during authorization: ${error.message}`);
    return;
  }

  
};

module.exports = userToken