import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

import { dashboardApi } from "../../services/dashboardService";

export default function SupportTeamDashboardView() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    openTickets: 0,
    avgResponseTime: 0,
    slaCompliance: 0,
    escalatedIssues: 0,
    ticketCategories: {},
    recentTickets: [],
    priorityTickets: [],
  });

  useEffect(() => {
    fetchSupportStats();
  }, []);

  const fetchSupportStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.fetchSupportStats?.();
      if (res && res.data) setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch support stats", err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Resolved": return "bg-green-100 text-green-800 border-green-200";
      case "Escalated": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Support Team Dashboard</h1>
          <p className="text-sm text-gray-500">Handle borrower issues, track tickets, and manage escalations.</p>
        </div>
        <button
          onClick={() => navigate("/support/tickets")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm whitespace-nowrap"
        >
          View All Tickets
        </button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Open Tickets</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded shrink-0">Active</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.openTickets}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Avg Response Time</span>
            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded shrink-0">Hours</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.avgResponseTime}h</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">SLA Compliance</span>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded shrink-0">Target</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.slaCompliance}%</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Escalated Issues</span>
            <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded shrink-0">Critical</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">{stats.escalatedIssues}</div>
        </div>
      </div>

      {/* RECENT TICKETS + CATEGORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700 text-sm md:text-base">Recent Tickets</h3>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded whitespace-nowrap">Priority Queue</span>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentTickets && stats.recentTickets.length > 0 ? (
              stats.recentTickets.map((ticket, i) => (
                <div
                  key={ticket.id || i}
                  className="p-4 hover:bg-gray-50 transition flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 shrink-0">
                      {(ticket.customer || "C").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{ticket.subject || "No Subject"}</h4>
                      <p className="text-xs text-gray-500 truncate">
                        {ticket.customer || "Unknown Customer"} • Ticket #{ticket.id || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center shrink-0">
                    <span className={`text-xs px-2 py-1 rounded border font-medium whitespace-nowrap ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority || "Medium"}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded border font-medium whitespace-nowrap ${getStatusColor(ticket.status)}`}>
                      {ticket.status || "Open"}
                    </span>
                    <button
                      onClick={() => navigate(`/support/tickets/${ticket.id || ""}`)}
                      className="text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-3 py-1.5 rounded transition whitespace-nowrap"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">No tickets found.</div>
            )}
          </div>
        </div>

        {/* Ticket Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <h3 className="font-bold text-gray-700">Ticket Categories</h3>
          </div>

          <div className="space-y-4 flex-1">
            {stats.ticketCategories && Object.keys(stats.ticketCategories).length > 0 ? (
              Object.entries(stats.ticketCategories).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{category}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm py-4">No category data available.</div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Response Quality</h4>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Customer Satisfaction</span>
                <span className="font-bold text-gray-900">4.2/5.0</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "84%" }}></div>
              </div>
            </div>

            <button
              onClick={() => navigate("/support/analytics")}
              className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
            >
              View Analytics
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}