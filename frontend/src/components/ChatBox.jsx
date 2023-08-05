import styled from "styled-components";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const Chat = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  background-color: #e2e2e2;

  @media screen and (max-width: 1024px) {
    display: ${(props) => (props.display ? "flex" : "none")};
  }
`;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Chat display={selectedChat._id}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Chat>
  );
};

export default ChatBox;
