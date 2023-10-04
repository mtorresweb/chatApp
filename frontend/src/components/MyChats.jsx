import { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Button, Skeleton } from "@mui/material";
import CreateGroupModal from "./CreateGroupModal";
import styled from "styled-components";
import { getSender } from "../chat methods";
import ReplayIcon from "@mui/icons-material/Replay";
import useAxios from "../hooks/useAxios";

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

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();

  const fetchChats = useAxios({
    method: "get",
    url: "chat/getChats",
    headers: {
      authorization: "Bearer " + user.token,
    },
  });

  const getChats = async () => {
    await fetchChats.fetchData();
  };

  //it fetches chats as needed
  useEffect(() => {
    getChats();
  }, [fetchAgain, user]);

  //it stops loading when the chats are fetched
  useEffect(() => {
    if (fetchChats.response) {
      setChats(fetchChats.response);
    }
  }, [fetchChats.response]);

  const reload = () => {
    setSelectedChat({});
    setFetchAgain(!fetchAgain);
  };

  return (
    <Chats display={selectedChat?._id}>
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
        <Button variant="text" onClick={reload}>
          <ReplayIcon />
        </Button>
      </Box>
      <Box sx={{ display: "grid", placeItems: "center" }}>
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
        {fetchChats.loading ? (
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
