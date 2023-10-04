import { useEffect } from "react";
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
import useAxios from "../hooks/useAxios";
import useUserSearch from "../hooks/useUserSearch";

const MyDrawer = ({ state, toggleDrawer }) => {
  const { user, setSelectedChat, chats, setChats } = ChatState();

  const getChat = useAxios({
    method: "post",
    url: "chat/access",
    headers: {
      authorization: "Bearer " + user.token,
    },
  });

  const { setSearch, searchResults, loading } = useUserSearch();

  const accessChat = async (userId) => {
    await getChat.fetchData({ userId });
  };

  useEffect(() => {
    if (getChat.response) {
      if (!chats.find((chat) => chat._id === getChat.response._id)) {
        setChats([getChat.response, ...chats]);
      }

      setSelectedChat(getChat.response);
    }
  }, [getChat.response]);

  const closeDrawer = () => {
    toggleDrawer(false);
  };

  return (
    <Drawer
      variant="temporary"
      anchor={"left"}
      open={state}
      onClose={closeDrawer}
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
      <Box sx={{ padding: "0 20px" }} role="presentation">
        <TextField
          label="search by name or email"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      {loading ? (
        <Box sx={{ width: "80%", margin: "15px auto" }}>
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
      {getChat.loading ? (
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
      <MyAlert alert={getChat.alert} handleClose={() => getChat.resetAlert()} />
    </Drawer>
  );
};

export default MyDrawer;
