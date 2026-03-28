import React from 'react';
import { MoreVertical, PhoneOutgoing, Clock, AlertTriangle } from 'lucide-react';

const RawLeadKanbanView = ({ onSelectLead, leadsData }) => {
  const groupLeadsByStatus = (leads) => {
    const statusColors = {
      New: 'bg-green-500',
      Attempted: 'bg-indigo-500',
      Verified: 'bg-blue-500',
      Converted: 'bg-emerald-600',
    };

    const grouped = leads.reduce((acc, lead) => {
      const status = lead.status;

      if (!acc[status]) {
        acc[status] = {
          title: status,
          color: statusColors[status] || 'bg-gray-500',
          leads: [],
        };
      }

      acc[status].leads.push({
        id: lead.id,
        name: lead.contactName,
        source: lead.vendorSource,
        time: lead.lastActivity,
        isStagnant: lead.isStagnant,
        isDuplicate: lead.isDuplicate,
        phone: lead.phone,
      });

      return acc;
    }, {});

    return Object.values(grouped);
  };
  const columns = groupLeadsByStatus(leadsData);
  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
      {columns.map((col) => (
        <div key={col.title} className="w-80 shrink-0 flex flex-col">
          <div className="flex items-center justify-between px-3 mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${col.color}`} />
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-tighter">{col.title}</h3>
            </div>
            <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-full">{col.leads.length}</span>
          </div>

          <div className="flex-1 bg-gray-100/40 rounded-2xl p-3 border border-gray-200/50 space-y-3">
            {col.leads.map(lead => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-gray-900">{lead.name}</h4>
                  <MoreVertical className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-[10px] text-gray-400 font-medium mb-3">{lead.id} • {lead.source}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className={`flex items-center gap-1 text-[9px] font-bold uppercase ${lead.isStagnant ? 'text-orange-500' : 'text-gray-400'}`}>
                    {lead.isStagnant ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {lead.time}
                  </div>
                  <button className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <PhoneOutgoing className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {col.leads.length === 0 && (
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-[10px] font-bold text-gray-300 uppercase">No leads here</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RawLeadKanbanView;