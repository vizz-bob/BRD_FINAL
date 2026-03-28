import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import { dashboardApi } from "../../../services/dashboardService";

export default function ThirdPartyVendorDashboardView() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [vendorInfo, setVendorInfo] = useState({ name: "", type: "" });
  const [stats, setStats] = useState({
    assignedCases: 0,
    completedToday: 0,
    pendingReports: 0,
    avgCompletionTime: 0,
  });
  const [assignedCases, setAssignedCases] = useState([]);

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.fetchVendorStats?.();
      if (res && res.data) {
        setVendorInfo(res.data.vendorInfo);
        setStats(res.data.stats);
        setAssignedCases(res.data.assignedCases);
      }
    } catch (err) {
      console.error("Failed to fetch vendor data", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "Overdue": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getVendorTypeLabel = (type) => {
    switch (type) {
      case "valuation": return "Valuation Agency";
      case "legal": return "Legal Vendor";
      case "verification": return "Verification Agency";
      default: return "Third Party Vendor";
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Vendor Workspace</h1>
          <p className="text-sm text-gray-500">
            {getVendorTypeLabel(vendorInfo.type)} Portal - Manage assigned cases and reports.
          </p>
        </div>
        <div className="text-sm text-gray-600 shrink-0">
          Welcome, <span className="font-bold text-gray-900">{vendorInfo.name}</span>
        </div>
      </div>

      {/* 1. VENDOR METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Assigned Cases</span>
            <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-500 shrink-0" />
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.assignedCases}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Completed Today</span>
            <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.completedToday}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Pending Reports</span>
            <DocumentArrowUpIcon className="w-5 h-5 text-yellow-500 shrink-0" />
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.pendingReports}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Avg. Completion</span>
            <ClockIcon className="w-5 h-5 text-indigo-500 shrink-0" />
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.avgCompletionTime}d</div>
        </div>
      </div>

      {/* 2. ASSIGNED CASES TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-700 text-sm md:text-base">Assigned Cases</h3>
          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap">Your Queue Only</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="text-xs font-bold text-gray-400 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-4 md:px-6 py-3">Case ID</th>
                <th className="px-4 md:px-6 py-3">Customer</th>
                <th className="px-4 md:px-6 py-3">Service Type</th>
                <th className="px-4 md:px-6 py-3">Due Date</th>
                <th className="px-4 md:px-6 py-3">Status</th>
                <th className="px-4 md:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {assignedCases && assignedCases.length > 0 ? (
                assignedCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 md:px-6 py-4 text-sm font-mono text-gray-500 whitespace-nowrap">{caseItem.caseId}</td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="font-bold text-gray-900">{caseItem.customerName}</div>
                      <div className="text-xs text-gray-500">{caseItem.loanType}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{caseItem.serviceType}</td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm text-gray-700 whitespace-nowrap">{formatDate(caseItem.dueDate)}</div>
                      {caseItem.isOverdue && (
                        <div className="text-xs text-red-500 font-medium">Overdue</div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium border whitespace-nowrap ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        {caseItem.status !== "Completed" && (
                          <button
                            onClick={() => navigate(`/vendor/cases/${caseItem.id}/upload`)}
                            className="text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-3 py-1.5 rounded transition whitespace-nowrap"
                          >
                            Upload Report
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/vendor/cases/${caseItem.id}`)}
                          className="text-gray-600 font-bold text-sm hover:bg-gray-50 px-3 py-1.5 rounded transition whitespace-nowrap"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 text-sm">
                    No cases assigned to you at this time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. RECENT ACTIVITY */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <DocumentTextIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <h3 className="font-bold text-gray-700">Recent Activity</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Report submitted for Case #VLN-2023-045</p>
              <p className="text-xs text-gray-500">Property valuation completed and uploaded. Awaiting review.</p>
              <p className="text-xs text-gray-400 mt-1">Today, 2:30 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <ClockIcon className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">New case assigned: Case #LGL-2023-112</p>
              <p className="text-xs text-gray-500">Legal verification required for loan application.</p>
              <p className="text-xs text-gray-400 mt-1">Yesterday, 4:15 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Reminder: Case #VER-2023-089 due in 2 days</p>
              <p className="text-xs text-gray-500">Employment verification pending. Please complete before due date.</p>
              <p className="text-xs text-gray-400 mt-1">2 days ago</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
