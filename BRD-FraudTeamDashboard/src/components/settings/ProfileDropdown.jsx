import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineLogout,
  HiOutlineUserCircle,
  HiOutlineCog
} from "react-icons/hi";

export default function ProfileDropdown({ user, onLogout, onEditProfile }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md"
      >
        {initials}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-44 sm:w-48 bg-white rounded-lg shadow-xl py-1 z-50">

          {/* Profile */}
          <button
            onClick={() => {
              setOpen(false);
              onEditProfile();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <HiOutlineUserCircle className="text-xl text-gray-600 flex-shrink-0" />
            <span className="font-medium">Profile</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <HiOutlineCog className="text-xl text-gray-600 flex-shrink-0" />
            <span className="font-medium">Settings</span>
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-gray-100"></div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <HiOutlineLogout className="text-xl flex-shrink-0" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}