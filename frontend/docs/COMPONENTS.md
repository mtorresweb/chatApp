# Component Documentation

This document provides detailed documentation for the key components of the Chat App frontend.

## Table of Contents

- [Context](#context)
  - [ChatProvider](#chatprovider)
- [Pages](#pages)
  - [Chats](#chats)
  - [LogIn](#login)
  - [SignUp](#signup)
- [Components](#components)
  - [SingleChat](#singlechat)
  - [MyChats](#mychats)
  - [SideDrawer](#sidedrawer)
  - [ProfileModal](#profilemodal)
  - [ScrollableChat](#scrollablechat)
  - [UserListItem](#userlistitem)
  - [UserBadgeItem](#userbadgeitem)
  - [UpdateGroupModal](#updategroupmodal)
  - [CreateGroupModal](#creategroupmodal)
- [Hooks](#hooks)
  - [useAxios](#useaxios)
  - [useUserSearch](#useusersearch)
- [Utilities](#utilities)
  - [Chat Methods](#chat-methods)
  - [Socket](#socket)

---

## Context

### ChatProvider

The central state management for the application using React Context.

**File**: `src/Context/ChatProvider.jsx`

**State**:
- `user`: Current authenticated user
- `selectedChat`: Currently selected chat conversation
- `chats`: List of all user's chats
- `notifications`: Unread message notifications

**Usage**:
```jsx
import { ChatState } from '../Context/ChatProvider';

const MyComponent = () => {
  const { user, selectedChat, chats, notifications } = ChatState();
  // Work with these states
};
```

---

## Pages

### Chats

Main chat interface page that contains the side drawer, chat list, and chat box.

**File**: `src/pages/Chats.jsx`

**Features**:
- Layout for the main chat interface
- Displays side drawer, chat list, and chat box
- Conditionally renders components based on authentication

### LogIn

Authentication page for existing users.

**File**: `src/pages/LogIn.jsx`

**Features**:
- Login form with validation
- Error handling for API responses
- Guest user login option
- Navigation to sign up page

### SignUp

Registration page for new users.

**File**: `src/pages/SignUp.jsx`

**Features**:
- Registration form with validation
- Profile picture upload with Cloudinary
- Error handling for API responses
- Navigation to login page

---

## Components

### SingleChat

Displays and manages an individual chat conversation.

**File**: `src/components/SingleChat.jsx`

**Props**:
- `fetchAgain`: Boolean state to trigger chat refresh
- `setFetchAgain`: Function to update fetchAgain state

**Features**:
- Displays chat messages
- Sends messages
- Shows typing indicators
- Handles real-time updates via Socket.io
- Supports both one-on-one and group chats

**Methods**:
- `fetchMessages()`: Retrieves chat history
- `sendMessage()`: Sends a new message
- `handleTyping()`: Manages typing indicator logic

### MyChats

Displays the list of user's chats.

**File**: `src/components/MyChats.jsx`

**Props**:
- `fetchAgain`: Boolean state to track chat list refresh
- `setFetchAgain`: Function to update fetchAgain state

**Features**:
- Lists all user chats (one-on-one and groups)
- Allows creation of group chats
- Shows unread notifications
- Enables chat selection

### SideDrawer

Navigation component with user search functionality.

**File**: `src/components/SideDrawer.jsx`

**Features**:
- User search with real-time results
- Notifications display
- Profile access
- Logout functionality
- Responsive design with drawer for mobile

### ProfileModal

Modal to display user profile information.

**File**: `src/components/ProfileModal.jsx`

**Props**:
- `user`: User object containing profile information
- `children`: Button or component that triggers the modal
- `isOpen`: Boolean state controlling modal visibility
- `onClose`: Function to close the modal

**Features**:
- Displays user profile picture
- Shows user name and email
- Custom trigger element via children prop

### ScrollableChat

Scrollable container for chat messages.

**File**: `src/components/ScrollableChat.jsx`

**Props**:
- `messages`: Array of message objects to display

**Features**:
- Auto-scrolls to newest messages
- Groups messages by sender
- Displays sender information when needed
- Handles message alignment based on sender

### UserListItem

List item component for displaying user information in search results.

**File**: `src/components/UserListItem.jsx`

**Props**:
- `user`: User object containing profile information
- `handleFunction`: Click handler function

**Features**:
- Displays user avatar, name, and email
- Click functionality for user selection

### UserBadgeItem

Badge component for selected users in group creation/editing.

**File**: `src/components/UserBadgeItem.jsx`

**Props**:
- `user`: User object containing profile information
- `handleFunction`: Function called when remove button is clicked
- `admin`: Boolean indicating if user is group admin

**Features**:
- Compact display of selected user
- Remove functionality
- Admin indicator for group chats

### UpdateGroupModal

Modal for editing group chat details.

**File**: `src/components/UpdateGroupModal.jsx`

**Props**:
- `fetchAgain`: Boolean state to trigger chat refresh
- `setFetchAgain`: Function to update fetchAgain state
- `fetchMessages`: Function to refresh messages

**Features**:
- Group name editing
- User management (add/remove)
- Admin privileges
- Real-time updates via Socket.io

### CreateGroupModal

Modal for creating new group chats.

**File**: `src/components/CreateGroupModal.jsx`

**Features**:
- Group name input
- User search and selection
- Creation of new group chat
- Error handling

---

## Hooks

### useAxios

Custom hook for making API requests with consistent handling of loading states and errors.

**File**: `src/hooks/useAxios.jsx`

**Parameters**:
- `url`: API endpoint URL
- `method`: HTTP method (get, post, put, delete)
- `headers`: Optional HTTP headers

**Returns**:
- `response`: API response data
- `error`: Error object if request fails
- `loading`: Boolean loading state
- `fetchData`: Function to execute the request
- `alert`: Alert state for UI feedback
- `resetAlert`: Function to reset alert state

**Usage**:
```jsx
const { response, loading, error, fetchData } = useAxios({
  method: 'get',
  url: 'user/profile',
  headers: { authorization: `Bearer ${token}` }
});

// Call fetchData with optional body
fetchData({ username: 'newUsername' });
```

### useUserSearch

Custom hook for searching users with controlled input.

**File**: `src/hooks/useUserSearch.jsx`

**Returns**:
- `searchTerm`: Current search query
- `setSearchTerm`: Function to update search query
- `searchResults`: Array of matching users
- `loading`: Boolean loading state
- `searchUsers`: Function to trigger search
- `searchAlert`: Alert state for errors

**Usage**:
```jsx
const { 
  searchTerm, 
  setSearchTerm, 
  searchResults, 
  loading,
  searchUsers 
} = useUserSearch();

// Update search term
setSearchTerm('john');

// Trigger search
searchUsers();
```

---

## Utilities

### Chat Methods

Utility functions for chat UI operations.

**File**: `src/chat methods/index.js`

**Functions**:
- `getSender(loggedUser, users)`: Gets the name of the other user in a one-on-one chat
- `getUser(loggedUser, users)`: Gets the user object of the other user in a one-on-one chat
- `isSameSender(messages, currentMessage, index, userId)`: Checks if current message is from a different sender than the next
- `isLastMessage(messages, index, userId)`: Checks if message is the last one in the chat
- `isSameUser(messages, message, index)`: Checks if message is from the same sender as the previous
- `isSameSenderMargin(messages, message, index, userId)`: Calculates margins for message alignment

### Socket

Socket.io configuration for real-time communication.

**File**: `src/socket.js`

**Events**:
- `setup`: Establishes connection with user data
- `typing`: Shows typing indicators
- `stop typing`: Hides typing indicators
- `new message`: Sends a new message to recipients
- `message received`: Handles incoming messages
- Various group chat events for user management
