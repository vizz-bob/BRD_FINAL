// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Download,
//   Filter,
//   RefreshCw,
//   TrendingUp,
//   BarChart3,
//   PieChart,
//   Activity,
//   Calendar,
// } from "lucide-react";
// import { reportService } from "../services/home";

// export default function ReportsPage() {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [error, setError] = useState(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const fetchReports = async () => {
//     try {
//       setIsRefreshing(true);
//       setError(null);

//       const data = await reportService.getAll({ category: activeTab });
//       console.log("Fetched reports for", activeTab, ":", data);

//       // Handle both paginated and flat array responses
//       const reportsArray = Array.isArray(data) ? data : (data.results || []);
//       setReports(reportsArray);
//     } catch (err) {
//       console.error("Failed to fetch reports:", err);
//       setError("Failed to load analytics data. Please ensure the backend is running.");
//     } finally {
//       setIsRefreshing(false);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, [activeTab]);

//   const handleRefresh = () => fetchReports();

//   const handleExport = () => {
//     const csvContent = "data:text/csv;charset=utf-8,"
//       + ["Title", "Metric", "Value", "Target", "Trend"].join(",") + "\n"
//       + reports.map(r => [r.title, r.metric_name, r.value, r.target, r.trend].join(",")).join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `reports_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading && !isRefreshing) {
//     return (
//       <div className="p-12 text-center text-slate-500 animate-pulse">
//         <Activity className="h-10 w-10 mx-auto mb-4 text-brand-blue/30" />
//         <p className="text-lg">Compiling latest sales metrics...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
//           <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
//             <span className="inline-block w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
//             Real-time data from backend
//           </p>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={handleRefresh}
//             className={`p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors ${isRefreshing ? "animate-spin" : ""}`}
//             disabled={isRefreshing}
//             title="Refresh Data"
//           >
//             <RefreshCw className="h-5 w-5 text-slate-600" />
//           </button>

//           <button
//             onClick={handleExport}
//             className="px-6 py-2 bg-brand-navy text-white rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
//           >
//             <Download className="h-4 w-4" />
//             Export CSV
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
//         {['overview', 'team', 'conversion'].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-8 py-3 text-sm font-semibold capitalize whitespace-nowrap transition-all relative ${activeTab === tab
//                 ? "text-brand-blue"
//                 : "text-slate-400 hover:text-slate-600"
//               }`}
//           >
//             {tab}
//             {activeTab === tab && (
//               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"></div>
//             )}
//           </button>
//         ))}
//       </div>

//       {error ? (
//         <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center text-red-600">
//           <p className="font-medium">{error}</p>
//           <button onClick={handleRefresh} className="mt-4 text-sm underline font-semibold">Try again</button>
//         </div>
//       ) : (
//         <>
//           <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//             {reports.length > 0 ? (
//               reports.map((kpi) => (
//                 <div
//                   key={kpi.id}
//                   className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
//                 >
//                   <div className="relative z-10">
//                     <div className="flex justify-between items-start mb-4">
//                       <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{kpi.title}</p>
//                       <div className="p-2 bg-brand-blue/5 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
//                         <Activity className="h-4 w-4" />
//                       </div>
//                     </div>

//                     <div className="flex items-baseline gap-2">
//                       <h3 className="text-3xl font-bold text-slate-900">{kpi.value}</h3>
//                       {kpi.target && (
//                         <span className="text-xs text-slate-400">/ {kpi.target}</span>
//                       )}
//                     </div>

//                     {kpi.trend && (
//                       <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-brand-emerald bg-brand-emerald/5 px-2 py-1 rounded-md w-fit">
//                         <TrendingUp className="h-3 w-3" />
//                         {kpi.trend}
//                       </div>
//                     )}
//                   </div>

//                   {/* Subtle background decoration */}
//                   <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-colors"></div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
//                 <BarChart3 className="h-12 w-12 text-slate-200 mx-auto mb-4" />
//                 <p className="text-slate-400 font-medium">No metrics found for "{activeTab}" category.</p>
//                 <p className="text-xs text-slate-400 mt-1">Add reports in the admin panel to see them here.</p>
//               </div>
//             )}
//           </section>

//           <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab} Trend Analysis</h2>
//                 <p className="text-sm text-slate-500 mt-1">Aggregated performance over selected period</p>
//               </div>
//               <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
//                 <button className="p-2 bg-white shadow-sm rounded-lg text-brand-blue"><BarChart3 className="h-4 w-4" /></button>
//                 <button className="p-2 text-slate-400 hover:text-slate-600"><PieChart className="h-4 w-4" /></button>
//                 <button className="p-2 text-slate-400 hover:text-slate-600"><Activity className="h-4 w-4" /></button>
//               </div>
//             </div>

//             <div className="h-80 w-full bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-slate-200">
//               <div className="relative h-48 w-48 mb-4">
//                 <div className="absolute inset-0 border-8 border-brand-blue/10 rounded-full"></div>
//                 <div className="absolute inset-0 border-8 border-brand-blue rounded-full border-t-transparent animate-[spin_3s_linear_infinite]"></div>
//                 <div className="absolute inset-0 flex items-center justify-center flex-col">
//                   <TrendingUp className="h-8 w-8 text-brand-blue mb-1" />
//                   <span className="text-2xl font-bold text-slate-900">Live</span>
//                 </div>
//               </div>
//               <p className="text-slate-500 font-medium">Visualization Engine Ready</p>
//               <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Processing {reports.length} Data Points</p>
//             </div>
//           </section>
//         </>
//       )}
//     </>
//   );
// }
import React, { useState, useMemo, useEffect } from "react";
import {
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

const conversionTrend = [
  { label: "Mon", value: 38 },
  { label: "Tue", value: 34 },
  { label: "Wed", value: 42 },
  { label: "Thu", value: 49 },
  { label: "Fri", value: 52 },
  { label: "Sat", value: 58 },
  { label: "Sun", value: 46 },
];

const kpiReports = [
  {
    title: "Lead-to-Application Conversion",
    value: "46%",
    target: "60%",
    trend: "+3% vs last week",
    gradient: "from-brand-blue/90 via-brand-sky/80 to-brand-emerald/80",
  },
  {
    title: "Average Time to Submit",
    value: "38 hrs",
    target: "30 hrs",
    trend: "↓ 6 hrs improvement",
    gradient: "from-brand-emerald/90 via-brand-sky/70 to-brand-blue/90",
  },
  {
    title: "Win Rate",
    value: "72%",
    target: "75%",
    trend: "+2% vs last month",
    gradient: "from-brand-navy via-brand-blue to-brand-slate",
  },
];

// Sample data for performance metrics
const weeklyData = [
  { week: "Week 1", leads: 120, applications: 55, disbursed: 3.8 },
  { week: "Week 2", leads: 135, applications: 62, disbursed: 4.1 },
  { week: "Week 3", leads: 142, applications: 65, disbursed: 4.2 },
  { week: "Week 4", leads: 128, applications: 58, disbursed: 3.9 },
];

// Sample data for team performance
const teamPerformance = [
  { name: "Alex Johnson", leads: 45, applications: 22, conversion: 48.9 },
  { name: "Priya Sharma", leads: 38, applications: 20, conversion: 52.6 },
  { name: "Rahul Verma", leads: 42, applications: 18, conversion: 42.9 },
  { name: "Sneha Reddy", leads: 17, applications: 5, conversion: 29.4 },
];

export default function ReportsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [activeTab, setActiveTab] = useState("overview");

  const conversionAverage = useMemo(() => {
    const total = conversionTrend.reduce((sum, item) => sum + item.value, 0);
    return Math.round(total / conversionTrend.length);
  }, []);

  // Function to refresh data
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  // Function to export data
  const handleExport = () => {
    // Simulate data export
    alert("Exporting report data...");
  };

  // Function to filter data
  const handleFilter = (filters) => {
    // Apply filters to data
    console.log("Applying filters:", filters);
    setShowFilterModal(false);
  };

  // Function to view KPI details
  const handleKpiClick = (kpi) => {
    setSelectedKpi(kpi);
  };

  // Calculate weekly totals
  const weeklyTotals = useMemo(() => {
    const currentWeek = weeklyData[weeklyData.length - 1];
    return {
      leads: currentWeek.leads,
      applications: currentWeek.applications,
      disbursed: currentWeek.disbursed,
    };
  }, []);

  return (
    <>
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500">
            Monitor your sales performance and metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilterModal(!showFilterModal)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-sm"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            {showFilterModal && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-10 p-4">
                <h3 className="font-medium mb-3">Filter Reports</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Time Range
                    </label>
                    <select
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    >
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="quarter">Last Quarter</option>
                      <option value="year">Last Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Team Member
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                      <option value="all">All Team Members</option>
                      <option value="alex">Alex Johnson</option>
                      <option value="priya">Priya Sharma</option>
                      <option value="rahul">Rahul Verma</option>
                      <option value="sneha">Sneha Reddy</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        handleFilter({ timeRange: selectedTimeRange })
                      }
                      className="flex-1 px-3 py-2 bg-brand-blue text-white rounded-md text-sm"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setShowFilterModal(false)}
                      className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 bg-white border border-slate-200 rounded-lg ${
              isRefreshing ? "animate-spin" : ""
            }`}
            disabled={isRefreshing}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg flex items-center gap-2 text-sm"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs for different report views */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "overview"
              ? "text-brand-blue border-b-2 border-brand-blue"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "team"
              ? "text-brand-blue border-b-2 border-brand-blue"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Team Performance
        </button>
        <button
          onClick={() => setActiveTab("conversion")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "conversion"
              ? "text-brand-blue border-b-2 border-brand-blue"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Conversion Analysis
        </button>
      </div>

      {/* KPI Cards - now clickable */}
      <section className="grid md:grid-cols-3 gap-4 mb-6">
        {kpiReports.map((kpi) => (
          <div
            key={kpi.title}
            className={`rounded-2xl p-6 text-white shadow-sm bg-gradient-to-br ${kpi.gradient} cursor-pointer transition-transform hover:scale-105`}
            onClick={() => handleKpiClick(kpi)}
          >
            <p className="text-sm font-medium text-white/90">{kpi.title}</p>
            <p className="text-4xl font-semibold mt-2">{kpi.value}</p>
            <p className="text-sm text-white/80 mt-1">Target: {kpi.target}</p>
            <p className="text-xs text-white/70 mt-2">{kpi.trend}</p>
          </div>
        ))}
      </section>

      {/* KPI Detail Modal */}
      {selectedKpi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedKpi.title}</h3>
              <button
                onClick={() => setSelectedKpi(null)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Current Value</span>
                <span className="font-semibold">{selectedKpi.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Target</span>
                <span className="font-semibold">{selectedKpi.target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Trend</span>
                <span className="font-semibold">{selectedKpi.trend}</span>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-medium mb-2">Historical Data</h4>
                <div className="h-40 bg-slate-100 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-slate-500">
                    Chart visualization would go here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "overview" && (
        <section className="grid xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase text-slate-400">
                  Lead → Application
                </p>
                <h2 className="text-lg font-semibold">Conversion trend</h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-brand-blue">
                  {conversionAverage}%
                </p>
                <p className="text-xs text-slate-500">7-day average</p>
              </div>
            </div>
            <div className="flex items-end gap-3 mt-6">
              {conversionTrend.map((item) => (
                <div key={item.label} className="flex-1 text-center">
                  <div
                    className="mx-auto w-full rounded-full bg-brand-blue/20"
                    style={{ height: "140px" }}
                  >
                    <div
                      className="w-full rounded-full bg-brand-blue"
                      style={{ height: `${item.value}%`, minHeight: "10%" }}
                    ></div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-4">
              <p className="text-xs uppercase text-slate-400">
                Performance Summary
              </p>
              <h2 className="text-lg font-semibold">Weekly Overview</h2>
            </div>
            <div className="space-y-4">
              <div className="border border-slate-100 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Total Leads Captured</p>
                    <p className="text-xs text-slate-500">This week</p>
                  </div>
                  <p className="text-2xl font-semibold text-brand-blue">
                    {weeklyTotals.leads}
                  </p>
                </div>
              </div>
              <div className="border border-slate-100 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Applications Submitted</p>
                    <p className="text-xs text-slate-500">This week</p>
                  </div>
                  <p className="text-2xl font-semibold text-brand-emerald">
                    {weeklyTotals.applications}
                  </p>
                </div>
              </div>
              <div className="border border-slate-100 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Disbursed Amount</p>
                    <p className="text-xs text-slate-500">This week</p>
                  </div>
                  <p className="text-2xl font-semibold text-brand-sky">
                    ₹ {weeklyTotals.disbursed} Cr
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "team" && (
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-4">
            <p className="text-xs uppercase text-slate-400">Team Performance</p>
            <h2 className="text-lg font-semibold">Individual Metrics</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 text-sm font-medium text-slate-700">
                    Team Member
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">
                    Leads
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">
                    Applications
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">
                    Conversion Rate
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamPerformance.map((member, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="p-3 font-medium">{member.name}</td>
                    <td className="p-3">{member.leads}</td>
                    <td className="p-3">{member.applications}</td>
                    <td className="p-3">{member.conversion}%</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-20 bg-slate-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              member.conversion >= 50
                                ? "bg-green-500"
                                : member.conversion >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${member.conversion}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">
                          {member.conversion >= 50
                            ? "Excellent"
                            : member.conversion >= 40
                            ? "Good"
                            : "Needs Improvement"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "conversion" && (
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-400">
                Conversion Analysis
              </p>
              <h2 className="text-lg font-semibold">
                Weekly Conversion Trends
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartType("bar")}
                className={`p-2 rounded ${
                  chartType === "bar"
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`p-2 rounded ${
                  chartType === "pie"
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100"
                }`}
              >
                <PieChart className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`p-2 rounded ${
                  chartType === "line"
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100"
                }`}
              >
                <Activity className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
            <p className="text-sm text-slate-500">
              {chartType === "bar" && "Bar chart visualization would go here"}
              {chartType === "pie" && "Pie chart visualization would go here"}
              {chartType === "line" && "Line chart visualization would go here"}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {weeklyData.map((week, index) => (
              <div
                key={index}
                className="border border-slate-100 rounded-lg p-3"
              >
                <p className="text-sm font-medium">{week.week}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Leads:</span>
                    <span>{week.leads}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Apps:</span>
                    <span>{week.applications}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Conv:</span>
                    <span>
                      {Math.round((week.applications / week.leads) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}