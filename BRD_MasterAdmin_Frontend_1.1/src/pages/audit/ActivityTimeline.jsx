import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiArrowLeft,
  FiClock,
  FiSearch,
} from "react-icons/fi";
import { auditService } from "../../services/auditService"; // ✅ Service Import

const TimelineItem = ({ item }) => (
  <div className="relative pl-10 pb-10 group">
    {/* Line */}
    <span className="absolute left-[13px] top-0 h-full bg-gray-300"></span>
    {/* Dot */}
    <span className="absolute left-2 top-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow"></span>

    {/* Content Box */}
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
      <div className="flex justify-between items-start">
        <div>
          {/* Action Title */}
          <h3 className="font-semibold text-gray-900">
            {item.action_type} <span className="text-gray-500 font-normal">on {item.module}</span>
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mt-1">{item.description}</p>

          {/* User & Time */}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
             <span className="font-medium text-blue-600">User: {item.user_email || "System"}</span>
             <span>•</span>
             <span className="flex items-center gap-1">
                <FiClock /> {new Date(item.timestamp).toLocaleString()}
             </span>
             <span>•</span>
             <span>IP: {item.ip_address}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ActivityTimeline = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
    loadData();
  }, [search]);

  const loadData = async () => {
    setLoading(true);
    const params = search ? { search } : {};
    try {
      const data = await auditService.getLogs(params);
      setEvents(data || []);
    } catch (err) {
      console.error("Failed to load timeline");
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
          <h1 className="text-2xl font-semibold text-gray-900">Activity Timeline</h1>
          <p className="text-gray-500 text-sm">View chronological system events.</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 mb-6 flex items-center gap-3">
        <FiSearch className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search activity by user, action..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* TIMELINE LIST */}
      <div className="relative pl-4">
        {loading ? (
          <p className="text-gray-500 ml-10">Loading timeline...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500 text-sm ml-10">No events found.</p>
        ) : (
          events.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default ActivityTimeline;