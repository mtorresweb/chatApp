const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: "10d" });
};

module.exports = {
  generateToken,
  secretKey,
};
