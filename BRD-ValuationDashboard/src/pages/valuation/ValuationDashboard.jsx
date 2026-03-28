import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardMetrics } from "../../components/DashboardComponents";
import { LineChart, BarChart, PieChart } from "../../components/Charts";
import NewValuationModal from "../../components/NewValuationModal";
import GenerateReportModal from "../../components/GenerateReportModal";

import {
  ClockIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

import {
  getValuationDashboard,
  getLocationDistribution,
  getValuations,
} from "../../service/valuationService";

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  completed: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  verified: "bg-purple-100 text-purple-800",
  pending: "bg-yellow-100 text-yellow-800",
};

const normaliseStatus = (raw = "") =>
  raw.toLowerCase().replace(/\s+/g, "_");

const formatINR = (value) =>
  value !== undefined && value !== null
    ? `₹${Number(value).toLocaleString("en-IN")}`
    : "—";

// ─── Component ───────────────────────────────────────────────────────────────

const ValuationDashboard = () => {
  // ── Modal state ─────────────────────────────────────────────────
  const [isNewValuationModalOpen, setNewValuationModalOpen] = useState(false);
  const [isGenerateReportModalOpen, setGenerateReportModalOpen] = useState(false);

  // ── API data state ───────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboardData, setDashboardData] = useState(null);   // /valuation-dashboard/
  const [locationData, setLocationData] = useState([]);        // /location-distribution/
  const [valuations, setValuations] = useState([]);            // /valuations/

  // ── Filter state ─────────────────────────────────────────────────
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterProperty, setFilterProperty] = useState("All");
  const [filterState, setFilterState] = useState("All");

  // ── Fetch all data ────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dashboard, locations, vals] = await Promise.all([
          getValuationDashboard(),
          getLocationDistribution(),
          getValuations(),
        ]);
        setDashboardData(dashboard);
        setLocationData(Array.isArray(locations) ? locations : []);
        setValuations(Array.isArray(vals) ? vals : []);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ── Loading / error guards ────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm">Loading dashboard…</span>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        {error || "Failed to load dashboard data."}
      </div>
    );
  }

  // ── KPI metrics (backend returns flat keys) ───────────────────────
  // Backend shape: { pending_valuations, completed_today, average_value, success_rate }
  const metrics = [
    {
      title: "Pending Valuations",
      value: dashboardData.pending_valuations ?? 0,
      trend: 0,
      color: "yellow",
      icon: ClockIcon,
    },
    {
      title: "Completed Today",
      value: dashboardData.completed_today ?? 0,
      trend: 0,
      color: "green",
      icon: CheckCircleIcon,
    },
    {
      title: "Average Value",
      value: `₹${dashboardData.average_value ?? 0}`,
      trend: 0,
      color: "blue",
      icon: BanknotesIcon,
    },
    {
      title: "Success Rate",
      value: `${dashboardData.success_rate ?? 0}%`,
      trend: 0,
      color: "green",
      icon: ArrowTrendingUpIcon,
    },
  ];

  // ── Chart data derived from valuations list ───────────────────────
  // Valuation trend: group by valuation_date month → avg estimated_value
  const monthlyMap = {};
  valuations.forEach((v) => {
    if (!v.valuation_date) return;
    const month = new Date(v.valuation_date).toLocaleString("default", { month: "short", year: "numeric" });
    if (!monthlyMap[month]) monthlyMap[month] = { total: 0, count: 0 };
    monthlyMap[month].total += parseFloat(v.estimated_value || 0);
    monthlyMap[month].count += 1;
  });
  const trendLabels = Object.keys(monthlyMap);
  const trendValues = trendLabels.map((m) =>
    monthlyMap[m].count ? +(monthlyMap[m].total / monthlyMap[m].count / 100000).toFixed(2) : 0
  );

  // Property type distribution from valuations
  const propMap = {};
  valuations.forEach((v) => {
    const type = v.property_name || "Other";
    propMap[type] = (propMap[type] || 0) + 1;
  });
  const distributionLabels = Object.keys(propMap);
  const distributionValues = distributionLabels.map((k) => propMap[k]);
  const CHART_COLORS = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
    "#EC4899", "#14B8A6", "#F97316",
  ];
  const distributionColors = distributionLabels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  // Monthly completion count from valuations
  const completionMap = {};
  valuations
    .filter((v) => normaliseStatus(v.status) === "completed")
    .forEach((v) => {
      if (!v.valuation_date) return;
      const month = new Date(v.valuation_date).toLocaleString("default", { month: "short", year: "numeric" });
      completionMap[month] = (completionMap[month] || 0) + 1;
    });
  const completionLabels = Object.keys(completionMap);
  const completionCounts = completionLabels.map((m) => completionMap[m]);

  // ── Location distribution filters ────────────────────────────────
  // Backend shape: { id, month, property_type, state, valuations_count, top_property_type, avg_loan, created_at }
  const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);

  const monthOptions = ["All", ...new Set(locationData.map((l) => capitalize(l.month)).filter(Boolean))];
  const propertyOptions = ["All", ...new Set(locationData.map((l) => capitalize(l.property_type)).filter(Boolean))];
  const stateOptions = ["All", ...new Set(locationData.map((l) => capitalize(l.state)).filter(Boolean))];

  const filteredLocationData = locationData.filter((loc) => {
    const monthMatch = filterMonth === "All" || capitalize(loc.month) === filterMonth;
    const propertyMatch = filterProperty === "All" || capitalize(loc.property_type) === filterProperty;
    const stateMatch = filterState === "All" || capitalize(loc.state) === filterState;
    return monthMatch && propertyMatch && stateMatch;
  });

  // ── Recent valuations (latest 4) ─────────────────────────────────
  const recentValuations = [...valuations]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  // ── JSX ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Valuation Dashboard
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Property Valuation and Assessment Overview
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setNewValuationModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            New Valuation
          </button>
          <button
            onClick={() => setGenerateReportModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardMetrics items={metrics} />

      {/* Modals */}
      <NewValuationModal
        isOpen={isNewValuationModalOpen}
        onClose={() => setNewValuationModalOpen(false)}
      />
      <GenerateReportModal
        isOpen={isGenerateReportModalOpen}
        onRequestClose={() => setGenerateReportModalOpen(false)}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Valuation Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Valuation Trends</h3>
          {trendLabels.length > 0 ? (
            <LineChart
              data={{
                labels: trendLabels,
                datasets: [
                  {
                    label: "Avg Property Value (Lakhs ₹)",
                    data: trendValues,
                    borderColor: "rgb(59, 130, 246)",
                    backgroundColor: "rgba(59, 130, 246, 0.15)",
                    tension: 0.3,
                  },
                ],
              }}
            />
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No trend data available.</p>
          )}
        </div>

        {/* Property Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Property Type Distribution</h3>
          {distributionLabels.length > 0 ? (
            <PieChart
              data={{
                labels: distributionLabels,
                datasets: [{ data: distributionValues, backgroundColor: distributionColors }],
              }}
            />
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No distribution data available.</p>
          )}
        </div>

        {/* Monthly Completion Rate */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Monthly Completion Rate</h3>
          {completionLabels.length > 0 ? (
            <BarChart
              data={{
                labels: completionLabels,
                datasets: [
                  {
                    label: "Completed",
                    data: completionCounts,
                    backgroundColor: "rgba(16, 185, 129, 0.8)",
                    maxBarThickness: 70,
                  },
                ],
              }}
            />
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No completion data available.</p>
          )}
        </div>

        {/* Location Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-4 mb-6">
            {[
              { label: "Month", value: filterMonth, setter: setFilterMonth, options: monthOptions },
              { label: "Type", value: filterProperty, setter: setFilterProperty, options: propertyOptions },
              { label: "State", value: filterState, setter: setFilterState, options: stateOptions },
            ].map(({ label, value, setter, options }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-600 min-w-[60px]">{label}:</label>
                <select
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Location Distribution</h3>
            </div>

            {/* Desktop table */}
            <div className="overflow-x-auto sm:block hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["State/City", "Valuations Count", "Top Property Type", "Avg Loan"].map((h) => (
                      <th key={h} className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLocationData.length > 0 ? (
                    filteredLocationData.map((loc) => (
                      <tr key={loc.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">{capitalize(loc.state)}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">{loc.valuations_count}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">{capitalize(loc.top_property_type)}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatINR(loc.avg_loan)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No records match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden p-4 space-y-4">
              {filteredLocationData.length > 0 ? (
                filteredLocationData.map((loc) => (
                  <div key={loc.id} className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900 text-sm">{capitalize(loc.state)}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {capitalize(loc.top_property_type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500"><strong>Valuations:</strong> {loc.valuations_count}</p>
                    <p className="text-sm text-gray-500"><strong>Avg Loan:</strong> {formatINR(loc.avg_loan)}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500">No records match your filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Valuations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Valuations</h3>
        </div>

        {/* Desktop table */}
        <div className="overflow-x-auto sm:block hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "Property", "Location", "Date", "Est. Value", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentValuations.length > 0 ? (
                recentValuations.map((val) => {
                  const statusKey = normaliseStatus(val.status);
                  return (
                    <tr key={val.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">{val.valuation_id}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{val.property_name}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{val.location}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">{val.valuation_date}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatINR(val.estimated_value)}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_STYLES[statusKey] || STATUS_STYLES.pending}`}>
                          {val.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium">
                        <Link to={`/valuation/${val.valuation_id}`} className="text-blue-600 hover:text-blue-900 mr-2">View</Link>
                        <Link to={`/valuation/${val.valuation_id}`} className="text-green-600 hover:text-green-900">Update</Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No valuations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden p-4 space-y-4">
          {recentValuations.map((val) => {
            const statusKey = normaliseStatus(val.status);
            return (
              <div key={val.id} className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{val.property_name}</span>
                  <span className={`px-2 inline-flex text-xs rounded-full ${STATUS_STYLES[statusKey] || STATUS_STYLES.pending}`}>
                    {val.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2"><strong>ID:</strong> {val.valuation_id}</p>
                <p className="text-sm text-gray-500"><strong>Location:</strong> {val.location}</p>
                <p className="text-sm text-gray-500"><strong>Date:</strong> {val.valuation_date}</p>
                <p className="text-sm text-gray-500"><strong>Est. Value:</strong> {formatINR(val.estimated_value)}</p>
                <div className="mt-2 flex gap-2">
                  <Link to={`/valuation/${val.valuation_id}`} className="text-blue-600 hover:text-blue-900 text-sm">View</Link>
                  <Link to={`/valuation/${val.valuation_id}`} className="text-green-600 hover:text-green-900 text-sm">Update</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ValuationDashboard;
