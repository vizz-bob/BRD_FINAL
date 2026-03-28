import React from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiUserCheck,
  FiShield,
  FiCheckSquare,
  FiList,
  FiPenTool, // ✅ New Icon
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ title, subtitle, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 cursor-pointer hover:shadow-md transition"
  >
    <div className="w-14 h-14 bg-gray-100 border border-gray-300 rounded-xl flex items-center justify-center">
      {React.cloneElement(icon, {
        className: "text-gray-700 text-[22px]",
        strokeWidth: 1.5,
      })}
    </div>
    <div>
      <h3 className="text-gray-800 text-[15px] font-semibold">{title}</h3>
      {subtitle && (
        <p className="text-gray-500 text-[13px] mt-1 leading-[1.3]">{subtitle}</p>
      )}
    </div>
  </div>
);

const roleFeatures = [
  // ✅ NEW: View Role List Option
  {
    title: "View All Roles",
    icon: <FiList />,
    subtitle: "List of all created roles",
    link: "/roles/list",
  },
  {
    title: "Create Roles",
    icon: <FiUserCheck />,
    subtitle: "Define new system roles",
    link: "/roles/create",
  },
  {
    title: "Set Permissions for Roles",
    icon: <FiShield />,
    subtitle: "Configure access for each role",
    link: "/roles/set-permissions",
  },
  {
    title: "Create Permissions",
    icon: <FiPenTool />,
    subtitle: "Create Permissions for Roles",
    link: "/roles/add-permission",
  },
];

const Roles = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Role & Permission Management
        </h1>
        <p className="text-gray-500 text-sm">
          Create roles, configure system permissions, and manage access.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roleFeatures.map((item, index) => (
            <FeatureCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              onClick={() => navigate(item.link)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Roles;