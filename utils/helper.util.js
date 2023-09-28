const jwt = require("jsonwebtoken");

const extractToken = (token) => {
  let tokenArray = token.split(" ");
  if (tokenArray.length !== 2) return null;
  return tokenArray[1];
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  extractToken,
  verifyToken,
};
