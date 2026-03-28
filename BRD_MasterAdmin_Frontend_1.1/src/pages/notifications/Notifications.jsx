import React from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiMessageCircle,
  FiMail,
  FiSend,
  FiRepeat,
  FiAlertTriangle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// ★ Sidebar-style FeatureCard (LOS THEME)
const FeatureCard = ({ title, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 
               cursor-pointer hover:shadow-md transition"
  >
    {/* Icon Box */}
    <div className="w-14 h-14 bg-gray-100 border border-gray-300 rounded-xl flex items-center justify-center">
      {React.cloneElement(icon, {
        className: "text-gray-700 text-[22px]",
        strokeWidth: 1.5,
      })}
    </div>

    <h3 className="text-gray-800 text-[15px] font-medium">{title}</h3>
  </div>
);

// Cleaned icon list (NO COLORS)
const notificationLinks = [
  {
    title: "Define SMS Templates",
    icon: <FiMessageCircle />,
    link: "/notifications/sms-templates",
  },
  {
    title: "Define Email Templates",
    icon: <FiMail />,
    link: "/notifications/email-templates",
  },
  {
    title: "Set Push Notification Rules",
    icon: <FiSend />,
    link: "/notifications/push-rules",
  },
  {
    title: "Configure EMI Reminders",
    icon: <FiRepeat />,
    link: "/notifications/emi-reminders",
  },
  {
    title: "Set Overdue Alerts",
    icon: <FiAlertTriangle />,
    link: "/notifications/overdue-alerts",
  },
];

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Notifications & Templates
        </h1>
        <p className="text-gray-500 text-sm">
          Manage SMS / Email / Push notifications, EMI reminders & overdue alerts.
        </p>
      </div>

      {/* GRID PANEL */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notificationLinks.map((item, index) => (
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

export default Notifications;
