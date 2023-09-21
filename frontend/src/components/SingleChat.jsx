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
import { getMessagesApi, sendMessageApi } from "../api/messageApi";
import MyAlert from "./MyAlert";
let currentChat;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, setNotifications, chats } =
    ChatState();
  const loggedUser = useRef(user);
  const [socketConnected, setSocketConnected] = useState(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState();

  const [alert, setAlert] = useState({
    active: false,
    message: "",
    severity: "success",
  });

  const fetchMessages = async () => {
    if (!selectedChat?._id) return;

    setLoading(true);

    const data = await getMessagesApi(selectedChat, user);
    setLoading(false);

    if (!data) {
      setAlert({
        active: true,
        message: "Error fetching messages",
        severity: "error",
      });
      return;
    }

    setMessages(data);
  };

  const sendMessage = async (e, buttonClicked = false) => {
    if ((e.key == "Enter" || buttonClicked) && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);

      const data = await sendMessageApi(newMessage, selectedChat, user);
      setNewMessage("");

      if (!data) {
        setAlert({
          active: true,
          message: "Error sending message",
          severity: "error",
        });
        return;
      }

      setMessages((messages) => [...messages, data]);
      socket.emit("new message", data);
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
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    socket.on("removed from group", (userId) => {
      if (userId == loggedUser.current._id) {
        setSelectedChat();
        setFetchAgain(!fetchAgain);
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

    //remove subscriptions to socket events
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  //every time the selected chat changes, get the new messages and the current chat
  useEffect(() => {
    fetchMessages();
    currentChat = structuredClone(selectedChat);
  }, [selectedChat]);

  //subscribe to chats
  useEffect(() => {
    chats?.forEach((chat) => {
      socket.emit("join chat", chat._id);
    });
  }, [chats]);

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

      <MyAlert
        alert={alert}
        handleClose={() =>
          setAlert({
            active: false,
            message: "",
            severity: "success",
          })
        }
      />
    </>
  );
};

export default SingleChat;
