import { ChatState } from "../Context/ChatProvider";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UpdateGroupModal from "./UpdateGroupModal";
import { getSender, getUser } from "../chat methods";
import ProfileModal from "./ProfileModal";
import { useEffect, useState } from "react";
import { Send } from "@mui/icons-material";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { socket } from "../socket";
let currentChat;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, setNotifications, chats } =
    ChatState();
  const [socketConnected, setSocketConnected] = useState(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState();

  const [info, setInfo] = useState({
    value: false,
    message: "",
    severity: "success",
  });

  const fetchMessages = async () => {
    if (!selectedChat._id) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/message/getMessages/${selectedChat._id}`,
        { headers: { Authorization: "Bearer " + user.token } }
      );

      setMessages(data);
    } catch {
      setInfo({
        value: true,
        message: "Error fetching messages",
        severity: "error",
      });
    }
    setLoading(false);
  };

  const sendMessage = async (e, buttonClicked = false) => {
    if ((e.key == "Enter" || buttonClicked) && newMessage) {
      try {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);

        const { data } = await axios.post(
          "http://localhost:3001/api/message/send",
          { content: newMessage, chatId: selectedChat._id },
          { headers: { Authorization: "Bearer " + user.token } }
        );

        setNewMessage("");
        setMessages((messages) => [...messages, data]);
        socket.emit("new message", data);
      } catch {
        setInfo({
          value: true,
          message: "Error sending message",
          severity: "error",
        });
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
  };

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

  useEffect(() => {
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("createChat", () => {
      setFetchAgain(!fetchAgain);
    });

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
      socket.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    currentChat = structuredClone(selectedChat);
  }, [selectedChat]);

  useEffect(() => {
    chats.forEach((chat) => {
      socket.emit("join chat", chat._id);
    });
  }, [chats]);

  return (
    <>
      {selectedChat._id ? (
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
              onClick={() => setSelectedChat("")}
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
            {loading ? (
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
                  >
                    <IconButton
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
      ) : (
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
      )}
      <Snackbar
        open={info.value}
        autoHideDuration={6000}
        onClose={() => setInfo({ value: false, message: "", severity: "" })}
      >
        <Alert
          onClose={() => setInfo({ value: false, message: "", severity: "" })}
          severity={info.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {info.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SingleChat;
