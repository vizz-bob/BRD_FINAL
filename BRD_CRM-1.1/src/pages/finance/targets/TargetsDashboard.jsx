import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Target,
  Activity,
  TrendingUp,
  IndianRupee,
  BarChart3,
  History,
  AlertTriangle
} from "lucide-react";

import TargetOverview from "./TargetOverview";
import ActivityTargets from "./ActivityTargets";
import ConversionTargets from "./ConversionTargets";
import FinancialTargets from "./FinancialTargets";
import CampaignROI from "./CampaignROI";
import TargetHistory from "./TargetHistory";
import TargetAssignmentModal from "./TargetAssignmentModal";
import { useUserRole } from "../../../utils/useUserRole";
import { ActivityTargetService, ConversionTargetService, TargetService } from "../../../services/financeService";

const TargetsDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { role } = useUserRole();
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  const tabs = [
    { id: "overview", label: "Overview", icon: Target, path: "overview" },
    { id: "activity", label: "Activity Targets", icon: Activity, path: "activity" },
    { id: "conversion", label: "Conversion Targets", icon: TrendingUp, path: "conversion" },
    { id: "financial", label: "Financial Targets", icon: IndianRupee, path: "financial" },
    { id: "roi", label: "Campaign ROI", icon: BarChart3, path: "roi" },
    { id: "history", label: "History", icon: History, path: "history" }
  ];

  useEffect(() => {
    const last = location.pathname.split("/").pop();
    const valid = tabs.map(t => t.path);
    if (valid.includes(last)) setActiveTab(last);
  }, [location.pathname]);

  const stats = [
    {
      label: "Overall Achievement",
      value: "NA",
      icon: Target,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
      change: "Behind monthly pacing"
    },
    {
      label: "Revenue Target",
      value: "NA",
      icon: IndianRupee,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      change: "₹3.6Cr remaining"
    },
    {
      label: "Conversion Rate",
      value: "NA",
      icon: TrendingUp,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
      change: "Above last month"
    },
    {
      label: "Pacing Alert",
      value: "Behind",
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      change: "< 80% by day 20"
    }
  ];
  const handleAssignTarget = async (payload) => {
    const res = await TargetService.create(payload);

    if (res.status === 201) {
      const targetId = res.data.id;

      if (payload.target_type === "activity") {
        await ActivityTargetService.create({
          target: targetId,
          activity_type: payload.target_subtype,
          target_count: payload.target_value
        });
      }

      if (payload.target_type === "conversion") {
        await ConversionTargetService.create({
          target: targetId,
          stage_from: payload.stage_from,
          stage_to: payload.stage_to,
          target_rate: payload.target_rate,
          conversion_type: payload.target_subtype
        });
      }

      alert("Target assigned successfully!");
      setShowAssignModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Targets</h1>
                <p className="text-sm text-gray-500 font-semibold">
                  Define performance goals and monitor real-time progress across teams.
                </p>
              </div>
            </div>

            {role !== "EMPLOYEE" && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
              >
                Assign Target
              </button>
            )}
          </div>


          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >


                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-all ${isActive
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {activeTab === "overview" && <TargetOverview />}
          {activeTab === "activity" && <ActivityTargets />}
          {activeTab === "conversion" && <ConversionTargets />}
          {activeTab === "financial" && <FinancialTargets />}
          {activeTab === "roi" && <CampaignROI />}
          {activeTab === "history" && <TargetHistory />}
        </div>
      </div>
      <TargetAssignmentModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSubmit={(payload) => handleAssignTarget(payload)}
      />
    </div>
  );
};

export default TargetsDashboard;
