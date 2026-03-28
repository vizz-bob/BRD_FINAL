import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiArrowLeft,
  FiSearch,
  FiDatabase,
  FiRefreshCw
} from "react-icons/fi";
import { auditService } from "../../services/auditService"; // ✅ Service Import

const BranchDataCard = ({ item }) => (
  <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start">
      <div>
        {/* Branch/User Name */}
        <p className="font-semibold text-gray-900">{item.user_email || "Unknown User"}</p>
        <p className="text-gray-500 text-sm mb-2">{item.description}</p>

        {/* Status Badge based on Action Type */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold 
          ${item.action_type === 'CREATE' ? "bg-green-100 text-green-700" : 
            item.action_type === 'UPDATE' ? "bg-blue-100 text-blue-700" : 
            item.action_type === 'DELETE' ? "bg-red-100 text-red-700" :
            "bg-gray-100 text-gray-700"}`}>
          {item.action_type}
        </span>

        {/* Timestamp */}
        <p className="text-gray-500 text-xs mt-3">
          <b>Time:</b> {new Date(item.timestamp).toLocaleString()}
        </p>

        <p className="text-gray-400 text-xs mt-1">IP: {item.ip_address}</p>
      </div>
    </div>
  </div>
);

const BranchDataMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [search]);

  const loadData = async () => {
    setLoading(true);
    // Hum "Branch" module ya search query ke basis par filter kar sakte hain
    const params = { search }; 
    try {
      const data = await auditService.getLogs(params);
      setLogs(data || []);
    } catch (error) {
      console.error("Error loading branch logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200">
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <FiDatabase /> Monitor Branch Data
          </h1>
          <p className="text-gray-500 text-sm">Monitor system data logs dynamically.</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex justify-between mb-4">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-3 flex items-center gap-3 w-full max-w-md">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>
        
        <button onClick={loadData} className="p-3 bg-white border rounded-xl hover:bg-gray-50 text-gray-600" title="Refresh">
            <FiRefreshCw />
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading data...</p>
        ) : logs.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No data logs found.</p>
        ) : (
          logs.map((item) => (
            <BranchDataCard key={item.id} item={item} />
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default BranchDataMonitor;