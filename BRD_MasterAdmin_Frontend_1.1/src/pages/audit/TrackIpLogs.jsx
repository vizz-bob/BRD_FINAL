import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSearch, FiGlobe } from "react-icons/fi";
import { auditService } from "../../services/auditService";

const IpLogCard = ({ log }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold text-gray-900">{log.user_email || "System"}</p>
        <p className="mt-2 flex items-center gap-2 text-gray-700 text-sm">
          <FiGlobe className="text-blue-500"/> {log.ip_address}
        </p>
        <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
      </div>
      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg border border-blue-100">
        {log.action_type}
      </span>
    </div>
  </div>
);

const TrackIpLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Filter specifically for LOGIN actions if you want, or just show all IPs
    // const params = { action_type: 'LOGIN' }; 
    loadData();
  }, [search]);

  const loadData = async () => {
    const params = search ? { search } : {};
    const data = await auditService.getLogs(params);
    setLogs(data || []);
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200">
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Track IP Addresses</h1>
          <p className="text-gray-500 text-sm">Monitor login IPs and locations.</p>
        </div>
      </div>

      <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-4 mb-6 flex items-center gap-3">
        <FiSearch className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search IP or User..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? <p className="text-gray-500 text-sm">No IP logs found.</p> : 
          logs.map((log) => <IpLogCard key={log.id} log={log} />)
        }
      </div>
    </MainLayout>
  );
};

export default TrackIpLogs;