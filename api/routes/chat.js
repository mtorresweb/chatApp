const { Router } = require("express");
const check = require("../middlewares/auth.js");
const chatController = require("../controllers/chat.js");
const {
  validateAddToGroup,
  validateCreateGroup,
  validateRemoveFromGroup,
  validateRenameGroup,
  validateUserId,
  validateLeaveGroup,
} = require("../middlewares/validators/chatValidator.js");

const router = Router();

router.post(
  "/createGroup",
  check.auth,
  validateCreateGroup(),
  chatController.createGroup
);
router.put(
  "/renameGroup",
  check.auth,
  validateRenameGroup(),
  chatController.renameGroup
);
router.put(
  "/removeUser",
  check.auth,
  validateRemoveFromGroup(),
  chatController.removeFromGroup
);
router.put(
  "/addUser",
  check.auth,
  validateAddToGroup(),
  chatController.addToGroup
);
router.post("/access", check.auth, validateUserId(), chatController.accessChat);
router.get("/getChats", check.auth, chatController.getChats);
router.get(
  "/leaveGroup/:groupId",
  check.auth,
  validateLeaveGroup(),
  chatController.leaveGroup
);

module.exports = router;
