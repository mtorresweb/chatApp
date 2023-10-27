const Chat = require("../models/Chat");
const User = require("../models/User");
const { matchedData } = require("express-validator");

const createGroup = async (req, res) => {
  //gets validated data
  const data = matchedData(req);

  //adds the current user to the group
  let users = data.users;
  users.push(req.user._id);

  //checks if the group has at least three users
  if (users.length < 3) {
    return res.status(400).send({
      success: false,
      message: "More than 2 users are required to form a group chat",
    });
  }

  //creates the new group chat
  const groupChat = await Chat.create({
    chatName: data.name,
    users,
    isGroupChat: true,
    groupAdmin: req.user._id,
  });

  //populates users and group admin
  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  //sends the full chat
  return res.status(200).send(fullGroupChat);
};

const accessChat = async (req, res) => {
  const { userId } = matchedData(req);

  if (!userId) {
    return res
      .status(400)
      .send({ success: false, message: "User id is required" });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    return res.status(200).json(FullChat);
  }
};

const getChats = async (req, res) => {
  let results = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  results = await User.populate(results, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  return res.status(200).send(results);
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = matchedData(req);

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(404).send({ success: false, message: "Chat not found" });
  }

  return res.status(200).send(updatedChat);
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = matchedData(req);

  const isAdmin = await Chat.findOne({
    _id: chatId,
    groupAdmin: req.user._id,
  });

  if (!isAdmin) {
    return res
      .status(403)
      .send({ success: false, message: "You are not an admin of this group" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(404).send({ success: false, message: "Chat not found" });
  }

  return res.status(200).json(updatedChat);
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = matchedData(req);

  const isAdmin = await Chat.findOne({
    _id: chatId,
    groupAdmin: req.user._id,
  });

  if (!isAdmin) {
    return res
      .status(403)
      .send({ success: false, message: "You are not an admin of this group" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(404).send({ success: false, message: "Chat not found" });
  }

  return res.status(200).send(updatedChat);
};

const leaveGroup = async (req, res) => {
  const { groupId } = matchedData(req);
  const userId = req.user._id;

  const belongsToGroup = await Chat.findOne({
    _id: groupId,
    users: { $in: [userId] },
  });

  if (!belongsToGroup)
    return res
      .status(400)
      .send({ success: false, message: "You are not a member of this group" });

  const updatedChat = await Chat.findByIdAndUpdate(
    groupId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  );

  if (!updatedChat) {
    return res.status(404).send({ success: false, message: "Chat not found" });
  }

  return res.status(200).json("you have left the group");
};

module.exports = {
  createGroup,
  accessChat,
  getChats,
  renameGroup,
  removeFromGroup,
  addToGroup,
  leaveGroup,
};
