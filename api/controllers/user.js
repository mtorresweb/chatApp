const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwt.js");
const { matchedData } = require("express-validator");

//registers the new user
const register = async (req, res) => {
  //gets validated data
  const data = matchedData(req);

  //checks if the email provided is already registered
  const user = await User.findOne({ email: data.email });

  if (user) {
    return res
      .status(400)
      .send({ success: false, message: "Email already in use" });
  }

  //encrypts the password provided
  data.password = await bcrypt.hash(data.password, 14);

  //saves the user with the encrypted password
  let newUser = await User.create(data);

  //creates the new user object without the password
  const userToReturn = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    pic: newUser.pic,
  };

  //returns the new user object and provides a token
  return res.status(200).send({
    ...userToReturn,
    token: generateToken(userToReturn),
  });
};

//user login
const login = async (req, res) => {
  //gets validated email address and password
  const { email, password } = matchedData(req);

  //finds the user by their email
  const user = await User.findOne({ email });

  // Checks if the passsword matches the stored one
  let passwordMatch = false;
  if (user) {
    passwordMatch = await bcrypt.compare(password, user.password);
  }

  //returns an error if the password is wrong or the user was not found
  if (!passwordMatch || !user)
    return res
      .status(400)
      .send({ success: false, message: "Incorrect email or password" });

  //creates the user object
  const userToReturn = {
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
  };

  //returns the user object and provides a token
  return res.status(200).send({
    ...userToReturn,
    token: generateToken(userToReturn),
  });
};

//lists users by their names
const listUsers = async (req, res) => {
  //gets the validated query parameters
  const { search } = matchedData(req);

  //searchs the users by their names
  const users = await User.find({
    name: { $regex: search, $options: "i" },
  }).find({ _id: { $ne: req.user._id } });

  //returns an error if there are no matching users
  if (!users) {
    return res.status(404).send({ success: false, message: "No users found" });
  }

  //sends the user list with the matching users
  return res.status(200).send(users);
};

module.exports = {
  login,
  register,
  listUsers,
};
