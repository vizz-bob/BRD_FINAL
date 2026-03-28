import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSearch, FiFilter } from "react-icons/fi";
import { auditService } from "../../services/auditService";

const ActionCard = ({ item }) => (
  <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-200 hover:shadow-md transition">
    <div className="flex justify-between">
      <div>
        <p className="font-semibold text-gray-900">{item.user_email || "Unknown User"}</p>
        <p className="text-gray-500 text-sm">{item.user_role}</p>

        <p className="text-gray-800 text-sm mt-2">
          <span className="font-medium text-blue-600">[{item.action_type}]</span> {item.description}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {new Date(item.timestamp).toLocaleString()} • IP: {item.ip_address}
        </p>
      </div>
      <div>
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
          Success
        </span>
      </div>
    </div>
  </div>
);

const ViewUserActions = () => {
  const [actions, setActions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, [search]);

  const loadData = async () => {
    const params = search ? { search } : {};
    const data = await auditService.getLogs(params);
    setActions(data || []);
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200">
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Activity Log</h1>
          <p className="text-gray-500 text-sm">View and track every action performed by users.</p>
        </div>
      </div>

      <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-4 mb-6 flex items-center gap-3">
        <FiSearch className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search by email, IP or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
        <button className="px-4 py-2 bg-gray-50 rounded-xl text-sm flex items-center gap-2 border border-gray-200 hover:bg-gray-100">
          <FiFilter /> Filters
        </button>
      </div>

      <div className="space-y-4">
        {actions.length === 0 ? (
          <p className="text-gray-500 text-sm">No actions found.</p>
        ) : (
          actions.map((item) => <ActionCard key={item.id} item={item} />)
        )}
      </div>
    </MainLayout>
  );
};

export default ViewUserActions;