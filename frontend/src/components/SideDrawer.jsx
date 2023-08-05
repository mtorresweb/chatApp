import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Menu,
  MenuItem,
  Skeleton,
  Snackbar,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { PersonSearchOutlined } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import UserListItem from "./UserListItem";
import { getSender } from "../chat methods";
import { socket } from "../socket";

export const SideDrawer = () => {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  //search user
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState({
    value: false,
    message: "",
  });
  const handleSearch = async () => {
    if (!search) {
      setError({ value: true, message: "Search input is empty" });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3001/api/user/listUsers?search=${search}`,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      setLoading(false);
      setSearchResults(data);

      if (data.length == 0) {
        setError({ value: true, message: "No users found" });
      }
    } catch {
      setLoading(false);
      setError({ value: true, message: "Error searching user" });
      return;
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post(
        "http://localhost:3001/api/chat/access",
        { userId },
        {
          headers: { Authorization: "Bearer " + user.token },
        }
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setLoadingChat(false);
      setSelectedChat(data);

      socket.emit("createChat", {
        _id: data._id,
        users: data.users.filter((u) => u._id != user._id),
      });
    } catch {
      setLoadingChat(false);
      setError({ value: true, message: "Error loading chat" });
      return;
    }
  };

  //menu profile
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //menu notifications
  const [anchorNotifications, setAnchorNotifications] = useState(null);
  const openNotifications = Boolean(anchorNotifications);
  const handleClickNotifications = (event) => {
    setAnchorNotifications(event.currentTarget);
  };
  const handleCloseNotifications = () => {
    setAnchorNotifications(null);
  };

  //drawer
  const [state, setState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const logOutHandler = () => {
    sessionStorage.removeItem("userInfo");
    setUser({});
    setSelectedChat({});
    setChats([]);
    setNotifications([]);
    navigate("/");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 10px",
        }}
      >
        <Button
          variant="contained"
          onClick={toggleDrawer(true)}
          startIcon={<PersonSearchOutlined />}
        >
          Search user
        </Button>
        <Drawer
          variant="temporary"
          anchor={"left"}
          open={state}
          onClose={toggleDrawer(false)}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Box
              style={{ flex: 1.5, display: "flex", justifyContent: "flex-end" }}
            >
              Search User
            </Box>
            <Box
              style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
            >
              <Button onClick={toggleDrawer(false)}>
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
          {loading ? (
            <Box sx={{ width: 300, margin: "15px auto" }}>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
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
        <p className="button__text">Chat App</p>
        <Box sx={{ display: "flex" }}>
          <Button
            id="basic-button"
            aria-controls={openNotifications ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openNotifications ? "true" : undefined}
            onClick={handleClickNotifications}
          >
            <Badge badgeContent={notifications.length}>
              <NotificationsIcon />
            </Badge>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorNotifications}
            open={openNotifications}
            onClose={handleCloseNotifications}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {notifications.map((notification) => (
              <MenuItem
                key={notification._id}
                onClick={() => {
                  setSelectedChat(notification.chat);
                  setNotifications((prevNotifications) =>
                    prevNotifications.filter(
                      (n) => n.chat._id !== notification.chat._id
                    )
                  );
                  handleCloseNotifications();
                }}
              >
                {notification.chat.isGroupChat
                  ? `New message in ${notification.chat.chatName}`
                  : `New message from ${getSender(
                      user,
                      notification.chat.users
                    )}`}
              </MenuItem>
            ))}
          </Menu>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <Avatar alt="user-avatar" src={user.pic} />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem sx={{ padding: " 5px" }}>
              <ProfileModal user={user}>My Profile</ProfileModal>
            </MenuItem>
            <MenuItem onClick={logOutHandler}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
    </>
  );
};

export default SideDrawer;
