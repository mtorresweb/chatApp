import { Avatar, Badge, Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { PersonSearchOutlined } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { getSender } from "../chat methods";
import MyDrawer from "./MyDrawer";

export const SideDrawer = () => {
  const {
    user,
    setUser,
    setSelectedChat,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  const navigate = useNavigate();

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

  const toggleDrawer = (open) => {
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
          onClick={() => toggleDrawer(true)}
          startIcon={<PersonSearchOutlined />}
        >
          Search user
        </Button>
        <MyDrawer state={state} toggleDrawer={toggleDrawer} />
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
            {notifications.map((notification, i) => (
              <MenuItem
                key={i}
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
