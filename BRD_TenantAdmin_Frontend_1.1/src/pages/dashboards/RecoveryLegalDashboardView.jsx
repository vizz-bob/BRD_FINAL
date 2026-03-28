import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";

import { dashboardApi } from "../../services/dashboardService";

export default function RecoveryLegalDashboardView() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    escalatedNPAs: 0,
    openLegalCases: 0,
    documentsUploaded: 0,
    avgCaseAgeDays: 0,
    caseStatusDistribution: {},
    agingBuckets: [],
    externalFirms: [],
    recentCases: [],
  });

  useEffect(() => {
    fetchRecoveryStats();
  }, []);

  const fetchRecoveryStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.fetchRecoveryStats?.();
      if (res && res.data) setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch recovery stats", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Recovery & Legal Workspace
          </h1>
          <p className="text-sm text-gray-500">
            Track escalations, legal cases and document workflows.
          </p>
        </div>
        <button
          onClick={() => navigate("/recovery/cases")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm whitespace-nowrap"
        >
          View All Cases
        </button>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Escalated NPAs</span>
            <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded shrink-0">Critical</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.escalatedNPAs}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Open Legal Cases</span>
            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded shrink-0">Active</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.openLegalCases}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Documents Uploaded</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded shrink-0">Storage</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.documentsUploaded}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Avg Case Age</span>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded shrink-0">Days</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.avgCaseAgeDays}d</div>
        </div>
      </div>

      {/* OPEN CASES + LEGAL PULSE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* Open Cases (Left 2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700 text-sm md:text-base">Open Cases (Recent)</h3>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded whitespace-nowrap">
              Priority Queue
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentCases && stats.recentCases.length > 0 ? (
              stats.recentCases.map((c, i) => (
                <div
                  key={c.id || i}
                  className="p-4 hover:bg-gray-50 transition flex flex-wrap sm:flex-nowrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm border border-red-100 shrink-0">
                      {(c.borrower || "B").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{c.borrower || "Unknown"}</h4>
                      <p className="text-xs text-gray-500 truncate">
                        {c.caseType || "Recovery"} • Case #{c.caseNo || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center shrink-0">
                    <div className="text-xs text-gray-500 mr-2">
                      Age: <span className="font-bold text-gray-800">{c.ageDays || 0}d</span>
                    </div>
                    <button
                      onClick={() => navigate(`/recovery/cases/${c.id || ""}`)}
                      className="text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-3 py-1.5 rounded transition whitespace-nowrap"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No open cases found.
              </div>
            )}
          </div>
        </div>

        {/* Legal Actions Pulse (Right 1/3) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <DocumentChartBarIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <h3 className="font-bold text-gray-700">Legal Actions Pulse</h3>
          </div>

          <div className="space-y-4 flex-1">
            <div className="border border-yellow-100 bg-yellow-50/40 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1 gap-2">
                <span className="font-bold text-gray-800 text-sm">Pending Notices</span>
                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200 font-bold shrink-0">
                  {stats.caseStatusDistribution?.pending || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Notices generated awaiting dispatch or approval.
              </p>
            </div>

            <div className="border border-green-100 bg-green-50/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1 gap-2">
                <span className="font-bold text-gray-800 text-sm">Court Filings</span>
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200 font-bold shrink-0">
                  {stats.caseStatusDistribution?.filed || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Filings completed with supporting documents uploaded.
              </p>
            </div>

            <button
              onClick={() => navigate("/recovery")}
              className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
            >
              Manage Recovery
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
