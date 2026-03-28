import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";

const getInitials = (name) => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const Header = ({ setMobileSidebarOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
      {/* Left Section: Hamburger + Title & Subtitle */}
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <button
          className="lg:hidden h-9 w-9 grid place-items-center rounded-full bg-white border border-gray-200"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Bars3Icon className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex flex-col gap-1">
          <div className="font-semibold text-lg sm:text-xl text-gray-900">
            Legal Dashboard
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            Document and Agreement Management
          </div>
        </div>
      </div>

      {/* Right Section: User Info */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <div className="hidden sm:flex flex-col">
            <p className="text-gray-900 font-medium text-sm sm:text-base truncate max-w-[120px]">
              Welcome, {user?.name || "User"}
            </p>
          </div>

          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.name || "User"}
              className="h-9 w-9 rounded-full object-cover border-2 border-blue-600"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white grid place-items-center font-medium text-sm border-2 border-blue-600">
              {getInitials(user?.name)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;