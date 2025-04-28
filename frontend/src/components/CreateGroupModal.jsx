import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import MyAlert from "./MyAlert";
import useAxios from "../hooks/useAxios";
import useUserSearch from "../hooks/useUserSearch";

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

  // user search
  const { setSearch, searchResults, setSearchResults, loading } =
    useUserSearch();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");

  const createGroup = useAxios({
    method: "post",
    url: "chat/createGroup",
    headers: {
      authorization: "Bearer " + user.token,
    },
  });

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

  //functions

  const addUser = (userToAdd) => {
    for (let index = 0; index < selectedUsers.length; index++) {
      if (selectedUsers[index]._id == userToAdd._id) {
        //user already added
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
    await createGroup.fetchData({
      name: groupChatName,
      users: selectedUsers.map((user) => user._id),
    });
  };

  useEffect(() => {
    if (createGroup.response) {
      setChats([createGroup.response, ...chats]);
      handleClose();
    }
  }, [createGroup.response]);

  return (
    <>
      <Button
        sx={{
          flex: 1,
          whiteSpace: "nowrap",
          width: "80%",
          maxWidth: "400px",
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
          {/* It displays the selected users list of the new group */}
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
          {/* when searching for a user, shows circular progress while loading; otherwise, it displays a list of matching users. */}
          {loading ? (
            <CircularProgress />
          ) : (
            /* if there are matching users it shows the list; otherwise, shows nothing */
            searchResults.length > 0 && (
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
            )
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
        </Box>
      </Modal>{" "}
      <MyAlert
        alert={createGroup.alert}
        handleClose={() => {
          createGroup.resetAlert();
        }}
      />
    </>
  );
};

export default CreateGroupModal;
