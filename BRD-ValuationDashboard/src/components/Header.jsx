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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 lg:px-8 z-30 w-full">

      {/* Left Section: Hamburger (mobile only) + Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          className="lg:hidden h-9 w-9 grid place-items-center rounded-full bg-white border border-gray-200 shrink-0"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Bars3Icon className="h-5 w-5 text-gray-500" />
        </button>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-0 min-w-0">
          <div className="font-semibold text-base sm:text-lg lg:text-xl text-gray-900 truncate">
            Valuation Dashboard
          </div>
          <div className="hidden xs:block text-xs sm:text-sm text-gray-500 truncate">
            Property Valuation and Assessment Overview
          </div>
        </div>
      </div>

      {/* Right Section: User Info */}
      <div
        className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0 ml-2"
        onClick={() => navigate("/profile")}
      >
        {/* Name — hidden on small screens */}
        <div className="hidden sm:flex flex-col text-right">
          <p className="text-gray-900 font-medium text-sm sm:text-base leading-tight">
            Welcome, {user?.name || "User"}
          </p>
        </div>

        {/* Avatar */}
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user?.name || "User"}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border-2 border-blue-600 shrink-0"
          />
        ) : (
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-blue-600 text-white grid place-items-center font-medium text-xs sm:text-sm border-2 border-blue-600 shrink-0">
            {getInitials(user?.name)}
          </div>
        )}
      </div>

    </header>
  );
};

export default Header;