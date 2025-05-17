# Chat App Frontend

A modern chat application frontend built with React, Socket.io, and Material UI.

## Features

- Real-time messaging with Socket.io
- User authentication and profile management
- Group chat functionality
- One-on-one chat capabilities
- User search functionality
- Message notifications
- Typing indicators
- Responsive design for various screen sizes

## Documentation

- [Getting Started Guide](./docs/GETTING_STARTED.md)
- [Component Documentation](./docs/COMPONENTS.md)
- [Coding Standards](./docs/CODING_STANDARDS.md)

## Tech Stack

- React 18
- Material UI
- Socket.io-client
- React Router
- Axios for API requests
- React Hook Form for form management
- Vite as the build tool
- Jest and Testing Library for testing

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or pnpm package manager

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd chat-app/frontend
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Development Server

```bash
pnpm dev
```

This will start the development server, typically at http://localhost:5173 (or the next available port).

### Building for Production

```bash
pnpm build
```

This will create an optimized production build in the `dist` directory.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (development)
pnpm test:watch

# Generate test coverage report
pnpm test:coverage
```

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/                     # Source code
│   ├── api/                 # API service layers
│   ├── chat methods/        # Chat utility functions
│   ├── components/          # Reusable React components
│   ├── Context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── tests/               # Test files
│   ├── index.css            # Global styles
│   ├── main.jsx             # App entry point
│   └── socket.js            # Socket.io configuration
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── jest.config.js           # Jest configuration
├── babel.config.json        # Babel configuration
└── package.json             # Project dependencies and scripts
```

## Component Documentation

### ChatProvider

The `ChatProvider` component serves as the central state management for the application using React Context. It manages:

- User authentication state
- Selected chat
- Chat list
- Notifications

```jsx
// Usage:
import { ChatState } from '../Context/ChatProvider';

const MyComponent = () => {
  const { user, selectedChat, chats, notifications } = ChatState();
  
  // Now you can use these states and their setters
};
```

### SingleChat

The `SingleChat` component handles the display and functionality of an individual chat conversation. It includes:

- Message display
- Message sending
- Typing indicators
- Socket event handling for real-time updates

### MyChats

The `MyChats` component displays the list of user's chats (both one-on-one and group chats) and allows for:

- Selecting a chat
- Creating new group chats
- Viewing chat notifications

### SideDrawer

The `SideDrawer` component provides navigation and search functionality:

- User search
- Notification display
- Profile access
- Logout functionality

## Custom Hooks

### useAxios

A custom hook for making API requests with loading states and error handling.

```jsx
// Usage:
const { loading, error, response, fetchData } = useAxios({
  method: 'get',
  url: '/api/endpoint',
  headers: { authorization: `Bearer ${token}` }
});

// Call fetchData to make the request
fetchData();
```

### useUserSearch

A custom hook for searching users with controlled input.

```jsx
// Usage:
const { searchTerm, setSearchTerm, searchResults, loading, searchUsers } = useUserSearch();
```

## Socket Events

The application uses Socket.io for real-time communication. Key events include:

- `setup`: Establishes connection with user data
- `typing`: Shows typing indicators
- `stop typing`: Hides typing indicators
- `new message`: Sends a new message to recipients
- `message received`: Handles incoming messages
- Various group chat events for user management

## Testing

The frontend uses Jest and React Testing Library for testing components, hooks, and utility functions. Tests are located in the `src/tests` directory, mirroring the structure of the source code.

## Deployment

The project is set up for deployment on Netlify with configuration in `netlify.toml`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
