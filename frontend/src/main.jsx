import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";

//pages
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import ChatProvider from "./Context/ChatProvider";
import Chats from "./pages/Chats";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LogIn />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/chats",
    element: (
      <ProtectedRoute>
        <Chats />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <CssBaseline>
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  </CssBaseline>
);
