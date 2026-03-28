import React, { useEffect, useState } from 'react';
// ADD 'AlertCircle' to the list below:
import { Clock, ShieldAlert, ChevronRight, Phone, Tag, AlertCircle } from 'lucide-react';

const RawLeadListView = ({ onSelectLead, selectedLeadId, leadsData }) => {
  // Mock data representing different states mentioned in your prompt


  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  

  const statuses = ['All', 'New', 'Attempted'];

  const filteredLeads = leadsData.filter((lead) => {
    const matchesSearch =
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">

      <div className="p-3 border-b border-gray-100 bg-white flex gap-2 rounded-md">
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="rawlead-search" className="sr-only">Search by name or status</label>
          <input
            id="rawlead-search"
            type="text"
            placeholder="Search by name or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="rawlead-filter" className="sr-only">Filter by status</label>
          <select
            id="rawlead-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">

        <span className="text-xs font-bold text-gray-500 uppercase">Unfiltered Lead Pool</span>
        <div className="flex gap-2">

          {/* <div className="flex items-center gap-1 text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">
             <AlertCircle className="w-3 h-3" /> STAGNANT
           </div> */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className={`relative p-4 cursor-pointer flex items-center gap-4 transition-all hover:bg-indigo-100/20 ${selectedLeadId === lead.id ? 'bg-indigo-200/50' : 'bg-white'
              }`}
          >
            {selectedLeadId === lead.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 shadow-[2px_0_8px_rgba(220,38,38,0.3)]" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-bold truncate ${selectedLeadId === lead.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                  {lead.contactName}
                </p>
                {lead.isStagnant && (
                  <span className="bg-orange-100 text-orange-600 text-[9px] px-1.5 py-0.5 rounded font-bold animate-pulse">STAGNANT</span>
                )}
                {lead.isDuplicate && (
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" title="Duplicate Found" />
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <span className="font-mono text-gray-400">{lead.id}</span>
                <span>•</span>
                <span>{lead.vendorSource}</span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <Clock className="w-3 h-3" /> {lead.lastActivity}
              </div>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${lead.status === 'New' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'
                }`}>
                {lead.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RawLeadListView;