// OnlineReallocateData.jsx
import React, { useState, useEffect } from 'react';
import {
  Search, CheckSquare, Square, Filter,
  AlertCircle, Users, Phone, Mail,
  RefreshCcw, ArrowLeft, Trash2, ShieldAlert, ArrowRightLeft, RefreshCw
} from 'lucide-react';
import { OnlineLeadService } from '../../../services/dataAndLeads.service';

const DUMMY_AGENTS = [
  { id: 1, name: "Agent A" },
  { id: 2, name: "Agent B" },
  { id: 3, name: "Agent C" },
  { id: 4, name: "Agent D" },
];

const OnlineReallocateData = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const [search, setSearch] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [focusedLead, setFocusedLead] = useState(null);
  const [reassignTo, setReassignTo] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await OnlineLeadService.list({ assigned: 'true', page_size: 500 });
      setLeads(res.data?.results ?? res.data ?? []);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load leads.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filteredLeads = leads.filter(l => {
    const matchSearch = l.contact_name?.toLowerCase().includes(search.toLowerCase()) || String(l.id).includes(search);
    const matchAgent = !agentFilter || String(l.assigned_to) === agentFilter;
    return matchSearch && matchAgent;
  });

  const allVisible = filteredLeads.length > 0 && filteredLeads.every(l => selectedLeads.includes(l.id));
  const isBulkMode = selectedLeads.length > 0;

  const handleReallocate = async () => {
    if (!reassignTo) return;
    setMessage(null);
    try {
      if (focusedLead) {
        await OnlineLeadService.reallocate(focusedLead.id, { agent_id: Number(reassignTo) });
        setMessage({ type: 'success', text: `${focusedLead.contact_name} reallocated successfully.` });
        setFocusedLead(null);
      } else {
        await Promise.all(selectedLeads.map(id => OnlineLeadService.reallocate(id, { agent_id: Number(reassignTo) })));
        setMessage({ type: 'success', text: `${selectedLeads.length} leads reallocated successfully.` });
        setSelectedLeads([]);
      }
      setReassignTo('');
      fetchLeads();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Reallocation failed.' });
    }
  };

  const getAgentName = (id) => DUMMY_AGENTS.find(a => a.id === id)?.name || `Agent #${id}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-200px)] bg-gray-50 p-4 font-sans">

      {/* LEFT */}
      <aside className="lg:col-span-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" /> Filter by Agent
          </h3>
          <button onClick={fetchLeads} className="text-xs text-indigo-600 flex items-center gap-1 hover:underline">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search by name/ID…" />
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Agent</label>
          <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-200 rounded-lg text-sm outline-none">
            <option value="">All Agents</option>
            {DUMMY_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </aside>

      {/* MIDDLE */}
      <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-orange-50/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => allVisible ? setSelectedLeads([]) : setSelectedLeads(filteredLeads.map(l => l.id))}>
              {allVisible ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-gray-300" />}
            </button>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
              <RefreshCcw className="w-3 h-3" /> Reallocation Pool
            </span>
          </div>
          {isBulkMode && (
            <span className="text-[12px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
              {selectedLeads.length} Selected
            </span>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-10 text-center text-gray-400 text-sm">Loading leads…</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm italic">No allocated leads found.</div>
          ) : filteredLeads.map(lead => (
            <div key={lead.id} onClick={() => setFocusedLead(lead)}
              className={`p-4 border-b border-gray-50 transition-all cursor-pointer flex items-start space-x-3 border-l-4 ${focusedLead?.id === lead.id ? 'bg-indigo-50 border-l-indigo-500' : 'hover:bg-gray-50 border-l-transparent'}`}
            >
              <div onClick={e => { e.stopPropagation(); setSelectedLeads(prev => prev.includes(lead.id) ? prev.filter(i => i !== lead.id) : [...prev, lead.id]); }}>
                {selectedLeads.includes(lead.id) ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-gray-900 text-sm">{lead.contact_name}</p>
                  <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                    {getAgentName(lead.assigned_to)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{lead.product} • {lead.online_source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-4 h-full">
        {!focusedLead && !isBulkMode ? (
          <div className="h-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center text-gray-400">
            <ArrowRightLeft className="w-12 h-12 mb-2 opacity-20" />
            <p className="max-w-[200px] text-sm">Select leads to change ownership from one agent to another</p>
          </div>
        ) : (
          <aside className="h-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              {focusedLead ? (
                <button onClick={() => setFocusedLead(null)} className="p-1 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-indigo-500" />
                  <span className="font-bold text-gray-900 text-sm">Bulk Reassign ({selectedLeads.length})</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {message && (
                <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {message.text}
                </div>
              )}

              {focusedLead && (
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white uppercase">
                    {focusedLead.contact_name?.charAt(0)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{focusedLead.contact_name}</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Currently: {getAgentName(focusedLead.assigned_to)}
                  </p>
                  {focusedLead.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-[11px] text-gray-600 italic text-left">
                      "{focusedLead.notes}"
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 bg-indigo-50/50 rounded-xl border border-orange-100 space-y-3">
                <h4 className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                  <RefreshCcw className="w-3 h-3" /> New Assignment
                </h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Transfer To Agent</label>
                  <select value={reassignTo} onChange={e => setReassignTo(e.target.value)}
                    className="w-full mt-1.5 p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="">Select New Owner…</option>
                    {DUMMY_AGENTS
                      .filter(a => focusedLead ? a.id !== focusedLead.assigned_to : true)
                      .map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={handleReallocate} disabled={!reassignTo}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                Confirm Reallocation
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default OnlineReallocateData;