const { validationResult } = require("express-validator");

const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).send({
    success: "false",
    message: errors.array({ onlyFirstError: true })[0].msg,
  });
};

module.exports = validateResults;
