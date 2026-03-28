import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccessDeniedModal from "./AccessDeniedModal";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ArrowLeftStartOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const primary = {
  50: "#eff6ff",
  600: "#2563eb",
  700: "#1d4ed8",
};

const Sidebar = ({ mobileSidebarOpen, setMobileSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showAccessDeniedModal, setShowAccessDeniedModal] =
    React.useState(false);
  const location = useLocation();

  const items = [
    { key: "dashboard", label: "Dashboard", icon: HomeIcon, to: "/legal" },
    {
      key: "documents",
      label: "Document Validation",
      icon: DocumentTextIcon,
      to: "/legal/documents",
    },
    {
      key: "agreements",
      label: "Agreement Approvals",
      icon: ClipboardDocumentCheckIcon,
      to: "/legal/agreements",
    },
  ];

  const renderButton = (item) => {
    const isActive = location.pathname === item.to;
    return (
      <button
        key={item.key}
        onClick={() => (window.location.href = item.to)}
        style={{
          backgroundColor: isActive ? primary[50] : "white",
          color: isActive ? primary[700] : "black",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = primary[50];
            e.currentTarget.style.color = primary[700];
            const icon = e.currentTarget.querySelector("svg");
            if (icon) icon.style.color = primary[600];
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "black";
            const icon = e.currentTarget.querySelector("svg");
            if (icon) icon.style.color = "black";
          }
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-all"
      >
        <item.icon
          className="h-5 w-5"
          style={{ color: isActive ? primary[600] : "black" }}
        />
        <span>{item.label}</span>
      </button>
    );
  };

  const renderAllUsersButton = () => (
    <button
      onClick={() => setShowAccessDeniedModal(true)}
      style={{ backgroundColor: "white", color: "black" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = primary[50];
        e.currentTarget.style.color = primary[700];
        const icon = e.currentTarget.querySelector("svg");
        if (icon) icon.style.color = primary[600];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "white";
        e.currentTarget.style.color = "black";
        const icon = e.currentTarget.querySelector("svg");
        if (icon) icon.style.color = "black";
      }}
      className="w-full flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-all mt-4"
    >
      <UserGroupIcon className="h-5 w-5" style={{ color: "black" }} />
      All Users
    </button>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-4 gap-3 border-b border-gray-100">
          <div
            className="h-9 w-9 rounded-xl grid place-items-center"
            style={{ backgroundColor: primary[600], color: "white" }}
          >
            <ShieldCheckIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="text-base font-semibold">Legal Dashboard</div>
            <div className="text-xs" style={{ color: "#6b7280" }}>
              Legal Team Panel
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {items.map(renderButton)}

          <div
            className="mt-6 px-4 text-sm font-semibold uppercase tracking-wider"
            style={{ color: "#9ca3af" }}
          >
            Pages
          </div>

          {renderAllUsersButton()}
        </nav>

        <div className="p-2 border-t border-gray-100 mt-auto">
          <button
            onClick={logout}
            style={{ color: "#dc2626", backgroundColor: "white" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#fef2f2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
            className="w-full flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-all"
          >
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-white w-64 transform transition-transform duration-300 lg:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-xl grid place-items-center shrink-0"
            style={{ backgroundColor: primary[600], color: "white" }}
          >
            <ShieldCheckIcon className="h-4 w-4" />
          </div>

          <div className="flex-1 flex flex-col truncate">
            <span className="text-sm font-semibold truncate">Legal Dashboard</span>
            <span className="text-xs text-gray-500 truncate">
              Legal Team Panel
            </span>
          </div>

          <button
            className="ml-2 text-gray-500 hover:text-black shrink-0"
            onClick={() => setMobileSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="p-4">
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <button
                key={item.key}
                onClick={() => {
                  window.location.href = item.to;
                  setMobileSidebarOpen(false);
                }}
                style={{
                  backgroundColor: isActive ? primary[50] : "white",
                  color: isActive ? primary[700] : "black",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = primary[50];
                    e.currentTarget.style.color = primary[700];
                    const icon = e.currentTarget.querySelector("svg");
                    if (icon) icon.style.color = primary[600];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "black";
                    const icon = e.currentTarget.querySelector("svg");
                    if (icon) icon.style.color = "black";
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-all"
              >
                <item.icon
                  className="h-5 w-5"
                  style={{ color: isActive ? primary[600] : "black" }}
                />
                {item.label}
              </button>
            );
          })}

          {renderAllUsersButton()}
        </nav>

        <div className="p-2 border-t border-gray-100 mt-auto">
          <button
            onClick={logout}
            style={{ color: "#dc2626", backgroundColor: "white" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#fef2f2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
            className="w-full flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-all"
          >
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => setShowAccessDeniedModal(false)}
        message="You are not allowed in this domain"
      />
    </>
  );
};

export default Sidebar;
