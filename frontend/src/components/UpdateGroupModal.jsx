import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { ChatState } from "../Context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MyAlert from "./MyAlert";
import { socket } from "../socket";
import useAxios from "../hooks/useAxios";
import useUserSearch from "../hooks/useUserSearch";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  padding: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "10px",
  gap: "20px",
  height: "99%",
  width: "100%",
  maxWidth: 400,
  "@media (max-width: 768px)": {
    height: "100%",
    border: "none",
    maxWidth: "100%",
  },
};

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { selectedChat, setSelectedChat, user, setChats } = ChatState();

  const leaveChat = useAxios({
    method: "put",
    url: `chat/leaveGroup/${selectedChat._id}`,
    headers: {
      authorization: "Bearer " + user.token,
    },
  });

  const addUserToChat = useAxios({
    method: "put",
    url: `chat/addUser`,
    headers: {
      authorization: "Bearer " + user.token,
    },
  });

  const removeUserFromChat = useAxios({
    method: "put",
    url: `chat/removeUser`,
    headers: {
      authorization: "Bearer " + user.token,
    },
  });

  const renameChat = useAxios({
    method: "put",
    url: `chat/renameGroup`,
    headers: {
      authorization: "Bearer " + user.token,
    },
  });

  const { setSearch, searchResults, loading, setSearchResults } =
    useUserSearch();

  const [groupChatName, setGroupChatName] = useState("");

  //modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setGroupChatName("");
    setSearch("");
    setSearchResults([]);
    setOpen(false);
  };

  const [alert, setAlert] = useState({
    active: false,
    message: "",
    severity: "info",
  });

  //remove user functionality
  const RemoveUser = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      setAlert({
        active: true,
        message: "Only administrators can remove users",
        severity: "warning",
      });
      return;
    }

    await removeUserFromChat.fetchData({
      chatId: selectedChat._id,
      userId: userToRemove._id,
    });
    setGroupChatName("");

    socket.emit("removed from group", {
      userId: userToRemove._id,
      room: selectedChat._id,
    });
  };

  useEffect(() => {
    if (removeUserFromChat.response) {
      setSelectedChat(removeUserFromChat.response);
      setFetchAgain(!fetchAgain);
      fetchMessages();
    }
  }, [removeUserFromChat.response]);

  //rename group chat functionality
  const handleRename = async () => {
    if (!groupChatName) return;

    await renameChat.fetchData({
      chatId: selectedChat._id,
      chatName: groupChatName,
    });
    setGroupChatName("");
  };

  useEffect(() => {
    if (renameChat.response) {
      setSelectedChat(renameChat.response);
      setFetchAgain(!fetchAgain);
    }
  }, [renameChat.response]);

  //add user to group chat functionality
  const addUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      setAlert({
        active: true,
        message: "User is already in group",
        severity: "warning",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      setAlert({
        active: true,
        message: "Only administrators can add users",
        severity: "warning",
      });
      return;
    }

    await addUserToChat.fetchData({
      chatId: selectedChat._id,
      userId: userToAdd._id,
    });
  };

  useEffect(() => {
    if (addUserToChat.response) {
      setGroupChatName("");

      setSelectedChat(addUserToChat.response);
      setFetchAgain(!fetchAgain);
    }
  }, [addUserToChat.response]);

  //leave group chat functionality
  const leaveGroup = async () => {
    await leaveChat.fetchData();
    setGroupChatName("");

    socket.emit("leave group", selectedChat);

    setSelectedChat({});
    setChats((chats) => chats.filter((chat) => chat._id !== selectedChat._id));
  };

  return (
    <Box>
      <VisibilityIcon
        onClick={handleOpen}
        sx={{ ":hover": { cursor: "pointer" } }}
      />
      <Modal open={open} onClose={handleClose} aria-labelledby="Update group">
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ alignSelf: "center" }}
          >
            {selectedChat.chatName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              padding: "0 20px",
              "@media (max-width: 480px)": {
                flexDirection: "column",
              },
            }}
          >
            <TextField
              placeholder="New chat name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button onClick={handleRename} variant="contained">
              Update
            </Button>
          </Box>

          <Divider />
          <Box
            sx={{
              padding: "0 20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              placeholder="Add users, e.g. Paola, Andres, David"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          {loading ? (
            <CircularProgress />
          ) : searchResults.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
                height: "300px",
                overflowY: "scroll",
                overflowX: "hidden",
                "@media (max-width: 480px)": {
                  alignItems: "flex-start",
                },
                backgroundColor: "#c2bfbf",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              {searchResults.map((userItem) => (
                <UserListItem
                  key={userItem._id}
                  user={userItem}
                  handleClick={() => addUser(userItem)}
                />
              ))}
            </Box>
          ) : (
            <></>
          )}
          <Divider />
          {selectedChat.users && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              {selectedChat.users.map((userItem) => (
                <Box
                  key={userItem._id}
                  sx={{
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {userItem._id != user._id && (
                    <UserBadgeItem user={userItem} handleRemove={RemoveUser} />
                  )}
                </Box>
              ))}
            </Box>
          )}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button
              onClick={handleClose}
              sx={{
                background: "#575757",
                ":hover": { background: "#464545" },
              }}
              variant="contained"
            >
              Close
            </Button>
            <Button
              onClick={() => leaveGroup()}
              variant="contained"
              color="error"
            >
              Leave group
            </Button>
          </Box>
        </Box>
      </Modal>

      <MyAlert
        alert={alert}
        handleClose={() =>
          setAlert({
            active: false,
            message: "",
            severity: "warning",
          })
        }
      />
    </Box>
  );
};

export default UpdateGroupModal;
