const { Router } = require("express");
//authentication middleware
const check = require("../middlewares/auth.js");
//controller
const chatController = require("../controllers/chat.js");
//validation middlewares
const {
  validateAddToGroup,
  validateCreateGroup,
  validateRemoveFromGroup,
  validateRenameGroup,
  validateUserId,
  validateLeaveGroup,
} = require("../middlewares/validators/chatValidator.js");

const router = Router();

//user creates a group chat
router.post(
  "/createGroup",
  check.auth,
  validateCreateGroup(),
  chatController.createGroup
);

//user renames a group chat
router.put(
  "/renameGroup",
  check.auth,
  validateRenameGroup(),
  chatController.renameGroup
);

//user removes a user from a group chat
router.put(
  "/removeUser",
  check.auth,
  validateRemoveFromGroup(),
  chatController.removeFromGroup
);

//user adds a new user to a group chat
router.put(
  "/addUser",
  check.auth,
  validateAddToGroup(),
  chatController.addToGroup
);

//user starts or access a chat
router.post("/access", check.auth, validateUserId(), chatController.accessChat);

//gets user chats
router.get("/getChats", check.auth, chatController.getChats);

//user leaves a group chat
router.put(
  "/leaveGroup/:groupId",
  check.auth,
  validateLeaveGroup(),
  chatController.leaveGroup
);

module.exports = router;
