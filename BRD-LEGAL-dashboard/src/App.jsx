import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import GlobalMessageDisplay from "./components/GlobalMessageDisplay.jsx";

// --- Page Imports ---
// Auth
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import ProfilePage from "./pages/auth/ProfilePage.jsx";

import AllUsersPage from "./pages/auth/AllUsersPage.jsx";

// Dashboard root pages (index pages for each department)
import LegalDashboard from "./pages/dashboard/LegalDashboard.jsx";

// Department subpages
import DocumentValidation from "./pages/legal/DocumentValidation.jsx";
import AgreementApprovals from "./pages/legal/AgreementApprovals.jsx";
import NewReviewForm from "./pages/legal/NewReviewForm.jsx";
import DocumentDetails from "./pages/legal/DocumentDetails.jsx";
import AgreementReview from "./pages/legal/AgreementReview.jsx";
import AgreementDetails from "./pages/legal/AgreementDetails.jsx";

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


  // Legal routes
  {
    element: <ProtectedRoute allowedRoles={["legal"]} />,
    children: [
      {
        path: "/legal",
        element: <DepartmentLayout />,
        children: [
          { index: true, element: <LegalDashboard /> },
          { path: "documents", element: <DocumentValidation /> },
          { path: "documents/:id", element: <DocumentDetails /> },
          { path: "agreements", element: <AgreementApprovals /> },
          { path: "agreements/review/:id", element: <AgreementReview /> },
          { path: "agreements/:id", element: <AgreementDetails /> },
          { path: "new-review", element: <NewReviewForm /> },
        ],
      },
    ],
  },

  // Profile route
  {
    element: (
      <ProtectedRoute
        allowedRoles={[
          "legal",
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
  return (
    <>
      <GlobalMessageDisplay />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
