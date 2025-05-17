import { ChatState } from "../Context/ChatProvider";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UpdateGroupModal from "./UpdateGroupModal";
import { getSender, getUser } from "../chat methods";
import ProfileModal from "./ProfileModal";
import { useEffect, useRef, useState } from "react";
import { Send } from "@mui/icons-material";
import ScrollableChat from "./ScrollableChat";
import { socket } from "../socket";
import useAxios from "../hooks/useAxios";

// Variables to track current state for socket events
let currentChat = {};
let currentChats = [];

/**
 * SingleChat component handles the display and functionality of an individual chat conversation
 * 
 * This component is responsible for:
 * - Displaying messages in the selected chat
 * - Sending new messages
 * - Handling typing indicators
 * - Managing real-time updates via Socket.io
 * - Supporting both one-on-one and group chats
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.fetchAgain - State to trigger chat refresh
 * @param {Function} props.setFetchAgain - Function to update fetchAgain state
 * @returns {JSX.Element} SingleChat component
 */
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    setNotifications,
    chats,
    setChats,
  } = ChatState();

  const getMessages = useAxios({
    method: "get",
    url: `message/getMessages/${selectedChat._id}`,
    headers: {
      authorization: "Bearer " + user.token,
    },
  });

  const sendAMessage = useAxios({
    method: "post",
    url: `message/send`,
    headers: {
      authorization: "Bearer " + user.token,
    },
  });

  const loggedUser = useRef(user);

  const [socketConnected, setSocketConnected] = useState(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState();

  const fetchMessages = async () => {
    if (!selectedChat?._id) return;

    await getMessages.fetchData();
  };

  useEffect(() => {
    if (getMessages.response) {
      setMessages(getMessages.response);
    }
  }, [getMessages.response]);

  const sendMessage = async (e, buttonClicked = false) => {
    if ((e.key == "Enter" || buttonClicked) && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);

      await sendAMessage.fetchData({
        content: newMessage,
        chatId: selectedChat._id,
      });
    }
  };

  useEffect(() => {
    if (sendAMessage.response) {
      setNewMessage("");
      setMessages((messages) => [...messages, sendAMessage.response]);
      socket.emit("new message", sendAMessage.response);
    }
  }, [sendAMessage.response]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
  };

  //handle typing effect
  useEffect(() => {
    clearTimeout(typingTimer);

    if (typing) {
      setTypingTimer(
        setTimeout(() => {
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }, 3000)
      );
    }
  }, [newMessage]);

  //subscribe to socket events
  useEffect(() => {
    socket.connect();
    socket.emit("setup", user);

    //remove subscriptions to socket events
    return () => {
      socket.off("setup");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    socket.on("removed from group", (userId, room) => {
      if (userId === loggedUser.current._id) {
        setChats(currentChats.filter((chat) => chat._id !== room));

        if (currentChat._id === room) {
          setSelectedChat({});
        }
      } else {
        setChats(
          currentChats.map((chat) => {
            return chat._id === room
              ? { ...chat, users: chat.users.filter((us) => us._id !== userId) }
              : chat;
          })
        );

        if (currentChat._id === room) {
          setSelectedChat({
            ...currentChat,
            users: currentChat.users.filter((us) => us._id !== userId),
          });
        }
      }
    });

    socket.on("left group", (group, userId) => {
      setChats(
        currentChats.map((chat) =>
          chat._id === group
            ? { ...chat, users: chat.users.filter((us) => us._id !== userId) }
            : chat
        )
      );

      if (currentChat._id === group) {
        setSelectedChat({
          ...currentChat,
          users: currentChat.users.filter((us) => us._id !== userId),
        });
      }
    });

    socket.on("added to group", (updatedChat, userToAdd) => {
      if (loggedUser.current._id === userToAdd._id) {
        setChats([updatedChat, ...currentChats]);
      } else {
        setChats(
          currentChats.map((chat) =>
            chat._id === updatedChat._id ? updatedChat : chat
          )
        );

        if (currentChat._id === updatedChat._id) {
          setSelectedChat({
            ...currentChat,
            users: [...currentChat.users, userToAdd],
          });
        }
      }
    });

    //when a message is received check if it is in from different a chat and add a notification
    socket.on("message received", (newMessageReceived) => {
      if (!currentChat || currentChat._id != newMessageReceived.chat._id) {
        setNotifications((prevNotifications) => [
          newMessageReceived,
          ...prevNotifications,
        ]);
      } else {
        setMessages((messages) => [...messages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.off("left group");
      socket.off("removed from group");
      socket.off("message received");
    };
  }, []);
  //every time the selected chat changes, get the new messages and the current chat
  useEffect(() => {
    fetchMessages();
    // Use JSON parse/stringify for deep cloning in environments without structuredClone
    currentChat = JSON.parse(JSON.stringify(selectedChat));
    currentChats = JSON.parse(JSON.stringify(chats));
  }, [selectedChat, currentChat, chats, currentChats]);

  //subscribe to chats
  useEffect(() => {
    chats.forEach((chat) => {
      socket.emit("join chat", chat._id);
    });
  }, [chats, socket]);

  if (!selectedChat._id)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        Click on a user or group to chat
      </Box>
    );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          alignItems: "center",
        }}
      >
        <ArrowBackIcon
          sx={{
            "@media (min-width: 1024px)": { display: "none" },
            ":hover": { cursor: "pointer" },
          }}
          onClick={() => setSelectedChat({})}
        />
        {!selectedChat.isGroupChat ? (
          <>
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getUser(user, selectedChat.users)} />
          </>
        ) : (
          <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              fetchMessages={fetchMessages}
            />
          </>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflowY: "hidden",
          borderRadius: "0 0 10px 10px",
          backgroundColor: "#c2bfbf",
          width: "100%",
          height: "100%",
        }}
      >
        {getMessages.loading ? (
          <CircularProgress
            sx={{
              alignSelf: "center",
              margin: "auto",
            }}
          />
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
                "&::-webkit-scrollbar": { display: "none" },
                padding: "10px",
              }}
            >
              <ScrollableChat messages={messages} />
              {isTyping ? (
                <div className="typing">
                  <div className="typing__dot"></div>
                  <div className="typing__dot"></div>
                  <div className="typing__dot"></div>
                </div>
              ) : (
                <></>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                backgroundColor: "#ebebeb",
                alignItems: "center",
                paddingLeft: "10px",
              }}
            >
              <TextField
                onKeyDown={sendMessage}
                onChange={handleTyping}
                value={newMessage}
                placeholder="Enter a message"
                sx={{
                  flexGrow: 6,
                  "& fieldset": { border: "none" },
                }}
              />
              <Box
                sx={{
                  padding: "10px",
                  height: "100%",
                }}
              >              <IconButton
                  data-testid="send-button"
                  onClick={(e) => sendMessage(e, true)}
                  sx={{ ":hover": { backgroundColor: "#278ff7" } }}
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default SingleChat;
