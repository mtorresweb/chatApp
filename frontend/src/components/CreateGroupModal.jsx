import { Add } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: "10px",
  "@media (max-width: 768px)": {
    height: "100%",
    border: "none",
    maxWidth: "100%",
  },
};

const CreateGroupModal = () => {
  const { user, setChats, chats } = ChatState();

  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  //modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSearch("");
    setSearchResults([]);
    setSelectedUsers([]);
    setGroupChatName("");
    setOpen(false);
  };

  const [error, setError] = useState({
    value: false,
    message: "",
  });

  const handleSearch = async () => {
    if (!search) return;

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/listUsers?search=${search}`,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      if (data.length == 0) {
        setError({ value: true, message: "No users found" });
      }

      setSearchResults(data);
    } catch {
      setError({ value: true, message: "Error getting users" });
    }
    setLoading(false);
  };

  const addUser = (userToAdd) => {
    for (let index = 0; index < selectedUsers.length; index++) {
      if (selectedUsers[index]._id == userToAdd._id) {
        setError({ value: true, message: "User already selected" });
        return;
      }
    }
    setSelectedUsers((selected) => [...selected, userToAdd]);
  };

  const RemoveUser = (userToRemove) => {
    setSelectedUsers((selected) =>
      selected.filter((selectedUser) => selectedUser._id != userToRemove._id)
    );
  };

  const handleSubmit = async () => {
    if (!selectedUsers || !groupChatName) {
      setError({ value: true, message: "Please fill out the fields" });
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/createGroup`,
        { name: groupChatName, users: selectedUsers.map((user) => user._id) },
        {
          headers: { Authorization: "Bearer " + user.token },
        }
      );

      setChats([data, ...chats]);
      handleClose();
    } catch {
      setError({ value: true, message: "Error creating group chat" });
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <>
      <Button
        sx={{
          flex: 1,
          whiteSpace: "nowrap",
          maxWidth: "150px",
          minWidth: "120px",
        }}
        onClick={handleOpen}
        variant="contained"
        endIcon={<Add />}
      >
        New group
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} maxWidth={"80vw"}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create group chat
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "30px 0",
              gap: "20px",
            }}
          >
            <TextField
              placeholder="Group name"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <TextField
              placeholder="Add users, e.g. Paola, Andres, David"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          {selectedUsers.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {selectedUsers.map((userItem) => (
                <Box
                  key={userItem._id}
                  sx={{
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  <UserBadgeItem user={userItem} handleRemove={RemoveUser} />
                </Box>
              ))}
            </Box>
          )}
          {loading ? (
            <CircularProgress />
          ) : searchResults.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
                height: "100px",
                overflowY: "scroll",
                overflowX: "hidden",
                "@media (max-width: 480px)": {
                  alignItems: "flex-start",
                },
                backgroundColor: "#c2bfbf",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "20px",
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
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={handleClose}
              sx={{
                alignSelf: "flex-end",
                background: "#575757",
                ":hover": { background: "#464545" },
              }}
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              sx={{ alignSelf: "flex-end" }}
              variant="contained"
            >
              Create
            </Button>
          </Box>
          <Snackbar
            open={error.value}
            autoHideDuration={6000}
            onClose={() => setError({ value: false, message: "" })}
          >
            <Alert
              onClose={() => setError({ value: false, message: "" })}
              severity="warning"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {error.message}
            </Alert>
          </Snackbar>
        </Box>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
