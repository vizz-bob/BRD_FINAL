import React from "react";
import MainLayout from "../layout/MainLayout";

import ActiveUserChart from "../components/ActiveUserChart";
import LoanTrendChart from "../components/LoanTrendChart";
import useDashboard from "../hooks/useDashboard";
import { dashboardService } from "../services/dashboardService";

import {
  FiUsers,
  FiHome,
  FiGitBranch,
  FiActivity,
  FiTrendingUp,
  FiDatabase,
  FiAlertTriangle,
  FiClipboard
} from "react-icons/fi";

const Dashboard = () => {
  const { data: cards, loading: loadingCards } = useDashboard(dashboardService.getSummaryCards, []);
  const { data: loanTrendData } = useDashboard(dashboardService.getLoanTrends, []);
  const { data: usersPerBranch } = useDashboard(dashboardService.getUsersPerBranch, []);
  const { data: activities } = useDashboard(dashboardService.getActivities, []);
  const { data: alerts } = useDashboard(dashboardService.getAlerts, []);

  if (loadingCards) {
    return (
      <MainLayout>
        <div className="p-10 text-gray-600">Loading dashboard...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card icon={<FiHome />} title="Total Organizations" value={cards.totalOrganizations} />
        <Card icon={<FiGitBranch />} title="Total Branches" value={cards.totalBranches} />
        <Card icon={<FiUsers />} title="Active Users" value={cards.activeUsers} />
        {/* <Card icon={<FiActivity />} title="Active & Pending Loans" value={cards.activeLoans} /> */}
        <Card icon={<FiTrendingUp />} title="Daily Disbursement" value={cards.dailyDisbursement} />
        {/* <Card icon={<FiDatabase />} title="API Status" value={cards.apiStatus} />
        <Card icon={<FiClipboard />} title="Recent Activities" value="View Logs →" />
        <Card icon={<FiAlertTriangle />} title="Alerts" value={`${cards.alerts} Critical`} /> */}
      </div>

      {/* CHARTS */}
      <div className="flex flex-col gap-8 mb-10">
        <ActiveUserChart usersPerBranch={usersPerBranch} />
        <LoanTrendChart data={loanTrendData} />
      </div>
   
    </MainLayout>
  );
};

// -----------------------
// CARD COMPONENT
// -----------------------
const Card = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-2xl shadow-sm">
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
