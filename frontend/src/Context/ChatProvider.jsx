import { createContext, useContext, useState } from "react";

/**
 * Chat context object that provides chat state across the application
 * @type {React.Context<{
 *   user: Object,
 *   setUser: Function,
 *   selectedChat: Object,
 *   setSelectedChat: Function,
 *   chats: Array,
 *   setChats: Function,
 *   notifications: Array,
 *   setNotifications: Function
 * }>}
 */
export const ChatContext = createContext({});

/**
 * Provider component that wraps the app and makes chat state available to any
 * child component that calls the useChat hook.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Chat provider component
 */
const ChatProvider = ({ children }) => {
  // User information and authentication state
  const [user, setUser] = useState({});
  // Currently selected chat conversation
  const [selectedChat, setSelectedChat] = useState({});
  // List of all chats the user is part of
  const [chats, setChats] = useState([]);
  // Unread message notifications
  const [notifications, setNotifications] = useState([]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>  );
};

/**
 * Hook that provides access to the chat context
 * @returns {Object} Chat context object containing user data, selected chat, chat list, and notifications
 */
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
