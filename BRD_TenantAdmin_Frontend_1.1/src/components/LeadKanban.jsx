import React from 'react';
import { UserCircleIcon, PhoneIcon } from "@heroicons/react/24/solid";

export default function LeadKanban({ leads = [], onLeadClick, searchTerm }) {

  const COLUMNS = [
    { id: 'RAW', label: 'Raw Leads', color: 'border-blue-500' },
    { id: 'QUALIFIED', label: 'Qualified', color: 'border-blue-500' },
    { id: 'HOT', label: 'Hot / Doc Collected', color: 'border-orange-500' },
    { id: 'FOLLOW_UP', label: 'Follow Up', color: 'border-amber-500' },
  ];

  const getLeadsByStatus = (status) => {
    return leads.filter(l =>
      l.status === status &&
      (l.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    );
  };

  return (
    /* Horizontal scroll on mobile, fills height */
    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 h-full items-start">
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          /* Fixed narrow width on mobile, flexible on larger screens */
          className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] flex-1 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200 max-h-full"
        >
          {/* Column Header */}
          <div className={`p-3 sm:p-4 border-t-4 ${col.color} bg-white rounded-t-xl shadow-sm`}>
            <h3 className="font-bold text-slate-700 text-xs sm:text-sm uppercase tracking-wide flex justify-between items-center">
              <span className="truncate mr-2">{col.label}</span>
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs flex-shrink-0">
                {getLeadsByStatus(col.id).length}
              </span>
            </h3>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 sm:space-y-3">
            {getLeadsByStatus(col.id).map((lead) => (
              <div
                key={lead.id}
                onClick={() => onLeadClick(lead)}
                className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-blue-300 transition group"
              >
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-slate-300 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-xs sm:text-sm truncate">{lead.name}</div>
                      <div className="text-[10px] sm:text-xs text-slate-400 font-mono">{lead.mobile}</div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 ${lead.score > 50 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {lead.score}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase truncate mr-2">{lead.source}</span>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-600 transition flex-shrink-0"
                  >
                    <PhoneIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            ))}

            {getLeadsByStatus(col.id).length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs font-medium italic">
                No leads
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}