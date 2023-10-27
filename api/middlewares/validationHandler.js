const { validationResult } = require("express-validator");

const validateResults = (req, res, next) => {
  //gets errors from validation middlewares and if there are no errors continues
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  //if it encounters errors returns the first error message
  return res.status(400).send({
    success: "false",
    message: errors.array({ onlyFirstError: true })[0].msg,
  });
};

module.exports = validateResults;
