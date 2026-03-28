import React from 'react';
import { MoreVertical, PhoneCall, Clock, Zap, FileCheck } from 'lucide-react';
import leadService from '../../../services/leadService';

const HotLeadKanbanView = ({ onSelectLead }) => {
  const [columns, setColumns] = React.useState([
    { title: 'Doc Verification', color: 'bg-amber-400', leads: [] },
    { title: 'Ready for Consult', color: 'bg-emerald-500', leads: [] },
    { title: 'Meeting Scheduled', color: 'bg-indigo-500', leads: [] }
  ]);

  React.useEffect(() => {
    const fetchKanban = async () => {
      try {
        const data = await leadService.getHotLeadKanban();
        setColumns(data);
      } catch (error) {
        console.error("Error fetching kanban:", error);
      }
    };
    fetchKanban();
  }, []);

  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-hide h-full">
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
                className={`bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer group ${lead.stagnant ? 'border-red-200 ring-1 ring-red-50' : 'border-gray-100'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-gray-900">{lead.name}</h4>
                  <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                </div>
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">SCORE: {lead.intent}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className={`flex items-center gap-1 text-[9px] font-black uppercase ${lead.stagnant ? 'text-red-500' : 'text-gray-400'}`}>
                    <Clock className="w-3 h-3" /> {lead.stagnant ? '3D SLA BREACH' : lead.age}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-emerald-600 text-white rounded-lg"><PhoneCall className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 bg-indigo-600 text-white rounded-lg"><FileCheck className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotLeadKanbanView;