import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiDownload, FiCheckCircle, FiXCircle } from "react-icons/fi";
import MainLayout from "../../layout/MainLayout";
import axiosInstance from "../../utils/axiosInstance";

const LoanApprovalRejectionReport = () => {
  const [dateRange, setDateRange] = useState("this-month");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/reports/loan-approval/");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching approval report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const handleDownload = (format) => {
    alert(`Downloading Report as ${format}`);
  };

  const statusData = data?.statusData || [];
  const rejectionReasons = data?.rejectionReasons || [];
  const overall = data?.overall || { total: 0, approved: 0, rejected: 0, approved_pct: "0%", rejected_pct: "0%" };

  if (loading) {
    return <MainLayout><div className="p-10 text-center">Loading Report...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">
        <div className="flex items-center gap-3 pt-2">
          <button onClick={() => window.history.back()} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200">
            <FiArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Loan Approval vs Rejection</h1>
            <p className="text-gray-500 text-sm">Analyze loan application outcomes</p>
          </div>
        </div>

        {/* DATE RANGE */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Date Range</h2>
          <div className="flex flex-wrap gap-3">
            {[{ value: "this-week", label: "This Week" }, { value: "this-month", label: "This Month" }, { value: "this-year", label: "This Year" }].map((range) => (
              <button key={range.value} onClick={() => setDateRange(range.value)} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${dateRange === range.value ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* OVERALL STATS */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Overall Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border"><p className="text-xs text-gray-500 mb-1">Total Applications</p><p className="text-2xl font-bold text-blue-700">{overall.total}</p></div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200"><div className="flex justify-between"><p className="text-xs text-gray-600">Approved</p><FiCheckCircle className="text-green-700" /></div><p className="text-2xl font-bold text-green-700">{overall.approved}</p><p className="text-xs text-gray-600 mt-1">{overall.approved_pct}</p></div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-200"><div className="flex justify-between"><p className="text-xs text-gray-600">Rejected</p><FiXCircle className="text-red-700" /></div><p className="text-2xl font-bold text-red-700">{overall.rejected}</p><p className="text-xs text-gray-600 mt-1">{overall.rejected_pct}</p></div>
            <div className="bg-purple-50 p-4 rounded-xl border"><p className="text-xs text-gray-600 mb-1">Avg. Processing Time</p><p className="text-2xl font-bold text-purple-700">3.2 days</p></div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200"><h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Loan Type Analysis</h2></div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{["Category", "Applications", "Approved", "Rejected", "Approval Rate"].map(t => <th key={t} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statusData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{row.loanType}</td>
                  <td className="px-6 py-3">{row.applied}</td>
                  <td className="px-6 py-3 flex items-center gap-1"><FiCheckCircle className="text-green-600" />{row.approved}</td>
                  <td className="px-6 py-3 flex items-center gap-1"><FiXCircle className="text-red-600" />{row.rejected}</td>
                  <td className="px-6 py-3"><span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">{row.approvalRate}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* REASONS */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">Top Rejection Reasons</h2>
          <div className="space-y-5">
            {rejectionReasons.map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{r.reason}</span><span className="text-gray-500">{r.count} ({r.percentage})</span></div>
                <div className="bg-gray-200 h-2 rounded-full w-full"><div className="bg-blue-700 h-2 rounded-full" style={{ width: r.percentage }}></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* EXPORT */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">Export</h2>
          <div className="flex flex-wrap gap-4">{[{ label: "PDF", color: "bg-blue-600" }, { label: "Excel", color: "bg-green-600" }, { label: "CSV", color: "bg-gray-700" }].map((btn) => (<button key={btn.label} onClick={() => handleDownload(btn.label)} className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl transition ${btn.color}`}><FiDownload /> Download {btn.label}</button>))}</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoanApprovalRejectionReport;