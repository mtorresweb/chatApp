# chatApp
A full-stack real-time chat application built with Express, MongoDB, React, and Socket.io.

[![chat](https://res.cloudinary.com/dojhj2erh/image/upload/v1691940262/portfolio/startChating_cqknxc.png "chat")](https://res.cloudinary.com/dojhj2erh/image/upload/v1691940262/portfolio/startChating_cqknxc.png "chat")

## Overview
  
This project is a comprehensive real-time chat application featuring a robust frontend and backend architecture. The frontend is built with React, Material UI, and styled components to provide a modern and responsive user interface. The backend API is developed using Express and MongoDB for data persistence, while Socket.io enables real-time messaging capabilities. The application incorporates security best practices through libraries like express-validator, helmet, express-rate-limit, and jsonwebtoken.

### Project Structure

```
├── frontend/     # React frontend application
└── api/          # Express and MongoDB backend
```
    
### Key Features
    
1. **Real-Time Communication:** The core functionality of the project is centered around real-time communication. Utilizing Socket.io, the application facilitates instant messaging and updates between users, creating a seamless and engaging chat experience.
    
2. **Responsive UI with Material UI:** The frontend is designed using Material UI components, ensuring a responsive and visually appealing user interface across different devices and screen sizes. This fosters an intuitive and comfortable user experience.
    
3. **Backend Powered by Express and MongoDB:** The backend is built using the Express framework, providing a robust foundation for handling API requests and routing. MongoDB is employed as the database of choice, enabling efficient data storage and retrieval for chat messages and user information.
    
4. **Enhanced Security with Middleware:** Libraries like express-validator and helmet are integrated to bolster security measures. express-validator ensures valid and sanitized data inputs, while helmet adds additional layers of protection to prevent common web vulnerabilities.
    
5. **Token-Based Authentication with jsonwebtoken:** User authentication is achieved through token-based authentication using jsonwebtoken. This ensures secure and authenticated access to the chat application, safeguarding user data and interactions.

6. **Group Chat Functionality:** Users can create group chats, add or remove participants, and rename groups, enabling team collaboration and multi-user communication.

7. **Real-Time Typing Indicators:** The application shows when users are typing, providing a more interactive and responsive chat experience.

8. **Comprehensive Test Coverage:** Both frontend and backend include extensive unit and integration tests using Jest, ensuring code reliability and stability.
    
## Testing the application

To effectively test the application, follow these steps:
    
1. **Account Creation:** Click 'signUp' to create an account. Provide a fictional email address, password, and username.

[![Register](https://res.cloudinary.com/dojhj2erh/image/upload/v1691940262/portfolio/signUp_mdm1k9.png "Register")](https://res.cloudinary.com/dojhj2erh/image/upload/v1691940262/portfolio/signUp_mdm1k9.png "Register")
    
2. **Creating Another Account:** Open another browser tab or use a different device to repeat the account creation process as described above.
    
3. **User Search:** Access the 'SEARCH USER' feature to find users. Enter the username of the user you wish to chat with (ensure the email address matches the one you entered earlier). Finally, click the search button.

[![Search User](https://res.cloudinary.com/dojhj2erh/image/upload/v1691940262/portfolio/searchUser_rv4osn.png "Search User")](https://res.cloudinary.com/dojhj2erh/image/upload/v1691940262/portfolio/searchUser_rv4osn.png "Search User")
    
4. **Initiate Chat:** Click on the desired user to initiate a chat. Once the chat is established, you can begin your conversation.

[![Select User](https://res.cloudinary.com/dojhj2erh/image/upload/v1691940262/portfolio/selectUser_ak1fhp.png "Select User")](https://res.cloudinary.com/dojhj2erh/image/upload/v1691940262/portfolio/selectUser_ak1fhp.png "Select User")
[![Start Chating](https://res.cloudinary.com/dojhj2erh/image/upload/v1691940262/portfolio/startChating_cqknxc.png "Start Chating")](https://res.cloudinary.com/dojhj2erh/image/upload/v1691940262/portfolio/startChating_cqknxc.png "Start Chating")

## Technical Implementation

### Frontend (React)

The frontend of the application is built with React and leverages several key technologies:

- **Vite:** Used as the build tool for faster development and optimized production builds
- **Material UI:** Provides a comprehensive set of UI components and theming
- **Socket.io-client:** Enables real-time communication with the backend
- **Context API:** Manages global state for user and chat data
- **Custom Hooks:** Encapsulates reusable logic for data fetching and user interactions
- **Jest and React Testing Library:** Used for comprehensive component and hook testing

### Backend (Express)

The backend API is built with Express.js and incorporates:

- **MongoDB and Mongoose:** For data modeling and persistence
- **Socket.io:** For real-time messaging and notifications
- **JWT Authentication:** Secures API endpoints and user sessions
- **Express Middleware:** Handles validation, error handling, and request processing
- **Jest:** For API and unit testing with mock databases

## Development Setup

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or pnpm

### Running the Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### Running the Backend

```bash
cd api
npm install
npm run dev
```

### Running Tests

Frontend tests:
```bash
cd frontend
pnpm test
```

Backend tests:
```bash
cd api
npm test
```

## Recent Updates

- Added comprehensive test coverage for both frontend and backend
- Fixed environment variable handling for better test compatibility
- Enhanced error handling in authentication flows
- Improved socket connection reliability
- Fixed UI responsiveness issues on mobile devices
