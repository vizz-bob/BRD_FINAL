import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, FileX } from "lucide-react";

import DashboardMetrics from "../components/Dashboard/DashboardMetrics";
import TaskList from "../components/Dashboard/TaskList";
import SiteVisitMap from "../components/Dashboard/SiteVisitMap";
import SiteVisitPhotos from "./SiteVisitPhotos";
import SiteVisitReport from "./SiteVisitReport";
import DocumentRejections from "../components/Dashboard/DocumentRejections";
import SLAAlerts from "../components/Dashboard/SLAAlerts";
import Sidebar from "../components/Common/Sidebar";

import {
  getAllSiteVisits,
  getAllRejected,
} from "../services/siteVisitService";
import {
  getDashboardSummary,
  getAllTasks,
  getslaalerts,
} from "../services/operationdashboardService";

const OperationsDashboard = ({ user, onLogout = () => {} }) => {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [selectedView, setSelectedView] = useState("dashboard");
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);
  const [rejections, setRejections] = useState([]);
  const [slaAlerts, setSlaAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Derived metrics ───────────────────────────────────────────────────────
  const metrics = dashboardSummary
    ? [
        {
          title: "Pending Tasks",
          value: String(dashboardSummary.pending_tasks ?? "—"),
          trend: dashboardSummary.pending_tasks_trend ?? 0,
          color: "yellow",
          icon: <Clock className="text-yellow-600" size={24} />,
        },
        {
          title: "Completed Today",
          value: String(dashboardSummary.completed_today ?? "—"),
          trend: dashboardSummary.completed_today_trend ?? 0,
          color: "green",
          icon: <CheckCircle className="text-green-600" size={24} />,
        },
        {
          title: "SLA Breaches",
          value: String(dashboardSummary.sla_breaches ?? "—"),
          trend: dashboardSummary.sla_breaches_trend ?? 0,
          color: "red",
          icon: <AlertCircle className="text-red-600" size={24} />,
        },
        {
          title: "OCR Failures",
          value: String(dashboardSummary.ocr_failures ?? "—"),
          trend: dashboardSummary.ocr_failures_trend ?? 0,
          color: "blue",
          icon: <FileX className="text-blue-600" size={24} />,
        },
      ]
    : [];

  // ─── Fetch all data on mount ───────────────────────────────────────────────
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled([
        getDashboardSummary(),
        getAllTasks(),
        getAllSiteVisits(),
        getAllRejected(),
        getslaalerts(),
      ]);

      const [summaryRes, tasksRes, visitsRes, rejectionsRes, slaRes] = results;

      if (summaryRes.status === "fulfilled") {
        setDashboardSummary(
          Array.isArray(summaryRes.value)
            ? summaryRes.value[0]
            : summaryRes.value
        );
      }
      setTasks(
        tasksRes.status === "fulfilled" && Array.isArray(tasksRes.value)
          ? tasksRes.value
          : []
      );
      setSiteVisits(
        visitsRes.status === "fulfilled" && Array.isArray(visitsRes.value)
          ? visitsRes.value
          : []
      );
      setRejections(
        rejectionsRes.status === "fulfilled" && Array.isArray(rejectionsRes.value)
          ? rejectionsRes.value
          : []
      );
      setSlaAlerts(
        slaRes.status === "fulfilled" && Array.isArray(slaRes.value)
          ? slaRes.value
          : []
      );

      // Show error only if ALL critical requests failed
      if (
        summaryRes.status === "rejected" &&
        tasksRes.status === "rejected"
      ) {
        setError("Failed to load dashboard data. Please try again.");
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // ─── Refresh tasks when returning to dashboard ─────────────────────────────
  useEffect(() => {
    if (selectedView !== "dashboard") return;

    const refreshTasks = async () => {
      try {
        const tasksData = await getAllTasks();
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } catch (err) {
        console.error("Failed to refresh tasks:", err);
      }
    };

    refreshTasks();
  }, [selectedView]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex">
      <Sidebar
        selectedView={selectedView}
        onSelect={setSelectedView}
        userEmail={user?.email || ""}
        onLogout={onLogout}
      />

      <main className="flex-1 min-h-screen bg-gray-50 ml-0 lg:ml-64 mt-14 lg:mt-0">

        {/* ─── Desktop Header ───────────────────────────────────── */}
        <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Operations Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Verification & KYC Management
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Welcome,{" "}
                  <span className="font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={() => {
                    setSelectedView("dashboard");
                    onLogout();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Main Content ─────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

          {/* Loading state */}
          {loading && selectedView === "dashboard" && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              <span className="ml-3 text-gray-500 text-sm">
                Loading dashboard data…
              </span>
            </div>
          )}

          {/* Error state */}
          {error && selectedView === "dashboard" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Dashboard view */}
          {!loading && !error && selectedView === "dashboard" && (
            <>
              <DashboardMetrics metrics={metrics} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TaskList tasks={tasks} />
                </div>
                <div>
                  <SLAAlerts alerts={slaAlerts} />
                </div>
              </div>
            </>
          )}

          {/* Site visits view */}
          {selectedView === "siteVisits" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Site Visits</h2>
              <SiteVisitMap
                visits={siteVisits}
                onViewPhotos={(v) => {
                  setSelectedVisit(v);
                  setSelectedView("siteVisitPhotos");
                }}
                onViewReport={(v) => {
                  setSelectedVisit(v);
                  setSelectedView("siteVisitReport");
                }}
              />
            </div>
          )}

          {/* Site visit photos view */}
          {selectedView === "siteVisitPhotos" && (
            <SiteVisitPhotos
              visit={selectedVisit}
              onBack={() => setSelectedView("siteVisits")}
            />
          )}

          {/* Site visit report view */}
          {selectedView === "siteVisitReport" && (
            <SiteVisitReport
              visitId={selectedVisit?.id}
              onBack={() => setSelectedView("siteVisits")}
            />
          )}

          {/* Rejections view */}
          {selectedView === "rejections" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Document Rejections
              </h2>
              <DocumentRejections rejections={rejections} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default OperationsDashboard;