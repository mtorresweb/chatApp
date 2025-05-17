# Getting Started

This guide will help you set up and start working with the Chat App frontend.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or newer)
- npm, yarn, or pnpm (we recommend pnpm)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app/frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000
   ```

## Running the Development Server

Start the development server:
```bash
pnpm dev
```

This will start the application on [http://localhost:5173](http://localhost:5173) (or the next available port).

## Testing

Run tests:
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Building for Production

Create a production build:
```bash
pnpm build
```

This will generate optimized files in the `dist` directory.

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
├── docs/                    # Documentation
├── index.html               # HTML entry point
└── vite.config.js           # Vite configuration
```

## Key Features

- Real-time messaging using Socket.io
- User authentication
- One-on-one and group chats
- User search functionality
- Typing indicators
- Message notifications
- Profile management

## Development Workflow

1. Create a new branch for your feature or bug fix
2. Write tests for your changes
3. Implement your changes while ensuring all tests pass
4. Submit a pull request for review

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate test coverage report
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview the production build locally

## Additional Resources

- [Component Documentation](./COMPONENTS.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [React Documentation](https://react.dev/)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [Socket.io Documentation](https://socket.io/docs/v4/)

## Need Help?

If you have any questions or issues, please reach out to the project maintainers or create an issue in the repository.
