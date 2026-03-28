// src/pages/reports/ReportingAnalytics.jsx
import React from "react";
import MainLayout from "../../layout/MainLayout";
import { FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// ✅ Local LOS-style FeatureCard (same as other modules)
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

    {/* Text */}
    <h3 className="text-gray-800 text-[15px] font-medium">{title}</h3>
  </div>
);

// 🔹 Clean icon config (no colors)
const reports = [
  {
    title: "Download Daily Disbursement Report",
    icon: <FiDownload />,
    link: "/reports/daily-disbursement",
  },
  {
    title: "Download Branch Performance Report",
    icon: <FiDownload />,
    link: "/reports/branch-performance",
  },
  {
    title: "Download Loan Approval vs Rejection Report",
    icon: <FiDownload />,
    link: "/reports/loan-approval-rejection",
  },
  {
    title: "Download NPA Report",
    icon: <FiDownload />,
    link: "/reports/npa-report",
  },
  {
    title: "Download Revenue Report",
    icon: <FiDownload />,
    link: "/reports/revenue-report",
  },
  {
    title: "Download User Activity Report",
    icon: <FiDownload />,
    link: "/reports/user-activity-report",
  },
];

const ReportingAnalytics = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Reporting & Analytics
        </h1>
        <p className="text-gray-500 text-sm">
          Download analytical reports for monitoring business performance.
        </p>
      </div>

      {/* CARD GRID */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((r, i) => (
            <FeatureCard
              key={i}
              title={r.title}
              icon={r.icon}
              onClick={() => navigate(r.link)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportingAnalytics;
