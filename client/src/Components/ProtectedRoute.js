import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const email = useSelector((state) => state.users.user?.email);

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;