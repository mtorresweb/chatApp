const Message = require("../models/Message.js");
const User = require("../models/User.js");
const Chat = require("../models/Chat.js");
const { matchedData } = require("express-validator");

const send = async (req, res) => {
  const { content, chatId } = matchedData(req);

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  let message = await Message.create(newMessage);

  message = await message.populate("sender", "name pic");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

  return res.status(200).send(message);
};

const getMessages = async (req, res) => {
  const { chatId } = matchedData(req);

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name pic email")
    .populate("chat");

  return res.status(200).send(messages);
};

module.exports = { send, getMessages };
