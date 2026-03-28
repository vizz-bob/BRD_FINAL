import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiDownload, FiBarChart2 } from "react-icons/fi";
import MainLayout from "../../layout/MainLayout";
import axiosInstance from "../../utils/axiosInstance";

const BranchPerformanceReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Dynamic Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/reports/branch-performance/");
        setBranchData(res.data || []);
      } catch (error) {
        console.error("Error fetching branch performance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPeriod]); // Re-fetch if period changes (backend logic can be added later)

  const handleDownload = (format) => {
    alert(`Downloading Branch Performance Report as ${format}`);
  };

  // Stats calculation
  const totalBranches = branchData.length;
  const totalLoans = branchData.reduce((acc, curr) => acc + (curr.loans || 0), 0);

  // Helper to parse "₹12.5 Cr" strings
  const parseCurrency = (str) => {
    if (!str) return 0;
    const num = parseFloat(str.replace(/[^0-9.]/g, ""));
    return str.includes("Cr") ? num * 10000000 : num;
  };

  const totalAmountVal = branchData.reduce((acc, curr) => acc + parseCurrency(curr.disbursed), 0);
  const totalAmountDisplay = totalAmountVal > 10000000 
    ? `₹${(totalAmountVal / 10000000).toFixed(2)} Cr` 
    : `₹${totalAmountVal.toLocaleString()}`;

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">

        {/* BACK + TITLE */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            <FiArrowLeft className="text-gray-700" size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Branch Performance Report
            </h1>
            <p className="text-gray-500 text-sm">
              Comprehensive performance analysis across all branches
            </p>
          </div>
        </div>

        {/* PERIOD FILTER */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
            Report Period
          </h2>
          <div className="flex flex-wrap gap-3">
            {["weekly", "monthly", "quarterly", "yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                  selectedPeriod === period
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
            Overall Performance Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-xs text-gray-600 mb-1">Total Branches</p>
              <p className="text-2xl font-bold text-gray-900">{totalBranches}</p>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-xs text-gray-600 mb-1">Total Loans Disbursed</p>
              <p className="text-2xl font-bold text-gray-900">{totalLoans}</p>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-xs text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{totalAmountDisplay}</p>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-xs text-gray-600 mb-1">Avg. NPA Rate</p>
              <p className="text-2xl font-bold text-gray-900">2.4%</p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Branch-wise Performance
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Branch Name", "Total Loans", "Amount Disbursed", "Collections", "NPA %", "Rating"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="6" className="text-center p-4">Loading branch data...</td></tr>
                ) : branchData.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-4">No branches found.</td></tr>
                ) : (
                  branchData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-3">{item.branch}</td>
                      <td className="px-6 py-3">{item.loans}</td>
                      <td className="px-6 py-3">{item.disbursed}</td>
                      <td className="px-6 py-3">{item.collections}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          parseFloat(item.npa) < 3 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {item.npa}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {item.rating}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* KPIs */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
            Key Performance Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Disbursement Rate", value: "92.3%" },
              { label: "Collection Efficiency", value: "85.7%" },
              { label: "Customer Satisfaction", value: "4.6/5.0" },
            ].map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{item.label}</h3>
                  <FiBarChart2 className="text-gray-700 text-lg" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* EXPORT */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Export Report</h2>
          <div className="flex flex-wrap gap-4">
            {[{ type: "PDF", color: "bg-blue-600" }, { type: "Excel", color: "bg-green-600" }, { type: "CSV", color: "bg-gray-700" }].map(({ type, color }) => (
              <button key={type} onClick={() => handleDownload(type)} className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl transition ${color}`}>
                <FiDownload /> Download as {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BranchPerformanceReport;