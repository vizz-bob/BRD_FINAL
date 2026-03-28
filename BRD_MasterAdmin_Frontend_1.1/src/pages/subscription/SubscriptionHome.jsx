import React from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiList,
  FiPlus,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Reusable feature tile
const FeatureCard = ({ title, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 
               cursor-pointer hover:shadow-md transition"
  >
    <div className="w-14 h-14 bg-gray-100 border border-gray-300 rounded-xl flex items-center justify-center">
      {React.cloneElement(icon, {
        className: "text-gray-700 text-xl",
        strokeWidth: 1.5,
      })}
    </div>

    <h3 className="text-gray-800 text-[15px] font-medium">{title}</h3>
  </div>
);

// Subscription Dashboard Features
const subscriptionFeatures = [
  {
    title: "Subscription List",
    icon: <FiList />,
    link: "/subscriptions/list",
  },
  {
    title: "Add New Subscription",
    icon: <FiPlus />,
    link: "/subscriptions/add",
  },
  {
    title: "Coupons",
    icon: <FiTag />,
    link: "/coupons",
  },
  {
    title: "Subscribers",
    icon: <FiUsers />,
    link: "/subscribers",
  },
];

const SubscriptionHome = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Subscription Management</h1>
        <p className="text-gray-500 text-sm">
          Manage subscriptions, coupons, and subscriber details.
        </p>
      </div>

      {/* GRID PANEL */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subscriptionFeatures.map((item, index) => (
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

export default SubscriptionHome;
