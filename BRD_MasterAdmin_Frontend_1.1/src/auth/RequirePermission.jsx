import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequirePermission({ permission, children }) {
  const { isAuthenticated, permissions } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !permissions.includes(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
