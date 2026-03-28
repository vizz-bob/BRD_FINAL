import React from "react";
import { HiOutlineDocumentSearch, HiOutlineExclamationCircle } from "react-icons/hi";

export default function ReportTable({ data, onExportCSV, onExportPDF, hasGenerated, loading }) {
  if (loading) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow text-center border-2 border-dashed border-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse text-sm sm:text-base">Analyzing backend records...</p>
        </div>
      </div>
    );
  }

  if (!hasGenerated) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow text-center border-2 border-dashed border-gray-100">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <HiOutlineDocumentSearch size={40} className="sm:w-12 sm:h-12" />
          <p className="text-sm font-medium">Select criteria and click Generate to see reports</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow text-center border-2 border-dashed border-gray-100">
        <div className="flex flex-col items-center gap-2 text-red-400">
          <HiOutlineExclamationCircle size={40} className="sm:w-12 sm:h-12" />
          <p className="text-sm font-bold">No data found in this date range.</p>
          <p className="text-xs text-gray-500">Try adjusting your "From" and "To" dates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow">
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-[560px] px-3 sm:px-0">
          <table className="w-full text-sm border-collapse table-fixed">
            <colgroup>
              <col style={{ width: "13%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-2 sm:px-3 text-left font-bold text-gray-700 text-xs sm:text-sm">Case ID</th>
                <th className="py-3 px-2 sm:px-3 text-left font-bold text-gray-700 text-xs sm:text-sm">Applicant</th>
                <th className="py-3 px-2 sm:px-3 text-center font-bold text-gray-700 text-xs sm:text-sm">Fraud Score</th>
                <th className="py-3 px-2 sm:px-3 text-center font-bold text-gray-700 text-xs sm:text-sm">AML</th>
                <th className="py-3 px-2 sm:px-3 text-center font-bold text-gray-700 text-xs sm:text-sm">Synthetic ID</th>
                <th className="py-3 px-2 sm:px-3 text-center font-bold text-gray-700 text-xs sm:text-sm">Risk</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={`${row.id}-${row.name}-${index}`} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 sm:px-3 text-left text-xs sm:text-sm">{row.id}</td>
                  <td className="py-2 px-2 sm:px-3 text-left text-xs sm:text-sm truncate">{row.name}</td>
                  <td className="py-2 px-2 sm:px-3 text-center text-xs sm:text-sm">{row.fraud}%</td>
                  <td className="py-2 px-2 sm:px-3 text-center text-xs sm:text-sm">{row.aml}</td>
                  <td className="py-2 px-2 sm:px-3 text-center text-xs sm:text-sm">{row.synthetic}</td>
                  <td className="py-2 px-2 sm:px-3 text-center">
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        row.fraud >= 75
                          ? "text-red-600"
                          : row.fraud >= 40
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {row.fraud >= 75 ? "High" : row.fraud >= 40 ? "Medium" : "Low"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={onExportCSV}
          className="w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium"
        >
          Export CSV
        </button>
        <button
          onClick={onExportPDF}
          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}