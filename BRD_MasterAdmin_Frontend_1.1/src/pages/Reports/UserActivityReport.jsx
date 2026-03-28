import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import MainLayout from "../../layout/MainLayout";
import axiosInstance from "../../utils/axiosInstance";

const UserActivityReport = () => {
  const [activityType, setActivityType] = useState("all");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/reports/user-activity/");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activityType]);

  const handleDownload = (format) => {
    alert(`Downloading User Activity Report as ${format}`);
  };

  const userActivityData = data?.users || [];
  const systemUsageData = data?.usage || [];
  const kpi = data?.kpi || { active: 0, sessions: 0, avgTime: "0 min", actions: 0 };

  // Static for UI (Backend not sending this yet)
  const peakActivityHours = [
    { time: "09:00 - 11:00", activity: "High", percentage: "28%" },
    { time: "11:00 - 13:00", activity: "Very High", percentage: "35%" },
    { time: "13:00 - 15:00", activity: "Medium", percentage: "18%" },
    { time: "15:00 - 17:00", activity: "High", percentage: "19%" },
  ];

  if (loading) return <MainLayout><div className="p-10 text-center">Loading Activity Data...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"><FiArrowLeft size={20} className="text-gray-700" /></button>
          <div><h1 className="text-2xl font-semibold text-gray-900">User Activity Report</h1><p className="text-gray-500 text-sm">Monitor user engagement</p></div>
        </div>

        {/* FILTERS */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Filter Activity</h2>
          <div className="flex flex-wrap gap-3">
            {[{ value: "all", label: "All Activities" }, { value: "logins", label: "Logins" }, { value: "applications", label: "Applications" }].map((type) => (
              <button key={type.value} onClick={() => setActivityType(type.value)} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activityType === type.value ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>{type.label}</button>
            ))}
          </div>
        </div>

        {/* OVERVIEW CARDS */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Activity Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50"><p className="text-xs text-gray-600 mb-1">Active Users</p><p className="text-2xl font-bold text-gray-900">{kpi.active}</p></div>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50"><p className="text-xs text-gray-600 mb-1">Total Sessions</p><p className="text-2xl font-bold text-gray-900">{kpi.sessions}</p></div>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50"><p className="text-xs text-gray-600 mb-1">Avg. Session Time</p><p className="text-2xl font-bold text-gray-900">{kpi.avgTime}</p></div>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50"><p className="text-xs text-gray-600 mb-1">Actions Performed</p><p className="text-2xl font-bold text-gray-900">{kpi.actions}</p></div>
          </div>
        </div>

        {/* USER ACTIVITY TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200"><h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">User Activity Details</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>{["User Name", "Role", "Logins", "Applications", "Approvals", "Last Active"].map((head) => <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{head}</th>)}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userActivityData.map((u, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{u.user}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{u.role}</span></td>
                    <td className="px-6 py-4">{u.logins}</td>
                    <td className="px-6 py-4">{u.applications}</td>
                    <td className="px-6 py-4">{u.approvals}</td>
                    <td className="px-6 py-4 text-gray-600">{u.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* USAGE + PEAK HOURS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-gray-800 mb-4">System Feature Usage</h3><div className="space-y-3">{systemUsageData.map((f, i) => (<div key={i}><div className="flex justify-between text-sm"><span>{f.feature}</span><span className="text-gray-600">{f.usage}</span></div><div className="w-full bg-gray-200 rounded-full h-2 mt-1"><div className="bg-blue-700 h-2 rounded-full" style={{ width: "50%" }}></div></div></div>))}</div></div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold text-gray-800 mb-4">Peak Activity Hours (Est.)</h3><div className="space-y-3">{peakActivityHours.map((h, idx) => (<div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><p className="text-sm font-medium">{h.time}</p><p className="text-xs text-gray-600">Activity Level: {h.activity}</p></div><span className={`px-3 py-1 rounded-full text-xs font-medium ${h.activity === "Very High" ? "bg-red-100 text-red-800" : h.activity === "High" ? "bg-orange-100 text-orange-800" : "bg-yellow-100 text-yellow-800"}`}>{h.percentage}</span></div>))}</div></div>
        </div>

        {/* EXPORT */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Export Report</h2>
          <div className="flex flex-wrap gap-4">{[{ label: "PDF", color: "bg-blue-600" }, { label: "Excel", color: "bg-green-600" }, { label: "CSV", color: "bg-gray-700" }].map((btn) => (<button key={btn.label} onClick={() => handleDownload(btn.label)} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white hover:opacity-90 transition ${btn.color}`}><FiDownload /> Download as {btn.label}</button>))}</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserActivityReport;