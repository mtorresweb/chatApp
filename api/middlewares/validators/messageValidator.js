const { body, param } = require("express-validator");
const validateResults = require("../validationHandler");

const validateChatId = () => [
  param("chatId", "The chat id is required").exists().trim().escape(),
  (req, res, next) => validateResults(req, res, next),
];

const validateSendMessage = () => [
  body("content", "The message content is required").exists().trim().escape(),
  body("chatId", "The chat id is required").exists().trim().escape(),
];

module.exports = {
  validateChatId,
  validateSendMessage,
};
