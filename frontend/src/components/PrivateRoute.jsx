import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  // You can also check localStorage for a token if needed
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
