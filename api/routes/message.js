const { Router } = require("express");
//authentication middleware
const check = require("../middlewares/auth.js");
//controller
const messageController = require("../controllers/message.js");
//validation middlewares
const {
  validateChatId,
  validateSendMessage,
} = require("../middlewares/validators/messageValidator.js");

const router = Router();

//creates and send a message
router.post("/send", check.auth, validateSendMessage(), messageController.send);

//gets messages from a chat
router.get(
  "/getMessages/:chatId",
  check.auth,
  validateChatId(),
  messageController.getMessages
);

module.exports = router;
