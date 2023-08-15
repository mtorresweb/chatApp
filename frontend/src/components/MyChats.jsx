import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { Box, Skeleton } from "@mui/material";
import CreateGroupModal from "./CreateGroupModal";
import styled from "styled-components";
import { getSender } from "../chat methods";

const Chats = styled.div`
  flex: 1;
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  padding: 10px;
  background-color: #ebebeb;

  @media screen and (max-width: 1024px) {
    display: ${(props) => (props.display ? "none" : "flex")};
  }
`;

const MyChats = ({ fetchAgain }) => {
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();

  const [loading, setLoading] = useState(true);

  const getChats = async () => {
    if (!user._id) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/chat/getChats`,
        { headers: { Authorization: "Bearer " + user.token } }
      );

      setChats(data);
    } catch {
      //
    }
  };

  useEffect(() => {
    getChats();
  }, [fetchAgain, user]);

  useEffect(() => {
    if (chats) {
      setLoading(false);
    }
  }, [chats]);

  return (
    <Chats display={selectedChat._id}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          padding: "20px",

          "@media (max-width: 480px)": {
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          },
        }}
      >
        <h2 style={{ whiteSpace: "nowrap", flex: 2 }}>My chats</h2>
        <CreateGroupModal />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "20px 10px 20px 0",
        }}
      >
        {loading ? (
          <Box sx={{ width: "80%", margin: "15px auto" }}>
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
              overflowY: "scroll",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "20px",
                  margin: "10px 15px",
                  padding: "10px",
                  borderRadius: "5px",
                  ":hover": { backgroundColor: "#e2e2e2" },
                }}
              >
                <Box>
                  <h3>
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : chat.chatName}
                  </h3>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Chats>
  );
};

export default MyChats;
