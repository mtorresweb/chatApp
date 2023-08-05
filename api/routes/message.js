const { Router } = require("express");
const check = require("../middlewares/auth.js");
const messageController = require("../controllers/message.js");
const {
  validateChatId,
  validateSendMessage,
} = require("../middlewares/validators/messageValidator.js");

const router = Router();

router.post("/send", check.auth, validateSendMessage(), messageController.send);
router.get(
  "/getMessages/:chatId",
  check.auth,
  validateChatId(),
  messageController.getMessages
);

module.exports = router;
