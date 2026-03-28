import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart } from "../../components/Charts";
import BulkAssignModal from "../../components/BulkAssignModal";
import NewAgreementModal from "../../components/NewAgreementModal";
import { useMessage } from "../../context/MessageContext";
import {
  DocumentTextIcon,
  ClockIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  fetchAgreements,
  fetchDashboardStats,
  approveAgreement,
  rejectAgreement,
  bulkAssignAgreements,
  createAgreement,
} from "../../api/agreementApi";

const StatusBadge = ({ status }) => (
  <span
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      status === "Approved"
        ? "bg-green-100 text-green-800"
        : status === "Rejected"
        ? "bg-red-100 text-red-800"
        : status === "Under Review"
        ? "bg-blue-100 text-blue-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {status}
  </span>
);

const PriorityBadge = ({ priority }) => (
  <span
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      priority === "High"
        ? "bg-red-100 text-red-800"
        : priority === "Medium"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-green-100 text-green-800"
    }`}
  >
    {priority}
  </span>
);

const AgreementApprovals = () => {
  const navigate = useNavigate();
  const { addMessage } = useMessage();

  // States
  const [agreements, setAgreements] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [isNewAgreementModalOpen, setIsNewAgreementModalOpen] = useState(false);

  // ── Fetch agreements and stats on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [agreementsData, statsData] = await Promise.all([
        fetchAgreements(),
        fetchDashboardStats(),
      ]);

      // Transform backend data to match frontend format
      const transformedAgreements = agreementsData.map((agr) => ({
        id: agr.id,
        agreement_id: agr.agreement_id,
        type: agr.agreement_type,
        client: agr.client_name,
        amount: `₹${agr.amount}`,
        submittedDate: agr.submitted_date,
        priority: agr.priority,
        status: agr.status,
        assignedTo: agr.assigned_to,
        // Keep backend fields for API calls
        ...agr,
      }));

      setAgreements(transformedAgreements);
      setDashboardStats(statsData);
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load agreements. Please try again.");
      addMessage("Error loading agreements", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNewAgreement = () => setIsNewAgreementModalOpen(true);
  const handleCloseNewAgreementModal = () => setIsNewAgreementModalOpen(false);

  const handleSaveNewAgreement = async (newAgreement) => {
    try {
      const agreementPayload = {
        agreement_id: newAgreement.agreement_id,
        agreement_type: newAgreement.agreement_type,
        client_name: newAgreement.client_name,
        amount: parseFloat(newAgreement.amount),
        priority: newAgreement.priority,
        assigned_to: newAgreement.assigned_to,
        status: newAgreement.status || "Pending",
      };

      await createAgreement(agreementPayload);
      addMessage(
        `New agreement ${newAgreement.agreement_id} created successfully!`,
        "success"
      );
      loadData(); // Reload data to show the new agreement
      handleCloseNewAgreementModal();
    } catch (err) {
      console.error("Error creating agreement:", err);
      console.error("Error details:", err.response?.data);
      addMessage(
        `Failed to create agreement: ${err.response?.data?.detail || err.message}`,
        "error"
      );
    }
  };

  const handleBulkAssign = () => setIsBulkAssignModalOpen(true);
  const handleCloseBulkAssignModal = () => setIsBulkAssignModalOpen(false);

  const handlePerformBulkAssign = async (selectedIds, assignee) => {
    try {
      await bulkAssignAgreements(selectedIds, assignee);
      addMessage(
        `Successfully assigned ${selectedIds.length} agreements to ${assignee}.`,
        "success"
      );
      loadData();
      handleCloseBulkAssignModal();
    } catch (err) {
      console.error("Error bulk assigning:", err);
      addMessage("Failed to bulk assign agreements", "error");
    }
  };

  const handleApprove = async (id, backendId) => {
    try {
      await approveAgreement(backendId);
      addMessage(`Agreement ${id} approved.`, "success");
      loadData();
    } catch (err) {
      console.error("Error approving:", err);
      addMessage("Failed to approve agreement", "error");
    }
  };

  const handleReject = async (id, backendId) => {
    try {
      await rejectAgreement(backendId);
      addMessage(`Agreement ${id} rejected.`, "success");
      loadData();
    } catch (err) {
      console.error("Error rejecting:", err);
      addMessage("Failed to reject agreement", "error");
    }
  };

  const handleReassign = (id) => {
    alert(`Reassigning agreement ${id}.`);
  };

  // ── Filter agreements
  const filtered = agreements.filter((agr) => {
    const matchesFilter =
      filter === "all" || agr.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      agr.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agr.agreement_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ── Dashboard Stats
  const statsItems = dashboardStats
    ? [
        {
          icon: DocumentTextIcon,
          title: "Total Agreements",
          mainValue: dashboardStats.total_agreements,
          subText: "Current count",
          trendValue: 15,
          trendType: "up",
        },
        {
          icon: ClockIcon,
          title: "Pending Review",
          mainValue: dashboardStats.pending_review,
          subText: "Awaiting action",
          trendValue: 5,
          trendType: "up",
        },
        {
          icon: CheckBadgeIcon,
          title: "Approved",
          mainValue: dashboardStats.approved,
          subText: "Successfully processed",
          trendValue: 92,
          trendType: "up",
        },
        {
          icon: ExclamationTriangleIcon,
          title: "High Priority",
          mainValue: dashboardStats.high_priority,
          subText: "Requires immediate attention",
          trendValue: dashboardStats.high_priority,
          trendType: "down",
        },
      ]
    : [];

  // ── Reusable Badges
  const StatusBadge = ({ status }) => (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        status === "Approved"
          ? "bg-green-100 text-green-800"
          : status === "Rejected"
          ? "bg-red-100 text-red-800"
          : status === "Under Review"
          ? "bg-blue-100 text-blue-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status}
    </span>
  );

  const PriorityBadge = ({ priority }) => (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        priority === "High"
          ? "bg-red-100 text-red-800"
          : priority === "Medium"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-green-100 text-green-800"
      }`}
    >
      {priority}
    </span>
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading agreements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={loadData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Agreement Approvals
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Review and approve legal agreements
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <button
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={handleNewAgreement}
          >
            New Agreement
          </button>
          <button
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            onClick={handleBulkAssign}
          >
            Bulk Assign
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

      {/* ── Approval Timeline Chart ── */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          Approval Timeline (Last 7 Days)
        </h3>
        <BarChart
          data={{
            labels: ["Nov 1", "Nov 2", "Nov 3", "Nov 4", "Nov 5", "Nov 6", "Nov 7"],
            datasets: [
              {
                label: "Approved",
                data: [12, 15, 8, 14, 11, 13, 9],
                backgroundColor: "rgba(34,197,94,0.8)",
              },
              {
                label: "Pending",
                data: [5, 7, 4, 6, 8, 5, 7],
                backgroundColor: "rgba(234,179,8,0.8)",
              },
            ],
          }}
        />
      </div>

      {/* ── Filters + Table ── */}
      <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md">
        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Status:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="all">All Agreements</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search by client name or agreement ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
        </div>

        {/* ── Desktop Table ── */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Agreement ID",
                  "Type",
                  "Client",
                  "Amount",
                  "Submitted",
                  "Priority",
                  "Status",
                  "Assigned To",
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
              {filtered.map((agr) => (
                <tr key={agr.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {agr.agreement_id}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {agr.type}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {agr.client}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {agr.amount}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {agr.submittedDate}
                  </td>
                  <td className="px-4 py-4">
                    <PriorityBadge priority={agr.priority} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={agr.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {agr.assignedTo}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    {agr.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            navigate(`/legal/agreements/review/${agr.id}`)
                          }
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleReassign(agr.agreement_id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Reassign
                        </button>
                      </>
                    )}
                    {agr.status === "Approved" && (
                      <button
                        onClick={() =>
                          navigate(`/legal/agreements/${agr.id}`, {
                            state: { agreements },
                          })
                        }
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    )}
                    {agr.status === "Rejected" && (
                      <button
                        onClick={() =>
                          navigate(`/legal/agreements/${agr.id}`, {
                            state: { agreements },
                          })
                        }
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-6 text-center text-sm text-gray-500">
                    No agreements match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="sm:hidden space-y-3">
          {filtered.length > 0 ? (
            filtered.map((agr) => (
              <div
                key={agr.id}
                className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
              >
                {/* Type + Status */}
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="font-semibold text-gray-900 text-sm leading-tight">
                    {agr.type}
                  </span>
                  <StatusBadge status={agr.status} />
                </div>

                {/* 2-column detail grid */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-600">ID: </span>
                    {agr.agreement_id}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Date: </span>
                    {agr.submittedDate}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Client: </span>
                    {agr.client}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Amount: </span>
                    {agr.amount}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Assigned: </span>
                    {agr.assignedTo}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-gray-600">
                      Priority:
                    </span>
                    <PriorityBadge priority={agr.priority} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  {agr.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/legal/agreements/review/${agr.id}`)
                        }
                        className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleReassign(agr.agreement_id)}
                        className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                      >
                        Reassign
                      </button>
                    </>
                  )}
                  {agr.status === "Approved" && (
                    <button
                      onClick={() =>
                        navigate(`/legal/agreements/${agr.id}`, {
                          state: { agreements },
                        })
                      }
                      className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition"
                    >
                      View Details
                    </button>
                  )}
                  {agr.status === "Rejected" && (
                    <button
                      onClick={() =>
                        navigate(`/legal/agreements/${agr.id}`, {
                          state: { agreements },
                        })
                      }
                      className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 py-6">
              No agreements match your filters.
            </p>
          )}
        </div>
      </div>

      {/* ── Guidelines ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">
          Legal Review Guidelines
        </h3>
        <ul className="space-y-1.5">
          {[
            "Verify all party details and signatures",
            "Check compliance with current regulations",
            "Validate terms and conditions",
            "Review collateral documentation",
            "Ensure proper witnessing and notarization",
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
      <BulkAssignModal
        isOpen={isBulkAssignModalOpen}
        onClose={handleCloseBulkAssignModal}
        agreements={agreements.filter(
          (agr) => agr.status === "Pending" || agr.status === "Approved"
        )}
        onBulkAssign={handlePerformBulkAssign}
      />
      <NewAgreementModal
        isOpen={isNewAgreementModalOpen}
        onClose={handleCloseNewAgreementModal}
        onSave={handleSaveNewAgreement}
      />
    </div>
  );
};

export default AgreementApprovals;