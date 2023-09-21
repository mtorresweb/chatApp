import axios from "axios";

const endpoint = import.meta.env.VITE_API_URL + "/api/message";

export const getMessagesApi = async (selectedChat, user) => {
  try {
    const { data } = await axios.get(
      `${endpoint}/getMessages/${selectedChat._id}`,
      { headers: { Authorization: "Bearer " + user.token } }
    );

    return data;
  } catch {
    return {};
  }
};

export const sendMessageApi = async (newMessage, selectedChat, user) => {
  try {
    const { data } = await axios.post(
      `${endpoint}/send`,
      { content: newMessage, chatId: selectedChat._id },
      { headers: { Authorization: "Bearer " + user.token } }
    );
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
    return {};
  }
};
