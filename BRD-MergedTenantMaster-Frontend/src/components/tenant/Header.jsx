import { useEffect, useState, useRef } from "react";
import {
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

export default function Header({ onRefresh, onExportReport }) {
  const [avatar, setAvatar] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [user, setUser] = useState({
    name: "Admin User",
    email: "admin@example.com",
    role: "Tenant Administrator",
  });

  useEffect(() => {
    const load = () => {
      try {
        setAvatar(localStorage.getItem("profile_avatar") || null);
        const userData = localStorage.getItem("user_data");
        if (userData) setUser(JSON.parse(userData));
      } catch {}
    };

    load();
    loadNotifications();

    const h = () => load();
    window.addEventListener("profile-avatar-updated", h);
    window.addEventListener("storage", h);

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target))
        setShowProfile(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("profile-avatar-updated", h);
      window.removeEventListener("storage", h);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadNotifications = () => {
    const mockNotifications = [
      { id: 1, title: "New loan application", message: "John Doe submitted a new loan application", time: "5 minutes ago", read: false },
      { id: 2, title: "Document pending", message: "Upload pending documents for loan #12345", time: "1 hour ago", read: false },
      { id: 3, title: "System update", message: "System will be updated on Sunday at 2 AM", time: "1 day ago", read: true },
    ];
    setNotifications(mockNotifications);
    setNotificationCount(mockNotifications.filter((n) => !n.read).length);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (onRefresh) await onRefresh();
      loadNotifications();
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportReport = async () => {
    setExporting(true);
    try {
      if (onExportReport) await onExportReport();
    } finally {
      setExporting(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setNotificationCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setNotificationCount(0);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    window.location.href = "/login";
  };

  const navigateToSettings = (tab) => {
    localStorage.setItem("settings_active_tab", tab);
    window.dispatchEvent(new CustomEvent("navigate", { detail: "settings" }));
  };

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <header
      className={[
        "fixed z-30 bg-white border-b border-gray-200",
        "right-0 left-0",            // full width on mobile (sidebar is off-canvas)
        "lg:left-64",                 // on desktop, start after the sidebar (w-64)
        "top-14 h-14",               // on mobile: sit below Sidebar's topbar (h-14), same height
        "lg:top-0 lg:h-16",          // on desktop: sit at very top, taller
      ].join(" ")}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">

        {/* Left — Title */}
        <div className="flex flex-col min-w-0">
          <h1 className="font-semibold text-sm lg:text-lg truncate">
            Tenant Admin Dashboard
          </h1>
          <p className="text-xs text-gray-500 hidden lg:block">
            Multi-Tenant LOS Platform Overview
          </p>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2 lg:gap-3">

          {/* Export — icon only on mobile */}
          <button
            onClick={handleExportReport}
            disabled={exporting}
            className="h-8 lg:h-9 px-2.5 lg:px-4 rounded-full border border-gray-200 bg-white text-gray-700 flex items-center gap-1.5 lg:gap-2 hover:bg-gray-50 disabled:opacity-60 transition-colors text-sm"
            title="Export Report"
          >
            <DocumentArrowDownIcon className="h-4 w-4 flex-shrink-0" />
            <span className="hidden lg:inline">
              {exporting ? "Exporting..." : "Export"}
            </span>
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8 lg:h-9 px-3 lg:px-4 rounded-full bg-primary-600 text-white flex items-center gap-1.5 lg:gap-2 hover:bg-primary-700 disabled:opacity-60 transition-colors text-sm"
          >
            {refreshing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="hidden lg:inline">Refreshing...</span>
              </>
            ) : (
              <>
                <span className="hidden lg:inline">Refresh</span>
                <svg className="lg:hidden h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </>
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => { setShowNotifications((p) => !p); setShowProfile(false); }}
              className="relative h-8 w-8 lg:h-9 lg:w-9 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="Notifications"
            >
              <BellIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 lg:w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-semibold text-sm">Notifications</span>
                  {notificationCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-primary-600 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />}
                        <div className={!n.read ? "" : "ml-4"}>
                          <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile((p) => !p); setShowNotifications(false); }}
              className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-primary-600 text-white flex items-center justify-center overflow-hidden hover:bg-primary-700 transition-colors text-sm font-medium"
              title="Profile"
            >
              {avatar
                ? <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                : initials}
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 lg:w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-600 text-white flex items-center justify-center overflow-hidden flex-shrink-0 font-medium">
                      {avatar ? <img src={avatar} alt="avatar" className="h-full w-full object-cover" /> : initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      <div className="text-[10px] text-primary-600 font-medium mt-0.5">{user.role}</div>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { setShowProfile(false); navigateToSettings("profile"); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-gray-400" /> My Profile
                  </button>
                  <button
                    onClick={() => { setShowProfile(false); navigateToSettings("settings"); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Cog6ToothIcon className="h-4 w-4 text-gray-400" /> Settings
                  </button>
                  <button
                    onClick={() => { setShowProfile(false); handleLogout(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
