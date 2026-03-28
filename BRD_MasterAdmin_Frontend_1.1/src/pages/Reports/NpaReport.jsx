import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiDownload, FiTrendingDown } from "react-icons/fi";
import MainLayout from "../../layout/MainLayout";
import axiosInstance from "../../utils/axiosInstance";

const NpaReport = () => {
  const [viewType, setViewType] = useState("category");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/reports/npa/");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching NPA report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = (format) => {
    alert(`Downloading NPA Report as ${format}`);
  };

  if (loading) return <MainLayout><div className="p-10 text-center">Loading NPA Data...</div></MainLayout>;

  const npaByCategory = data?.npaByCategory || [];
  const npaByBranch = data?.npaByBranch || [];
  const kpi = data?.kpi || { count: 0, amount: "₹0", ratio: "0%", recovery: "0%" };
  
  // Static for now as backend doesn't send this yet
  const recoveryActions = [
    { action: "Legal Notice Issued", count: 5, status: "In Progress" },
    { action: "Settlement Negotiations", count: 2, status: "Ongoing" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">
        <div className="flex items-center gap-3 pt-2">
          <button onClick={() => window.history.back()} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"><FiArrowLeft size={20} className="text-gray-700" /></button>
          <div><h1 className="text-2xl font-semibold text-gray-900">NPA Report</h1><p className="text-gray-500 text-sm">Track overdue loans & branch-wise NPAs</p></div>
        </div>

        {/* VIEW FILTER */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">View Mode</h2>
          <div className="flex flex-wrap gap-3">
            {[{ value: "category", label: "Category" }, { value: "branch", label: "Branch" }].map((v) => (
              <button key={v.value} onClick={() => setViewType(v.value)} className={`px-6 py-2 rounded-lg text-sm transition font-medium ${viewType === v.value ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>{v.label}</button>
            ))}
          </div>
        </div>

        {/* OVERVIEW */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase">NPA Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl"><p className="text-xs text-gray-600 mb-1">NPA Count</p><p className="text-2xl font-bold text-red-700">{kpi.count}</p></div>
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl"><p className="text-xs text-gray-600 mb-1">Total NPA Amount</p><p className="text-2xl font-bold text-orange-700">{kpi.amount}</p></div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl"><p className="text-xs text-gray-600 mb-1">NPA Ratio</p><p className="text-2xl font-bold text-yellow-700">{kpi.ratio}</p></div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl"><div className="flex justify-between"><p className="text-xs text-gray-600">Recovery Rate</p><FiTrendingDown className="text-green-700" /></div><p className="text-2xl font-bold text-green-700">{kpi.recovery}</p></div>
          </div>
        </div>

        {/* TABLES */}
        {viewType === "category" && (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200"><h2 className="text-sm font-semibold text-gray-800 uppercase">NPA by Category</h2></div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>{["Category", "Description", "Count", "Amount", "%"].map((t) => <th key={t} className="px-6 py-3 text-left text-xs uppercase text-gray-500">{t}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-200">{npaByCategory.map((row, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">{row.category}</td><td className="px-6 py-3">{row.desc}</td><td className="px-6 py-3">{row.count}</td><td className="px-6 py-3">{row.amount}</td><td className="px-6 py-3"><span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full">{row.pct}</span></td></tr>))}</tbody>
            </table>
          </div>
        )}

        {viewType === "branch" && (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200"><h2 className="text-sm font-semibold text-gray-800 uppercase">NPA by Branch</h2></div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>{["Branch", "Count", "Amount", "Rate"].map((t) => <th key={t} className="px-6 py-3 text-left text-xs uppercase text-gray-500">{t}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-200">{npaByBranch.map((row, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">{row.branch}</td><td className="px-6 py-3">{row.count}</td><td className="px-6 py-3">{row.amount}</td><td className="px-6 py-3"><span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{row.rate}</span></td></tr>))}</tbody>
            </table>
          </div>
        )}

        {/* RECOVERY STATUS */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden"><div className="p-6 border-b border-gray-200"><h2 className="text-sm font-semibold uppercase text-gray-800">Recovery Actions (Demo)</h2></div><table className="w-full text-sm"><thead className="bg-gray-50"><tr>{["Action", "Cases", "Status"].map((t) => <th key={t} className="px-6 py-3 text-left text-xs uppercase text-gray-500">{t}</th>)}</tr></thead><tbody className="divide-y divide-gray-200">{recoveryActions.map((a, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">{a.action}</td><td className="px-6 py-3">{a.count}</td><td className="px-6 py-3"><span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{a.status}</span></td></tr>))}</tbody></table></div>
        
        {/* EXPORT */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6"><h2 className="text-sm font-semibold uppercase text-gray-800 mb-4">Export Report</h2><div className="flex flex-wrap gap-4">{[{ label: "PDF", color: "bg-blue-600" }, { label: "Excel", color: "bg-green-600" }, { label: "CSV", color: "bg-gray-700" }].map((btn) => (<button key={btn.label} onClick={() => handleDownload(btn.label)} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white hover:opacity-90 transition ${btn.color}`}><FiDownload /> Download as {btn.label}</button>))}</div></div>
      </div>
    </MainLayout>
  );
};

export default NpaReport;