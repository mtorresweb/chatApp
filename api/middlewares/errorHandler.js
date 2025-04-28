
const { getReasonPhrase } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const responseBody = {
    success: false,
    message: getReasonPhrase(statusCode),
    stack: process.env.NODE_ENV == "production" ? null : err.stack,
  };

  res.status(statusCode).send(responseBody);
};

module.exports = errorHandler;
