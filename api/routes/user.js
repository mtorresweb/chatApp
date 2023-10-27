const { Router } = require("express");
//controller
const userController = require("../controllers/user.js");
//authentication middleware
const check = require("../middlewares/auth.js");
//validation middlewares
const {
  validateUserLogIn,
  validateUserRegister,
  validateListUsers,
} = require("../middlewares/validators/userValidator.js");

const router = Router();

//registers a new user
router.post("/register", validateUserRegister(), userController.register);

//logIn route
router.post("/login", validateUserLogIn(), userController.login);

//Gets a list of matching users by their names
router.get(
  "/listUsers",
  check.auth,
  validateListUsers(),
  userController.listUsers
);

module.exports = router;
