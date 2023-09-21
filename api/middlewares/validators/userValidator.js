const { body, query } = require("express-validator");
const validateResults = require("../validationHandler");

const validateUserRegister = () => [
  body("name", "The user  name is required")
    .exists()
    .isLength({ min: 3, max: 25 })
    .trim()
    .escape(),
  body("email", "A valid email address is required")
    .exists()
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body("password", "A strong password is required")
    .exists()
    //.isStrongPassword()
    .trim()
    .escape(),
  body("pic").optional().isURL(),
  (req, res, next) => validateResults(req, res, next),
];

const validateUserLogIn = () => [
  body("email", "A valid email address is required")
    .exists()
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body("password", "A strong password is required")
    .exists()
    //.isStrongPassword()
    .trim()
    .escape(),
  (req, res, next) => validateResults(req, res, next),
];

const validateListUsers = () => [
  query("search", "Enter a valid user name").exists().trim().escape(),
  (req, res, next) => validateResults(req, res, next),
];

module.exports = {
  validateUserRegister,
  validateUserLogIn,
  validateListUsers,
};
