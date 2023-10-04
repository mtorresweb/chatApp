import { ChatState } from "../Context/ChatProvider";
import { Box, Container } from "@mui/material";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/SideDrawer";
import { useState } from "react";

const Chats = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <>
      <SideDrawer />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          height: "85%",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ display: "flex", gap: "20px", height: "100%" }}
        >
          {user && (
            <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Container>
      </Box>
    </>
  );
};

export default Chats;
