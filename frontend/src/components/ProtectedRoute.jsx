import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ChatContext } from "../Context/ChatProvider";

function ProtectedRoute({ children }) {
  let navigate = useNavigate();
  const { setUser, user } = useContext(ChatContext);  useEffect(() => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userInfo") || "null");
      setUser(userData);
      if (!userData) {
        navigate("/");
      }
    } catch (error) {
      // Handle JSON parse error
      console.error("Error parsing user data from session storage", error);
      navigate("/");
    }
  }, [navigate, setUser]);

  // eslint-disable-next-line no-prototype-builtins
  if (!user || !user._id) return <></>;

  return <>{children ? children : <Outlet />}</>;
}

export default ProtectedRoute;
