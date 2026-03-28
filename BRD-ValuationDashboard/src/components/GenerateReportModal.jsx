import React, { useState } from "react";
import Modal from "react-modal";
import { createReport } from "../service/valuationService";

const GenerateReportModal = ({ isOpen, onRequestClose }) => {
  const [reportType, setReportType] = useState("summary");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setError(null);

    if (!dateRange.from || !dateRange.to) {
      setError("Please select a valid date range.");
      return;
    }

    if (dateRange.from > dateRange.to) {
      setError("'From' date cannot be after 'To' date.");
      return;
    }

    setIsGenerating(true);
    try {
      await createReport({
        report_type: reportType,
        from_date: dateRange.from,
        to_date: dateRange.to,
      });

      setReportType("summary");
      setDateRange({ from: "", to: "" });
      onRequestClose();
    } catch (err) {
      console.error("Report generation failed:", err);
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (isGenerating) return;
    setError(null);
    setReportType("summary");
    setDateRange({ from: "", to: "" });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Generate New Report"
      className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[calc(100%-2rem)] max-w-md mx-auto mt-10 sm:mt-20 relative z-50"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-start justify-center px-4 sm:block sm:px-0"
    >
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Generate New Report</h2>

      <div className="space-y-3 sm:space-y-4">
        {/* Error message */}
        {error && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-xs sm:text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Report Type */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            disabled={isGenerating}
            className="mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="summary">Summary</option>
            <option value="audit">Audit</option>
            <option value="data_privacy">Data Privacy</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          {/* Stack on mobile, side-by-side on sm+ */}
          <div className="flex flex-col xs:flex-row gap-2 mt-1 xs:items-center">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              disabled={isGenerating}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <span className="text-gray-500 text-xs sm:text-sm text-center xs:shrink-0">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              disabled={isGenerating}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 sm:mt-6 flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-4">
        <button
          onClick={handleClose}
          disabled={isGenerating}
          className="w-full xs:w-auto px-4 py-2 bg-gray-200 text-gray-700 text-sm sm:text-base rounded-lg hover:bg-gray-300
                     disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Cancel
        </button>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full xs:w-auto px-4 py-2 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700
                     disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {isGenerating && (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>
    </Modal>
  );
};

export default GenerateReportModal;