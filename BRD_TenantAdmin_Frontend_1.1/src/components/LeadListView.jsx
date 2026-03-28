import React from 'react';
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function LeadListView({ leads = [], onLeadClick, searchTerm }) {

  const filteredLeads = leads.filter(l =>
    (l.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    (l.mobile || "").includes(searchTerm || "")
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'HOT': return 'bg-orange-100 text-orange-800';
      case 'QUALIFIED': return 'bg-blue-100 text-blue-800';
      case 'RAW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="overflow-auto flex-1">
        {/* TABLE — visible on md+ */}
        <table className="w-full text-left hidden md:table min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-gray-500 uppercase">Lead Name</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-gray-500 uppercase">Mobile</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-gray-500 uppercase">Source</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">No leads found matching your search.</td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => onLeadClick(lead)}
                >
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="font-bold text-slate-800 text-sm">{lead.name}</div>
                    <div className="text-xs text-slate-400">Created: {lead.created || lead.created_at}</div>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-mono text-slate-600">{lead.mobile}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(lead.status)}`}>
                      {(lead.status || "").replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-600">{lead.source}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full">
                      <ChevronRightIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* CARD LIST — visible on mobile only */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No leads found matching your search.</div>
          ) : (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition cursor-pointer gap-3"
                onClick={() => onLeadClick(lead)}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800 text-sm truncate">{lead.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{lead.mobile}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(lead.status)}`}>
                      {(lead.status || "").replace('_', ' ')}
                    </span>
                    {lead.source && (
                      <span className="text-[10px] text-slate-400">{lead.source}</span>
                    )}
                  </div>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-blue-400 flex-shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}