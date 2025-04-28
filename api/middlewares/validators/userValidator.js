const { body, query } = require("express-validator");
const validateResults = require("../validationHandler");

const validateUserRegister = () => [
  body("name")
    .exists()
    .withMessage("The user  name is required")
    .isLength({ min: 3, max: 25 })
    .withMessage("name must be between 3 and 25 characters")
    .trim()
    .escape(),
  body("email", "A valid email address is required")
    .exists()
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body("password", "Password is required")
    .exists()
    //.isStrongPassword()
    .trim()
    .escape(),
  body("pic").isURL().optional(),
  (req, res, next) => validateResults(req, res, next),
];

const validateUserLogIn = () => [
  body("email", "A valid email address is required")
    .exists()
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body("password", "Password is required")
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
