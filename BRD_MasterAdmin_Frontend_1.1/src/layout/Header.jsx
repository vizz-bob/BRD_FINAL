import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenu }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("currentUser");
    setUser(u ? JSON.parse(u) : null);
  }, []);

  return (
    <div className="h-16 bg-white border-b sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">

      {/* Mobile menu */}
      <button onClick={onMenu} className="md:hidden text-2xl text-gray-700">
        <FiMenu />
      </button>

      <h1 className="text-lg md:text-xl font-semibold">Xpertland.Ai</h1>

      <div onClick={() => navigate("/profile")} className="flex items-center gap-3 cursor-pointer">
        <span className="hidden sm:block text-sm font-medium">{user?.first_name || "User"}</span>

        {user?.avatar ? (
          <img src={user.avatar} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            {(user?.first_name || "U")[0]}
          </div>
        )}
      </div>
    </div>
  );
}
