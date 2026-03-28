import React, { useState } from "react";
import {
  LayoutDashboard,
  MapPin,
  FileX,
  ShieldCheck,
  Menu,
  X,
  LogOut, // add this
} from "lucide-react";

const primary = {
  50: "#eff6ff",
  600: "#2563eb",
  700: "#1d4ed8",
};

const Sidebar = ({
  selectedView = "dashboard",
  onSelect = () => {},
  userEmail = "",
  onLogout = () => {}, // add this
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menu = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "siteVisits", label: "Site Visits", icon: MapPin },
    { key: "rejections", label: "Rejections", icon: FileX },
  ];

  const handleSelect = (key) => {
    onSelect(key);
    setMobileSidebarOpen(false);
  };

  const renderButton = (item) => {
    const isActive = selectedView === item.key;
    const Icon = item.icon;

    return (
      <button
        key={item.key}
        onClick={() => handleSelect(item.key)}
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
        <Icon size={20} style={{ color: isActive ? primary[600] : "black" }} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* ─── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30">
        <div className="h-16 flex items-center px-4 gap-3 border-b border-gray-100">
          <div
            className="h-9 w-9 rounded-xl grid place-items-center shrink-0"
            style={{ backgroundColor: primary[600], color: "white" }}
          >
            <ShieldCheck size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">BRD Portal</span>
            <span className="text-xs text-gray-400">Operations</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {menu.map((item) => renderButton(item))}
        </nav>

        <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
          v1.0 • Ops Dashboard
        </div>
      </aside>

      {/* ─── Mobile Top Header Bar ────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">

        {/* Left: Hamburger */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          style={{ color: primary[700] }}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition shrink-0"
        >
          <Menu size={22} />
        </button>

        {/* Center: Title */}
        <div className="flex flex-col items-center leading-tight text-center px-2">
          <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
            Operational Dashboard
          </span>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            Verification & KYC Management
          </span>
        </div>

        {/* Right: Logout Button (replaces avatar) */}
        <button
          onClick={onLogout}
          style={{ color: "#dc2626" }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition shrink-0 text-xs font-medium"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>

      {/* ─── Mobile Backdrop ──────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ─── Mobile Drawer ────────────────────────────────────── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 lg:hidden flex flex-col shadow-xl ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center px-4 gap-3 border-b border-gray-100">
          <div
            className="h-8 w-8 rounded-xl grid place-items-center shrink-0"
            style={{ backgroundColor: primary[600], color: "white" }}
          >
            <ShieldCheck size={16} />
          </div>
          <div className="flex-1 flex flex-col truncate">
            <span className="text-sm font-semibold truncate">BRD Portal</span>
            <span className="text-xs text-gray-400 truncate">Operations</span>
          </div>
          <button
            className="ml-2 text-gray-400 hover:text-black shrink-0 p-1 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {menu.map((item) => renderButton(item))}
        </nav>

        <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
          v1.0 • Ops Dashboard
        </div>
      </div>
    </>
  );
};

export default Sidebar;