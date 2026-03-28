import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"; // 1. IMPORT Outlet
import { ChevronRight, Bell, LogOut, Settings, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/pipeline", label: "Pipeline" },
  { path: "/reports", label: "Reports" },
  { path: "/incentives", label: "Incentives" },
  { path: "/resources", label: "Resources" },
];

// 2. REMOVE 'children' FROM THE PROPS
export default function Layout({
  activeFilter,
  setActiveFilter,
  quickFilterLabels,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    logout,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      // Close mobile sidebar when clicking outside
      if (showMobileSidebar && !event.target.closest('.mobile-sidebar') && !event.target.closest('.hamburger-menu')) {
        setShowMobileSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileSidebar]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotificationClick = (id) => {
    markNotificationAsRead(id);
  };

  const handleNavClick = () => {
    setShowMobileSidebar(false);
  };

  const getPageInfo = () => {
    const routeInfo = {
      "/": {
        title: "Sales Team Dashboard",
        description: "Capture leads, monitor progress, track incentives.",
      },
      "/pipeline": {
        title: "Lead Pipeline",
        description:
          "Track leads through the complete journey from capture to disbursal.",
      },
      "/reports": {
        title: "Reports & Analytics",
        description: "Track KPIs, conversion trends, and performance metrics.",
      },
      "/incentives": {
        title: "Incentives & Commissions",
        description: "View your commission statements and incentive breakdown.",
      },
      "/resources": {
        title: "Resources & Training",
        description:
          "Access product guides, training materials, and support resources.",
      },
    };
    return (
      routeInfo[location.pathname] || { title: "Dashboard", description: "" }
    );
  };

  const pageInfo = getPageInfo();
  const activeFilterLabel = activeFilter
    ? quickFilterLabels[activeFilter]
    : "All leads";

  return (
    <div className="min-h-screen bg-brand-sand text-brand-navy relative overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
          aria-label="Close sidebar"
        />
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className={`mobile-sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white/95 border-r border-slate-100 transition-transform duration-300 lg:static lg:translate-x-0 lg:w-64 lg:min-h-screen ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="flex flex-col h-full">
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-between items-center px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-semibold">ST</div>
                <p className="text-sm font-semibold">Menu</p>
              </div>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <div className="hidden lg:flex px-6 py-6 items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-semibold">
                ST
              </div>
              <div>
                <p className="font-semibold">Xpertlend Sales</p>
                <p className="text-sm text-slate-500">
                  {user?.role || "Field Ops"}
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between pb-6">
              <nav className="px-4 text-slate-500 text-sm space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                        isActive
                          ? "bg-brand-blue/10 text-brand-blue font-semibold"
                          : "hover:text-brand-blue hover:bg-brand-blue/5"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  );
                })}
              </nav>
              <div className="px-4 mt-6 space-y-2">
                <Link
                  to="/settings"
                  onClick={handleNavClick}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-colors ${
                    location.pathname === "/settings"
                      ? "border-brand-blue text-brand-blue bg-brand-blue/5"
                      : "border-slate-200 text-slate-600 hover:border-brand-blue hover:text-brand-blue"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    handleNavClick();
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 pt-4 pb-6 space-y-6 lg:pt-6">
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button
              type="button"
              className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm"
              onClick={() => setShowMobileSidebar(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5 text-brand-blue" />
            </button>
            <p className="text-sm font-medium text-brand-navy">
              Dashboard / {pageInfo.title}
            </p>
            <div className="w-8" />
          </div>
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="hidden lg:block text-sm text-slate-500">
                Dashboard / {pageInfo.title}
              </p>
              <h1 className="text-2xl font-semibold text-brand-navy">
                {pageInfo.title}
              </h1>
              <p className="text-sm text-slate-500">{pageInfo.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 text-right">
              <div className="mr-0 sm:mr-2">
                <p className="text-[11px] uppercase tracking-widest text-slate-400">
                  Filter
                </p>
                <p className="text-xs text-slate-500">{activeFilterLabel}</p>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {Object.entries(quickFilterLabels).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() =>
                      setActiveFilter(activeFilter === id ? null : id)
                    }
                    className={`px-3 py-2 text-xs rounded-full border transition-colors ${
                      activeFilter === id
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-slate-200 text-slate-600 hover:border-brand-blue hover:text-brand-blue"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                {activeFilter && (
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="px-3 py-2 text-xs rounded-full border border-slate-200 text-slate-500 hover:border-slate-400"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative rounded-full bg-white p-2 border border-slate-200 hover:border-brand-blue transition-colors"
                >
                  <Bell className="h-5 w-5 text-brand-blue" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-emerald text-white text-xs flex items-center justify-center font-semibold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 max-h-96 overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-semibold text-brand-navy">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-brand-blue hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto max-h-80">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-500 text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() =>
                              handleNotificationClick(notification.id)
                            }
                            className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                              !notification.read ? "bg-brand-blue/5" : ""
                            }`}
                          >
                            <p className="text-sm text-brand-navy">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          {/* 3. REPLACE {children} WITH <Outlet /> */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
