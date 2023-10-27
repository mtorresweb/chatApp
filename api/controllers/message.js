const Message = require("../models/Message.js");
const User = require("../models/User.js");
const Chat = require("../models/Chat.js");
const { matchedData } = require("express-validator");

const send = async (req, res) => {
  //gets the validated message content and the associated chat ID
  const { content, chatId } = matchedData(req);

  //creates the new message
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  //saves the new message
  let message = await Message.create(newMessage);

  //populates the associated user, chat and the chat's user list
  message = await message.populate("sender", "name pic");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });

  //updates the chat's last message
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

  //sends the message
  return res.status(200).send(message);
};

const getMessages = async (req, res) => {
  //gets the validated chatId
  const { chatId } = matchedData(req);

  //gets the messages associated to the specified chat and populates its associated user
  const messages = await Message.find({ chat: chatId }).populate([
    {
      path: "sender",
      select: "name pic email",
    },
  ]);

  //sends the message list associated to the chat
  return res.status(200).send(messages);
};

module.exports = { send, getMessages };
