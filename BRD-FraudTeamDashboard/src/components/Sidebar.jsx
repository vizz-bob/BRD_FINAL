import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import {
  HomeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApi.logout();
    navigate("/login");
  };

  const menu = [
    { name: "Home", icon: HomeIcon, path: "/home" },
    { name: "Cases", icon: ClipboardDocumentListIcon, path: "/cases" },
    { name: "Reports", icon: DocumentTextIcon, path: "/reports" },
    { name: "Analytics", icon: ChartBarIcon, path: "/analytics" },
    { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
  ];

  return (
    <>
      {/* Backdrop — mobile only */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64 flex flex-col
          bg-white border-r border-gray-200
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shrink-0">
              <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                Fraud Dashboard
              </h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>

          {/* Mobile close button */}
          {open && (
            <button
              onClick={() => setOpen(false)}
              className="md:hidden text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition shrink-0 ml-1"
            >
              <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-0.5 sm:space-y-1 overflow-y-auto">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => open && setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100 font-normal"
                }`
              }
            >
              <item.icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="px-3 sm:px-4 pb-4 sm:pb-6 border-t border-gray-200 pt-3 sm:pt-4 shrink-0">
          <button
            onClick={() => {
              open && setOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-red-600 hover:bg-red-50 rounded-lg text-sm font-normal transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}