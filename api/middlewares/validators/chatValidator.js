const { body, param } = require("express-validator");
const validateResults = require("../validationHandler");

const validateCreateGroup = () => [
  body("users", "Provide a valid list of users").exists().isArray(),
  body("name", "Name is required")
    .exists()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Chat name must be at least 3 characters long"),
  (req, res, next) => validateResults(req, res, next),
];

const validateUserId = () => [
  body("userId", "A user id is required").exists().trim().escape(),
  (req, res, next) => validateResults(req, res, next),
];

const validateAddToGroup = () => [
  body("userId", "A user id is required").exists().trim().escape(),
  body("chatId", "A chat id is required").exists().trim().escape(),
  (req, res, next) => validateResults(req, res, next),
];

const validateRemoveFromGroup = () => [
  body("userId", "A user id is required").exists().trim().escape(),
  body("chatId", "A chat id is required").exists().trim().escape(),
  (req, res, next) => validateResults(req, res, next),
];

const validateRenameGroup = () => [
  body("chatName", "A new chat name is required").exists().trim().escape(),
  body("chatId", "A chat id is required").exists().trim().escape(),
  (req, res, next) => validateResults(req, res, next),
];

const validateLeaveGroup = () => [
  param("groupId", "A chat id is required").exists().trim().escape(),
  (req, res, next) => validateResults(req, res, next),
];

module.exports = {
  validateCreateGroup,
  validateUserId,
  validateAddToGroup,
  validateRemoveFromGroup,
  validateRenameGroup,
  validateLeaveGroup,
};
