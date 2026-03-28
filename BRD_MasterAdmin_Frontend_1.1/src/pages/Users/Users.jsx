// src/pages/users/Users.jsx

import React from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiUserPlus,
 
  FiList,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// ★ FeatureCard with SIDEBAR-MATCH icon styling
const FeatureCard = ({ title, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 
               cursor-pointer hover:shadow-md transition"
  >
    <div className="w-14 h-14 bg-gray-100 border border-gray-300 rounded-xl flex items-center justify-center">
      {React.cloneElement(icon, {
        className: "text-gray-700 text-xl", // SAME AS SIDEBAR
        strokeWidth: 1.5,                    // SAME THICKNESS
      })}
    </div>

    <h3 className="text-gray-800 text-[15px] font-medium">{title}</h3>
  </div>
);

// Icons (no colors)
const userFeatures = [
  { title: "User List", icon: <FiList />, link: "/users/list" },
  { title: "Add New User", icon: <FiUserPlus />, link: "/users/add" },
,
];

const Users = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm">
          Manage system users, permissions, login activity & security.
        </p>
      </div>

      {/* FEATURE PANEL */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userFeatures.map((item, index) => (
            <FeatureCard
              key={index}
              title={item.title}
              icon={item.icon}
              onClick={() => navigate(item.link)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Users;
