import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ScheduleVerificationModal from "../../components/ScheduleVerificationModal";
import AssignAgentModal from "../../components/AssignAgentModal";
import StartVisitModal from "../../components/StartVisitModal";
import ViewReportModal from "../../components/ViewReportModal";

import {
  UsersIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

import { getFieldVerifications } from "../../service/service";

// ── Defined at MODULE scope so it's always available before component runs ──
const normalizeStatus = (s) => s?.toLowerCase().replace(/_/g, " ").trim();

// ── Badges defined outside component to avoid re-creation on each render ──
const StatusBadge = ({ status }) => {
  const label = status
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const normalized = normalizeStatus(status);
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        normalized === "completed"
          ? "bg-green-100 text-green-800"
          : normalized === "in progress"
          ? "bg-blue-100 text-blue-800"
          : normalized === "scheduled"
          ? "bg-purple-100 text-purple-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {label}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const normalized = priority?.toLowerCase();
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        normalized === "high"
          ? "bg-red-100 text-red-800"
          : normalized === "medium"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-green-100 text-green-800"
      }`}
    >
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const FieldVerifications = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStartVisitModalOpen, setIsStartVisitModalOpen] = useState(false);
  const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false);
  const [selectedVerificationId, setSelectedVerificationId] = useState(null);

  // ── Load API Data ──
  const loadVerifications = async () => {
    try {
      setLoading(true);
      const response = await getFieldVerifications();
      setVerifications(response.data);
    } catch (error) {
      console.error("Error fetching field verifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  // ── Stats ──
  const total = verifications.length;
  const pending = verifications.filter(
    (v) => normalizeStatus(v.status) === "pending"
  ).length;
  const inProgress = verifications.filter(
    (v) => normalizeStatus(v.status) === "in progress"
  ).length;
  const completed = verifications.filter(
    (v) => normalizeStatus(v.status) === "completed"
  ).length;

  const statsItems = [
    {
      title: "Total",
      mainValue: total,
      subText: "All verifications",
      icon: ClipboardDocumentCheckIcon,
      trendValue: 0,
      trendType: "up",
    },
    {
      title: "Pending",
      mainValue: pending,
      subText: "Awaiting action",
      icon: ClockIcon,
      trendValue: 0,
      trendType: "up",
    },
    {
      title: "In Progress",
      mainValue: inProgress,
      subText: "Visits ongoing",
      icon: ArrowTrendingUpIcon,
      trendValue: 0,
      trendType: "up",
    },
    {
      title: "Completed",
      mainValue: completed,
      subText: "Successfully verified",
      icon: UsersIcon,
      trendValue: 0,
      trendType: "up",
    },
  ];

  // ── Filter + Search ──
  const filtered = verifications.filter((v) => {
    if (
      filter !== "all" &&
      normalizeStatus(v.status) !== normalizeStatus(filter)
    )
      return false;
    if (
      searchQuery &&
      !v.property_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !v.field_id?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !v.address?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // ── Action Handlers ──
  const handleSchedule = (id) => {
    setSelectedVerificationId(id);
    setIsScheduleModalOpen(true);
  };
  const handleReassign = (id) => {
    setSelectedVerificationId(id);
    setIsAssignModalOpen(true);
  };
  const handleStartVisit = (id) => {
    setSelectedVerificationId(id);
    setIsStartVisitModalOpen(true);
  };
  const handleViewReport = (id) => {
    setSelectedVerificationId(id);
    setIsViewReportModalOpen(true);
  };

  // ── Action Buttons Helper ──
  const ActionButtons = ({ v, mobile = false }) => {
    const ns = normalizeStatus(v.status);
    if (mobile) {
      return (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {ns === "pending" && (
            <>
              <button
                onClick={() => handleSchedule(v.id)}
                className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition"
              >
                Schedule
              </button>
              <button
                onClick={() => handleReassign(v.id)}
                className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition"
              >
                Reassign
              </button>
            </>
          )}
          {(ns === "scheduled" || ns === "in progress") && (
            <button
              onClick={() => handleStartVisit(v.id)}
              className="px-3 py-1 text-xs font-medium text-green-600 border border-green-300 rounded-full hover:bg-green-50 transition"
            >
              Start Visit
            </button>
          )}
          {ns === "completed" && (
            <button
              onClick={() => handleViewReport(v.id)}
              className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition"
            >
              View Report
            </button>
          )}
        </div>
      );
    }

    return (
      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
        {ns === "pending" && (
          <>
            <button
              onClick={() => handleSchedule(v.id)}
              className="text-blue-600 hover:text-blue-900 mr-3"
            >
              Schedule
            </button>
            <button
              onClick={() => handleReassign(v.id)}
              className="text-gray-600 hover:text-gray-900"
            >
              Reassign
            </button>
          </>
        )}
        {(ns === "scheduled" || ns === "in progress") && (
          <button
            onClick={() => handleStartVisit(v.id)}
            className="text-green-600 hover:text-green-900"
          >
            Start Visit
          </button>
        )}
        {ns === "completed" && (
          <button
            onClick={() => handleViewReport(v.id)}
            className="text-blue-600 hover:text-blue-900"
          >
            View Report
          </button>
        )}
      </td>
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg">
        Loading field verifications...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
            Field Verifications
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Track and manage property field verifications
          </p>
        </div>
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Schedule Verification
          </button>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Assign Agent
          </button>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 flex flex-col gap-1"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <span
                className={`text-xs font-semibold ${
                  item.trendType === "up" ? "text-green-600" : "text-red-500"
                }`}
              >
                {item.trendType === "up" ? "↑" : "↓"} {item.trendValue}%
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {item.mainValue}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">
              {item.title}
            </p>
            <p className="text-xs text-gray-400 leading-tight">{item.subText}</p>
          </div>
        ))}
      </div>

      {/* ── Filters + Table ── */}
      <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md">

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Status:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search property or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
        </div>

        {/* Table wrapper */}
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold">
              Field Verifications
            </h3>
          </div>

          {/* ── Desktop Table ── */}
          <div className="overflow-x-auto hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "ID",
                    "Property",
                    "Address",
                    "Owner",
                    "Date",
                    "Status",
                    "Agent",
                    "Priority",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {v.id}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {v.property_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {v.address}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {v.owner}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {v.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {v.agent}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <PriorityBadge priority={v.priority} />
                    </td>
                    <ActionButtons v={v} />
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No verifications match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Cards ── */}
          <div className="sm:hidden p-3 space-y-3">
            {filtered.length > 0 ? (
              filtered.map((v) => (
                <div
                  key={v.id}
                  className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-semibold text-gray-900 text-sm leading-tight">
                      {v.property_name}
                    </span>
                    <StatusBadge status={v.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-gray-600">ID: </span>
                      {v.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-gray-600">Date: </span>
                      {v.date}
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-gray-600">Owner: </span>
                      {v.owner}
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-gray-600">Agent: </span>
                      {v.agent}
                    </p>
                    <p className="text-xs text-gray-500 col-span-2">
                      <span className="font-medium text-gray-600">Address: </span>
                      {v.address}
                    </p>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <span className="text-xs font-medium text-gray-600">
                        Priority:
                      </span>
                      <PriorityBadge priority={v.priority} />
                    </div>
                  </div>
                  <ActionButtons v={v} mobile />
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-6">
                No verifications match your filters.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Agent Guidelines ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">
          Field Verification Guidelines
        </h3>
        <ul className="space-y-1.5">
          {[
            "Always carry proper identification and authorization",
            "Take photographs of all key property aspects",
            "Verify property dimensions and boundaries",
            "Document any discrepancies or damages",
            "Get owner/occupant signature on verification form",
          ].map((g, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs sm:text-sm text-blue-800"
            >
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Modals ── */}
      <ScheduleVerificationModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSuccess={loadVerifications}
        verificationId={selectedVerificationId}
      />
      <AssignAgentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={loadVerifications}
        verificationId={selectedVerificationId}
      />
      <StartVisitModal
        isOpen={isStartVisitModalOpen}
        onClose={() => setIsStartVisitModalOpen(false)}
        verificationId={selectedVerificationId}
      />
      <ViewReportModal
        isOpen={isViewReportModalOpen}
        onClose={() => setIsViewReportModalOpen(false)}
        verificationId={selectedVerificationId}
      />
    </div>
  );
};

export default FieldVerifications;
