import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSearch, FiActivity, FiRefreshCw } from "react-icons/fi";
import { auditService } from "../../services/auditService";

/* ---------------- CARD ---------------- */

const AuditLogCard = ({ item }) => (
  <div className="bg-white p-5 border rounded-xl shadow-sm hover:shadow-md transition">
    <p className="font-semibold text-gray-900">
      {item.user_email || "System"}
    </p>

    <p className="text-gray-500 text-sm mb-2">{item.description}</p>

    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold
      ${item.action_type === "CREATE"
        ? "bg-green-100 text-green-700"
        : item.action_type === "UPDATE"
        ? "bg-blue-100 text-blue-700"
        : item.action_type === "SECURITY"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700"}`}
    >
      {item.action_type}
    </span>

    <p className="text-gray-500 text-xs mt-3">
      <b>Time:</b> {new Date(item.timestamp).toLocaleString()}
    </p>

    <p className="text-gray-400 text-xs mt-1">
      IP: {item.ip_address}
    </p>
  </div>
);

/* ---------------- PAGE ---------------- */

export default function AuditMain() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await auditService.getLogs({ search });
      setLogs(data || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length === 0 || value.length > 2) loadData();
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <FiActivity /> Audit Trails (Normal Logs)
          </h1>
          <p className="text-sm text-gray-500">
            Complete system activity timeline
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex justify-between mb-4">
        <div className="bg-white border shadow-sm rounded-xl p-3 flex items-center gap-3 w-full max-w-md">
          <FiSearch className="text-gray-500" />
          <input
            placeholder="Search audit logs..."
            value={search}
            onChange={handleSearch}
            className="w-full outline-none text-sm"
          />
        </div>

        <button
          onClick={loadData}
          className="p-3 bg-white border rounded-xl hover:bg-gray-50"
        >
          <FiRefreshCw />
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No audit activity found.
          </p>
        ) : (
          logs.map((item) => (
            <AuditLogCard key={item.id} item={item} />
          ))
        )}
      </div>
    </MainLayout>
  );
}
