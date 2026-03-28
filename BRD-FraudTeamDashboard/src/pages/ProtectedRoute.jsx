import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check if we have an access token stored
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}