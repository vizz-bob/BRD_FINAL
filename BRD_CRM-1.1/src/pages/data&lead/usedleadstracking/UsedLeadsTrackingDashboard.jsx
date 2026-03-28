// UsedLeadsTrackingDashboard.jsx — no react-router dependency; tab state is local
import React, { useState, useEffect, useCallback } from "react";
import {
  FolderCheck,
  UserPlus,
  RefreshCw,
  Database,
  TrendingUp,
  Clock,
  Activity,
} from "lucide-react";
import AllocateData   from "./AllocateData";
import ReallocateData from "./ReallocateData";
import AllData        from "./AllData";
import { UsedLeadService } from "../../../services/dataAndLeads.service";

/* ─── Stat Card ─────────────────────────────────────── */
const StatCard = ({ label, value, change, Icon, iconBg, iconColor }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-none mb-1.5">{value}</p>
        <p className="text-xs text-gray-500">{change}</p>
      </div>
      <div className={`p-3 rounded-xl ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
  </div>
);

/* ─── Tab config ─────────────────────────────────────── */
const TABS = [
  { id: "allocate",   label: "Allocate Data",   Icon: UserPlus  },
  { id: "reallocate", label: "Reallocate Data",  Icon: RefreshCw },
  { id: "all",        label: "All Data",         Icon: Database  },
];

/* ─── Dashboard ─────────────────────────────────────── */
const UsedLeadsTrackingDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats]         = useState({
    total:    "—",
    active:   "—",
    avgTime:  "—",
    convRate: "—",
  });

  /* Derive live stats from the all_data endpoint */
  const loadStats = useCallback(async () => {
    try {
      const res  = await UsedLeadService.allData();
      const data = Array.isArray(res.data) ? res.data : res.data.results ?? [];

      const isLocked = (l) =>
        ["won", "dead", "lost"].includes((l.outcome ?? "").toLowerCase()) ||
        ["converted", "coverted"].includes((l.status ?? "").toLowerCase());

      const total    = data.length;
      const active   = data.filter((l) => !isLocked(l)).length;
      const converted = data.filter((l) =>
        ["won", "converted", "coverted"].includes((l.outcome ?? l.status ?? "").toLowerCase())
      ).length;
      const convRate = total ? ((converted / total) * 100).toFixed(1) : "0";

      const withDate = data.filter((l) => l.created_at);
      const avgTime  = withDate.length
        ? (
            withDate.reduce(
              (s, l) => s + (Date.now() - new Date(l.created_at)) / 86400000,
              0
            ) / withDate.length
          ).toFixed(1)
        : "—";

      setStats({
        total:    total.toLocaleString(),
        active:   active.toLocaleString(),
        avgTime:  avgTime === "—" ? "—" : `${avgTime}d`,
        convRate: `${convRate}%`,
      });
    } catch {
      /* silently fail — stat cards keep showing "—" */
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const STAT_CARDS = [
    {
      label:     "Total Used Leads",
      value:     stats.total,
      change:    "All time",
      Icon:      FolderCheck,
      iconBg:    "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      label:     "Active Engagements",
      value:     stats.active,
      change:    "Not yet closed",
      Icon:      Activity,
      iconBg:    "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label:     "Avg. Lead Age",
      value:     stats.avgTime,
      change:    "Days since created",
      Icon:      Clock,
      iconBg:    "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      label:     "Conversion Rate",
      value:     stats.convRate,
      change:    "Won / total",
      Icon:      TrendingUp,
      iconBg:    "bg-violet-50",
      iconColor: "text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <FolderCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-none">
                Used Leads Tracking
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Historical records and performance tracking for engaged leads
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAT_CARDS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex overflow-x-auto gap-1">
            {TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm border-b-2 whitespace-nowrap transition-colors ${
                    active
                      ? "border-indigo-600 text-indigo-600 font-semibold"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === "allocate"   && <AllocateData />}
        {activeTab === "reallocate" && <ReallocateData />}
        {activeTab === "all"        && <AllData />}
      </div>
    </div>
  );
};

export default UsedLeadsTrackingDashboard;
