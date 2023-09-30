const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwt.js");
const { matchedData } = require("express-validator");

const register = async (req, res) => {
  const data = matchedData(req);

  const user = await User.findOne({ email: data.email });

  if (user) {
    return res
      .status(400)
      .send({ success: false, message: "User already exists" });
  }

  data.password = await bcrypt.hash(data.password, 14);

  let newUser = await User.create(data);

  const userToReturn = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    pic: newUser.pic,
  };

  return res.status(200).send({
    ...userToReturn,
    token: generateToken(userToReturn),
  });
};

const login = async (req, res) => {
  const { email, password } = matchedData(req);

  const user = await User.findOne({ email });

  // Checks if the passsword matches the stored one
  let passwordMatch = false;
  if (user) {
    passwordMatch = await bcrypt.compare(password, user.password);
  }

  if (!passwordMatch || !user)
    return res
      .status(400)
      .send({ success: false, message: "Incorrect email or password" });

  const userToReturn = {
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
  };

  return res.status(200).send({
    ...userToReturn,
    token: generateToken(userToReturn),
  });
};

const listUsers = async (req, res) => {
  const { search } = matchedData(req);

  const users = await User.find({
    name: { $regex: search, $options: "i" },
  }).find({ _id: { $ne: req.user._id } });

  if (!users) {
    return res.status(404).send({ success: false, message: "No users found" });
  }

  return res.status(200).send(users);
};

module.exports = {
  login,
  register,
  listUsers,
};
