import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import MainLayout from "../../layout/MainLayout";
import axiosInstance from "../../utils/axiosInstance";
import { branchService } from "../../services/branchService";

const DailyDisbursementReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  
  const [reportData, setReportData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Load Branches for Dropdown
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await branchService.getBranches();
        setBranches(data || []);
      } catch (err) {
        console.error("Failed to load branches");
      }
    };
    loadBranches();
  }, []);

  // 2. Fetch Dynamic Report Data
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (selectedBranch !== "all") params.branch = selectedBranch;

        // API Call
        const res = await axiosInstance.get("/reports/daily-disbursement/", { params });
        setReportData(res.data || []);
      } catch (error) {
        console.error("Error fetching daily report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [startDate, endDate, selectedBranch]);

  const handleDownload = (format) => {
    alert(`Downloading Daily Disbursement Report as ${format}`);
  };

  // Calculate Summary Stats from Data
  const totalLoans = reportData.reduce((acc, curr) => acc + curr.loans, 0);
  
  // Amount string (e.g. "₹50,000") to number converter
  const parseAmount = (str) => Number(str.replace(/[^0-9.-]+/g,""));
  const totalDisbursedVal = reportData.reduce((acc, curr) => acc + parseAmount(curr.amount), 0);
  
  const totalDisbursedDisplay = totalDisbursedVal > 10000000 
    ? `₹${(totalDisbursedVal/10000000).toFixed(2)} Cr` 
    : `₹${totalDisbursedVal.toLocaleString()}`;

  const avgLoan = totalLoans > 0 ? `₹${(totalDisbursedVal / totalLoans).toFixed(0)}` : "₹0";

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">

        {/* TOP BAR */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            <FiArrowLeft size={20} className="text-gray-700" />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Daily Disbursement Report
            </h1>
            <p className="text-gray-500 text-sm">
              Track daily loan disbursements across all branches
            </p>
          </div>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
            Filter Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SUMMARY KPIs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
            Summary Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-500 mb-1">Total Disbursed</p>
              <p className="text-2xl font-bold text-blue-700">{totalDisbursedDisplay}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-xs text-gray-500 mb-1">Total Loans</p>
              <p className="text-2xl font-bold text-green-700">{totalLoans}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="text-xs text-gray-500 mb-1">Avg. Loan Amount</p>
              <p className="text-2xl font-bold text-purple-700">{avgLoan}</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <p className="text-xs text-gray-500 mb-1">Growth Rate</p>
              <p className="text-2xl font-bold text-orange-700">+12.5%</p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Recent Disbursements
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Date", "Branch", "Amount", "Loans"].map((th) => (
                    <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="4" className="text-center p-4">Loading data...</td></tr>
                ) : reportData.length === 0 ? (
                  <tr><td colSpan="4" className="text-center p-4">No data found</td></tr>
                ) : (
                  reportData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-3">{row.date}</td>
                      <td className="px-6 py-3">{row.branch}</td>
                      <td className="px-6 py-3 font-medium">{row.amount}</td>
                      <td className="px-6 py-3">{row.loans}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* EXPORT */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
            Export Report
          </h2>
          <div className="flex flex-wrap gap-4">
            {[
              { type: "PDF", color: "bg-blue-600 hover:bg-blue-700" },
              { type: "Excel", color: "bg-green-600 hover:bg-green-700" },
              { type: "CSV", color: "bg-gray-700 hover:bg-gray-800" },
            ].map(({ type, color }) => (
              <button
                key={type}
                onClick={() => handleDownload(type)}
                className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl transition ${color}`}
              >
                <FiDownload />
                Download as {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DailyDisbursementReport;