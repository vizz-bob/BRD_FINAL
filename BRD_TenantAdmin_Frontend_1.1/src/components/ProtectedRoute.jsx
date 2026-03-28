import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ requiredPermission }) {
  const { user, can } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !can(requiredPermission)) {
    // Logged in but unauthorized
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-4">Access Denied</h2>
        <p className="text-gray-500 max-w-md">
          You do not have permission to view this module. Please contact your system administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  // Authorized
  return <Outlet />;
}