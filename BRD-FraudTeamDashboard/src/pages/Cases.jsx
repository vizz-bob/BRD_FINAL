import { useState, useEffect } from "react";
import CasesTable from "../components/cases/CasesTable";
import { getCases } from "../api/caseApi";

export default function Cases() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    getCases().then(setCases);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-700">Cases</h2>

      {/* Filters — wraps naturally on mobile */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-200 transition">
          High Risk
        </button>
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-100 text-yellow-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-yellow-200 transition">
          Medium Risk
        </button>
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-200 transition">
          Low Risk
        </button>
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-200 transition">
          Sanction Hits
        </button>
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 text-purple-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-200 transition">
          Synthetic ID Suspects
        </button>
      </div>

      <CasesTable data={cases} />
    </div>
  );
}