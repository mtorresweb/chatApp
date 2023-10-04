import { Avatar, Box, Tooltip } from "@mui/material";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../chat methods/index";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed className="scrollable-chat">
      {messages.map((message, i) => (
        <Box
          key={message._id}
          sx={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          {(isSameSender(messages, message, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Tooltip>
              <Avatar src={message.sender.pic} />
            </Tooltip>
          )}
          <Box
            sx={{
              backgroundColor:
                message.sender._id == user._id ? "#278ff7" : "#505050",
              borderRadius: "20px",
              padding: "5px 10px",
              maxWidth: "75%",
              marginLeft: isSameSenderMargin(messages, message, i, user._id),
              marginTop: isSameUser(messages, message, i, user._id)
                ? "5px"
                : "15px",
            }}
          >
            {message.content}
          </Box>
        </Box>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
