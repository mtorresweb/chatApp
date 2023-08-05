import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ChatContext } from "../Context/ChatProvider";

function ProtectedRoute({ children }) {
  let navigate = useNavigate();
  const { setUser, user } = useContext(ChatContext);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userInfo"));
    setUser(userData);
    if (!userData) {
      navigate("/");
    }
  }, []);

  if(!user) return <></>

  return <>{children ? children : <Outlet />}</>;
}

export default ProtectedRoute;
