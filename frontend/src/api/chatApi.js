import axios from "axios";

const endpoint = import.meta.env.VITE_API_URL + "/api/chat";

export const addUsersToChatApi = async (groupChatName, selectedUsers, user) => {
  try {
    let { data } = await axios.post(
      `${endpoint}/createGroup`,
      { name: groupChatName, users: selectedUsers.map((user) => user._id) },
      {
        headers: { Authorization: "Bearer " + user.token },
      }
    );

    return data;
  } catch {
    return {};
  }
};

export const fetchChatsApi = async (user) => {
  try {
    const { data } = await axios.get(`${endpoint}/getChats`, {
      headers: { Authorization: "Bearer " + user.token },
    });

    return data;
  } catch {
    return {};
  }
};

export const accessChatApi = async (userId, user) => {
  try {
    let { data } = await axios.post(
      `${endpoint}/access`,
      { userId },
      {
        headers: { Authorization: "Bearer " + user.token },
      }
    );

    return data;
  } catch {
    return {};
  }
};

export const removeUserFromChatApi = async (
  userToRemove,
  selectedChat,
  user
) => {
  try {
    const { data } = await axios.put(
      `${endpoint}/removeUser`,
      { chatId: selectedChat._id, userId: userToRemove._id },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    return data;
  } catch {
    return {};
  }
};

export const renameGroupApi = async (groupChatName, selectedChat, user) => {
  try {
    const { data } = await axios.put(
      `${endpoint}/renameGroup`,
      { chatId: selectedChat._id, chatName: groupChatName },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    return data;
  } catch {
    return {};
  }
};

export const addUserToGroupApi = async (userToAdd, selectedChat, user) => {
  try {
    const { data } = await axios.put(
      `${endpoint}/addUser`,
      { chatId: selectedChat._id, userId: userToAdd._id },
      { headers: { Authorization: "Bearer " + user.token } }
    );

    return data;
  } catch {
    return {};
  }
};

export const leaveGroupApi = async (selectedChat, user) => {
  try {
    const { data } = await axios.get(
      `${endpoint}/leaveGroup/${selectedChat._id}`,
      { headers: { Authorization: "Bearer " + user.token } }
    );

    return data;
  } catch {
    return {};
  }
};
