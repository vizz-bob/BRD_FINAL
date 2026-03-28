import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function RequireMasterAdmin({ children }) {
  const token = localStorage.getItem("access_token");

  // 1️⃣ No token → not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);


    // 2️⃣ Token expired → force logout
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }


    // 4️⃣ All good
    return children;

  } catch (err) {
    // 5️⃣ Invalid token → logout
    console.error("JWT decode failed", err);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
}
