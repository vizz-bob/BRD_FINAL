import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { 
  PlusIcon, 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

export default function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", category: "TECHNICAL", priority: "MEDIUM", description: "" });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("support/tickets/");
      setTickets(res.data || []);
    } catch (err) {
      console.error("Fetch tickets failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreate = async () => {
    if (!newTicket.subject || !newTicket.description) return;
    try {
       await axiosInstance.post("support/tickets/", newTicket);
       setShowModal(false);
       setNewTicket({ subject: "", category: "TECHNICAL", priority: "MEDIUM", description: "" });
       fetchTickets();
    } catch (err) {
       alert("Failed to create ticket");
    }
  };

  return (
  <div className="p-4 md:p-8 min-h-screen bg-slate-50 font-sans">

    {/* Header */}
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6 md:mb-8">
      <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Support Tickets</h1>
      <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg hover:bg-primary-700 transition whitespace-nowrap">
        <PlusIcon className="h-5 w-5 shrink-0" /> New Ticket
      </button>
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="bg-orange-100 p-3 rounded-xl text-orange-600 shrink-0"><ClockIcon className="h-6 w-6"/></div>
        <div><div className="text-2xl font-black text-slate-900">{tickets.filter(t=>t.status==='OPEN').length}</div><div className="text-xs font-bold text-slate-400 uppercase">Open Tickets</div></div>
      </div>
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 shrink-0"><CheckCircleIcon className="h-6 w-6"/></div>
        <div><div className="text-2xl font-black text-slate-900">{tickets.filter(t=>t.status==='RESOLVED').length}</div><div className="text-xs font-bold text-slate-400 uppercase">Resolved</div></div>
      </div>
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-xl text-blue-600 shrink-0"><ChatBubbleLeftRightIcon className="h-6 w-6"/></div>
        <div><div className="text-2xl font-black text-slate-900">{tickets.length}</div><div className="text-xs font-bold text-slate-400 uppercase">Total Volume</div></div>
      </div>
    </div>

    {/* Table */}
    <div className="mt-6 md:mt-8 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
            <tr>
              <th className="px-4 md:px-6 py-4 md:py-5">Ticket ID</th>
              <th className="px-4 md:px-6 py-4 md:py-5">Subject</th>
              <th className="px-4 md:px-6 py-4 md:py-5">Category</th>
              <th className="px-4 md:px-6 py-4 md:py-5">Priority</th>
              <th className="px-4 md:px-6 py-4 md:py-5">Status</th>
              <th className="px-4 md:px-6 py-4 md:py-5">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan="6" className="p-8 text-center animate-pulse">Loading...</td></tr> :
             tickets.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-slate-400">No tickets found.</td></tr> :
             tickets.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 cursor-pointer">
                <td className="px-4 md:px-6 py-4 font-mono text-slate-600 text-xs whitespace-nowrap">#{t.id}</td>
                <td className="px-4 md:px-6 py-4 font-bold text-slate-800">{t.subject}</td>
                <td className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">{t.category}</td>
                <td className="px-4 md:px-6 py-4">
                  <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase whitespace-nowrap ${
                    t.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    t.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'
                  }`}>{t.priority}</span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase border whitespace-nowrap ${
                    t.status === 'OPEN' ? 'bg-white border-slate-300 text-slate-600' : 'bg-green-50 border-green-200 text-green-700'
                  }`}>{t.status}</span>
                </td>
                <td className="px-4 md:px-6 py-4 text-xs text-slate-400 font-medium whitespace-nowrap">{t.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
              <div className="bg-primary-600 px-6 py-4 flex justify-between items-center text-white">
                 <h3 className="font-bold">Create New Ticket</h3>
                 <button onClick={() => setShowModal(false)} className="hover:text-red-400">✕</button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                    <input className="w-full border rounded-lg p-3 text-sm font-bold" value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                        <select className="w-full border rounded-lg p-3 text-sm" value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value})}>
                           <option value="TECHNICAL">Technical Issue</option>
                           <option value="REPAYMENT">Repayment/Billing</option>
                           <option value="DISPUTE">Dispute</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
                        <select className="w-full border rounded-lg p-3 text-sm" value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})}>
                           <option value="LOW">Low</option>
                           <option value="MEDIUM">Medium</option>
                           <option value="HIGH">High</option>
                           <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                    <textarea rows="4" className="w-full border rounded-lg p-3 text-sm" value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})}></textarea>
                 </div>
                 <button onClick={handleCreate} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700">Submit Ticket</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
