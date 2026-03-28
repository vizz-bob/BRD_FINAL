import React from 'react';
import { Flame, Clock, AlertTriangle, FileCheck, CheckCircle2 } from 'lucide-react';

const HotLeadListView = ({ leads, onSelectLead, selectedLeadId }) => {

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Flame className="w-4 h-4 text-indigo-600 fill-emerald-600" /> High Potential Queue
        </span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className={`relative p-4 cursor-pointer flex items-center gap-4 transition-all hover:bg-indigo-200/20 ${selectedLeadId === lead.id ? 'bg-indigo-200/50' : 'bg-white'
              }`}
          >
            {selectedLeadId === lead.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-s font-bold text-gray-900">{lead.name || 'Unknown Lead'}</p>
                {lead.docs === 'Completed' && <FileCheck className="w-3.5 h-3.5 text-indigo-500" />}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Id: {lead.id}</span>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">INTENT: {lead.intentScore}</span>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Docs: {lead.docs}</span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1 text-[10px] font-bold">
                {lead.slaStatus === 'Breach' ? (
                  <span className="text-rose-600 flex items-center gap-1 animate-pulse"><AlertTriangle className="w-3 h-3" /> SLA BREACH</span>
                ) : (
                  <span className="text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {lead.lastAct}</span>
                )}
              </div>
              <div className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-600 text-white tracking-widest">HOT</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HotLeadListView;