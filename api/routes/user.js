const { Router } = require("express");
const userController = require("../controllers/user.js");
const check = require("../middlewares/auth.js");
const {
  validateUserLogIn,
  validateUserRegister,
  validateListUsers,
} = require("../middlewares/validators/userValidator.js");

const router = Router();

router.post("/register", validateUserRegister(), userController.register);
router.post("/login", validateUserLogIn(), userController.login);
router.get(
  "/listUsers",
  check.auth,
  validateListUsers(),
  userController.listUsers
);

module.exports = router;
