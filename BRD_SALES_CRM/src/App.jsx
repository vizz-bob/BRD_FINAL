// src/App.jsx

import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import PipelinePage from "./pages/PipelinePage";
import ReportsPage from "./pages/ReportsPage";
import IncentivesPage from "./pages/IncentivesPage";
import ResourcesPage from "./pages/ResourcesPage";
import SettingsPage from "./pages/SettingsPage";

// Define quick filter labels here to pass them to the Layout component
const quickFilterLabels = {
  all: "All Leads",
  "my-leads": "My Leads",
  "team-leads": "Team Leads",
  "pending-docs": "Pending Docs",
  "payout-due": "Payout Due",
};

// A wrapper component to hold the layout and render child routes
function AppLayout({ activeFilter, setActiveFilter }) {
  return (
    <Layout
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      quickFilterLabels={quickFilterLabels}
    >
      {/* The Outlet will render the matched child route's element */}
      <Outlet />
    </Layout>
  );
}

function AppRoutes() {
  const { login, signIn } = useAuth();

  // 1. MOVE THE STATE HERE
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage onLogin={login} />} />
      <Route path="/signin" element={<SignInPage onSignIn={signIn} />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {/* 2. PASS THE STATE AS PROPS TO APP LAYOUT */}
            <AppLayout
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </ProtectedRoute>
        }
      >
        {/* Index route for the default page */}
        <Route index element={<HomePage />} />

        {/* 3. PASS activeFilter TO THE PIPELINE PAGE */}
        <Route
          path="pipeline"
          element={<PipelinePage activeFilter={activeFilter} />}
        />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="incentives" element={<IncentivesPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
