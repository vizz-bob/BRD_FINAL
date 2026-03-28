import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

// --- Page Imports ---
// Auth
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import ProfilePage from "./pages/auth/ProfilePage.jsx";

import AllUsersPage from "./pages/auth/AllUsersPage.jsx";

// Dashboard root pages (index pages for each department)

import ValuationDashboard from "./pages/valuation/ValuationDashboard.jsx";

// Department subpages

import FieldVerifications from "./pages/valuation/FieldVerifications.jsx";
import PropertyChecks from "./pages/valuation/PropertyChecks.jsx";
import ValuationDetails from "./pages/valuation/ValuationDetails.jsx";

// Layout
import DepartmentLayout from "./components/DepartmentLayout.jsx";

// ProtectedRoute Component
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />; // Or to an unauthorized page
  }

  return <Outlet />;
};

// --- Router Configuration ---
const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/all-users", element: <AllUsersPage /> },

  // Valuation routes
  {
    element: <ProtectedRoute allowedRoles={["valuation"]} />,
    children: [
      {
        path: "/valuation",
        element: <DepartmentLayout />,
        children: [
          { index: true, path:"dashboard", element: <ValuationDashboard /> },
          { path: "field-verifications", element: <FieldVerifications /> },
          { path: "property-checks", element: <PropertyChecks /> },
          { path: ":id", element: <ValuationDetails /> },
        ],
      },
    ],
  },

  // Profile route
  {
    element: (
      <ProtectedRoute
        allowedRoles={[
          "valuation",
        ]}
      />
    ),
    children: [
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },

  // Catch-all
  { path: "*", element: <Navigate to="/login" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
