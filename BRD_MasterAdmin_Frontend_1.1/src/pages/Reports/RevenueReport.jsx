import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiDownload, FiTrendingUp } from "react-icons/fi";
import MainLayout from "../../layout/MainLayout";
import axiosInstance from "../../utils/axiosInstance";

const RevenueReport = () => {
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/reports/revenue/");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timePeriod]);

  const handleDownload = (format) => {
    alert(`Downloading Revenue Report as ${format}`);
  };

  const revenueBySource = data?.sources || [];
  const monthlyRevenue = data?.monthly || [];
  const summary = data?.summary || { total: "₹0", avg: "₹0", target: "₹0", growth: "0%" };

  if (loading) return <MainLayout><div className="p-10 text-center">Loading Revenue...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="space-y-6 pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200">
            <FiArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Revenue Report</h1>
            <p className="text-gray-500 text-sm">Financial performance from repayments</p>
          </div>
        </div>

        {/* TIME PERIOD */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Time Period</h2>
          <div className="flex flex-wrap gap-3">
            {["daily", "weekly", "monthly", "quarterly", "yearly"].map((period) => (
              <button key={period} onClick={() => setTimePeriod(period)} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${timePeriod === period ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Revenue Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-700">{summary.total}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Avg Revenue</p>
              <p className="text-2xl font-bold text-blue-700">{summary.avg}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <p className="text-xs text-gray-600 mb-1">Target</p>
              <p className="text-2xl font-bold text-purple-700">{summary.target}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <p className="text-xs text-gray-600 mb-1">Growth</p>
              <p className="text-2xl font-bold text-orange-700">{summary.growth}</p>
            </div>
          </div>
        </div>

        {/* REVENUE TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200"><h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Revenue by Source</h2></div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{["Source", "Amount", "% of Total", "Growth"].map((h) => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueBySource.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{row.source}</td>
                  <td className="px-6 py-3 font-semibold">{row.amount}</td>
                  <td className="px-6 py-3">{row.pct}</td>
                  <td className="px-6 py-3"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">{row.growth}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MONTHLY TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200"><h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Monthly Revenue</h2></div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{["Month", "Revenue", "Target", "Achievement"].map((h) => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyRevenue.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{row.month}</td>
                  <td className="px-6 py-3 font-semibold">{row.revenue}</td>
                  <td className="px-6 py-3">{row.target}</td>
                  <td className="px-6 py-3"><div className="flex items-center"><FiTrendingUp className="text-green-600 mr-2" /><span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs">{row.achieved}</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EXPORT */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Export Report</h2>
          <div className="flex flex-wrap gap-4">
            {[{ label: "PDF", color: "bg-blue-600" }, { label: "Excel", color: "bg-green-600" }, { label: "CSV", color: "bg-gray-700" }].map((btn) => (
              <button key={btn.label} onClick={() => handleDownload(btn.label)} className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl transition ${btn.color}`}><FiDownload /> Download as {btn.label}</button>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RevenueReport;