import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSearch, FiEdit3 } from "react-icons/fi";
import { auditService } from "../../services/auditService";

const EditLogCard = ({ log }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
    <div className="flex justify-between">
      <div>
        <p className="text-gray-900 font-semibold">{log.user_email}</p>
        <p className="mt-2 text-gray-700 text-sm font-medium flex items-center gap-2">
          <FiEdit3 className="text-orange-500"/> {log.action_type} on {log.module}
        </p>
        <p className="text-sm text-gray-600 mt-1">{log.description}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(log.timestamp).toLocaleString()} • IP: {log.ip_address}
        </p>
      </div>
    </div>
  </div>
);

const TrackEditsDeletes = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, [search]);

  const loadData = async () => {
    const data = await auditService.getLogs({ search });
    // Filter specifically for UPDATE/DELETE actions locally or via API if supported
    const filtered = data.filter(l => ['UPDATE', 'DELETE', 'CREATE'].includes(l.action_type));
    setLogs(filtered);
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200">
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Track Edits & Deletes</h1>
          <p className="text-gray-500 text-sm">View data modifications and deletions.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 mb-6 flex items-center gap-3">
        <FiSearch className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? <p className="text-gray-500 text-sm">No edit logs found.</p> : 
          logs.map((log) => <EditLogCard key={log.id} log={log} />)
        }
      </div>
    </MainLayout>
  );
};

export default TrackEditsDeletes;