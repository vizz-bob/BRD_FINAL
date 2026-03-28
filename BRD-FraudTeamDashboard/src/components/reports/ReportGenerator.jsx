import { useState } from "react";

export default function ReportGenerator({ onGenerate }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!from || !to) return alert("Please select both dates");

    setLoading(true);

    onGenerate(from, to, () => {
      setLoading(false);
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Select Date Range</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full sm:flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
        />

        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full sm:flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
        />

        <button
          onClick={handleGenerate}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm whitespace-nowrap"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}