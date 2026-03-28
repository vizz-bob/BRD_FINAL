import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Sidebar from "./components/Sidebar";
import Header from "./components/layout/Header";

import Home from "./pages/Home";
import Cases from "./pages/Cases";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import CaseDetails from "./pages/CaseDetails";

import ProtectedRoute from "./pages/ProtectedRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import SignUp from "./pages/SignUp";

import { HiMenu } from "react-icons/hi";

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Routes where sidebar + header should be hidden
  const hideSidebarRoutes = ["/login", "/forgot-password", "/signup", "/"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  // Page title logic
  const path = location.pathname;
  const pageTitle =
    path === "/home" ? "Dashboard" :
    path.startsWith("/cases/") ? "Case Details" :
    path === "/cases" ? "Cases" :
    path === "/analytics" ? "Analytics" :
    path === "/reports" ? "Reports" :
    path === "/settings" ? "Settings" :
    "";

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR (hidden on auth pages) */}
      {!hideSidebar && (
        <>
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={() => setSidebarOpen(false)}
              ></div>

              <div className="relative w-64 h-full bg-white shadow-xl z-50">
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden md:block md:w-64 bg-white shadow-lg">
            <Sidebar open={false} setOpen={setSidebarOpen} />
          </div>
        </>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        {!hideSidebar && <Header title={pageTitle} onOpenSidebar={() => setSidebarOpen(true)} />}

        {/* PAGE CONTENT */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <Routes>

            {/* SIGNUP = DEFAULT HOME PAGE */}
            <Route path="/" element={<SignUp />} />

            {/* AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<SignUp />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cases"
              element={
                <ProtectedRoute>
                  <Cases />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cases/:caseId"
              element={
                <ProtectedRoute>
                  <CaseDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}