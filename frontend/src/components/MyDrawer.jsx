import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  Skeleton,
  TextField,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import UserListItem from "./UserListItem";
import MyAlert from "./MyAlert";
import { socket } from "../socket";
import { userSearchApi } from "../api/userApi";
import { accessChatApi } from "../api/chatApi";

const MyDrawer = ({ state, toggleDrawer }) => {
  const { user, setSelectedChat, chats, setChats } = ChatState();

  //alerts
  const [alert, setAlert] = useState({
    active: false,
    message: "",
    severity: "success",
  });

  //search user
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleSearch = async () => {
    if (!search) {
      setAlert({
        active: true,
        message: "Search input is empty",
        severity: "warning",
      });
      return;
    }

    setLoading(true);

    let matchingUsers = await userSearchApi(search, user);
    setLoading(false);

    setSearchResults(matchingUsers);

    if (!matchingUsers) {
      setAlert({
        active: true,
        message: "No users found",
        severity: "warning",
      });
      return;
    }
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);

    let newChat = await accessChatApi(userId, user);
    setLoadingChat(false);

    if (!newChat) {
      setAlert({
        active: true,
        message: "Could not create the new chat",
        severity: "error",
      });
      return;
    }

    if (!chats.find((chat) => chat._id === newChat._id))
      setChats([newChat, ...chats]);

    setSelectedChat(newChat);
  };

  useEffect(() => {
    () => {
      setSearch("");
      setSearchResults([]);
    };
  }, []);

  return (
    <Drawer
      variant="temporary"
      anchor={"left"}
      open={state}
      onClose={() => toggleDrawer(false)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Box style={{ flex: 1.5, display: "flex", justifyContent: "flex-end" }}>
          Search User
        </Box>
        <Box style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() => toggleDrawer(false)}>
            <LogoutIcon />
          </Button>
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", gap: "20px", padding: "0 20px" }}
        role="presentation"
      >
        <TextField
          label="search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outlined" onClick={handleSearch}>
          Find
        </Button>
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
      </Box>
      {loading ? (
        <Box sx={{ width: 300, margin: "15px auto" }}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Box>
      ) : (
        <Box
          sx={{
            paddingTop: "15px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {searchResults.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleClick={() => accessChat(user._id)}
              small={true}
            />
          ))}
        </Box>
      )}
      {loadingChat ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "15px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <></>
      )}
    </Drawer>
  );
};

export default MyDrawer;
