// OnlineAllocateData.jsx
import React, { useState, useEffect } from 'react';
import {
  Search, CheckSquare, Square, Filter,
  AlertCircle, Users, Phone, Mail,
  Flame, Award, UserPlus, ArrowLeft,
  Calendar, Trash2, RefreshCw
} from 'lucide-react';
import { OnlineLeadService } from '../../../services/dataAndLeads.service';

const DUMMY_AGENTS = [
  { id: 1, name: "Agent A" },
  { id: 2, name: "Agent B" },
  { id: 3, name: "Agent C" },
  { id: 4, name: "Agent D" },
];

const OnlineAllocateData = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const [search, setSearch] = useState('');
  const [qualityFilter, setQualityFilter] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [focusedLead, setFocusedLead] = useState(null);
  const [assignTo, setAssignTo] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await OnlineLeadService.list({ unassigned: 'true', page_size: 500 });
      setLeads(res.data?.results ?? res.data ?? []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load leads.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filteredLeads = leads.filter(l => {
    const matchSearch = l.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
                        String(l.id).includes(search);
    const matchQuality = !qualityFilter || l.lead_quality === qualityFilter;
    return matchSearch && matchQuality;
  });

  const allVisible = filteredLeads.length > 0 && filteredLeads.every(l => selectedLeads.includes(l.id));
  const isBulkMode = selectedLeads.length > 0;

  const handleAllocate = async () => {
    const ids = focusedLead ? [focusedLead.id] : selectedLeads;
    if (!ids.length || !assignTo) return;
    setMessage(null);
    try {
      await OnlineLeadService.allocate({ lead_ids: ids, agent_id: Number(assignTo) });
      setMessage({ type: 'success', text: `${ids.length} lead(s) allocated successfully.` });
      setSelectedLeads([]);
      setFocusedLead(null);
      setAssignTo('');
      fetchLeads();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Allocation failed.' });
    }
  };

  const qualityBadge = (q) => {
    const map = { HIGH: 'bg-green-100 text-green-700', MEDIUM: 'bg-yellow-100 text-yellow-700', LOW: 'bg-red-100 text-red-700' };
    return map[q] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-200px)] bg-gray-50 p-4 font-sans">

      {/* LEFT: Filters */}
      <aside className="lg:col-span-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" /> Filters
          </h3>
          <button onClick={fetchLeads} className="text-xs text-indigo-600 flex items-center gap-1 hover:underline">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search leads…" />
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lead Quality</label>
          <div className="mt-2 space-y-2">
            {['HIGH', 'MEDIUM', 'LOW'].map(q => (
              <label key={q} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={qualityFilter === q}
                  onChange={() => setQualityFilter(prev => prev === q ? '' : q)}
                  className="rounded text-indigo-600 border-gray-300" />
                {q.charAt(0) + q.slice(1).toLowerCase()} Quality
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* MIDDLE: Lead List */}
      <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => allVisible ? setSelectedLeads([]) : setSelectedLeads(filteredLeads.map(l => l.id))}>
              {allVisible ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />}
            </button>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Unallocated Leads</span>
          </div>
          {isBulkMode && (
            <span className="text-[11px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
              {selectedLeads.length} Selected
            </span>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-10 text-center text-gray-400 text-sm">Loading leads…</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm italic">No unallocated leads found.</div>
          ) : filteredLeads.map(lead => (
            <div key={lead.id} onClick={() => setFocusedLead(lead)}
              className={`p-4 border-b border-gray-50 transition-all cursor-pointer flex items-start space-x-3 border-l-4 ${focusedLead?.id === lead.id ? 'bg-indigo-50 border-l-indigo-600' : 'hover:bg-gray-50 border-l-transparent'}`}
            >
              <div onClick={e => { e.stopPropagation(); setSelectedLeads(prev => prev.includes(lead.id) ? prev.filter(i => i !== lead.id) : [...prev, lead.id]); }}>
                {selectedLeads.includes(lead.id) ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{lead.contact_name}</p>
                <p className="text-[11px] text-gray-500">{lead.product} • {lead.online_source}</p>
                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${qualityBadge(lead.lead_quality)}`}>
                  {lead.lead_quality}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Allocation */}
      <div className="lg:col-span-4 h-full overflow-hidden">
        {!focusedLead && !isBulkMode ? (
          <div className="h-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center text-gray-400">
            <UserPlus className="w-12 h-12 mb-2 opacity-20" />
            <p className="max-w-[200px] text-sm">Use checkboxes to bulk assign or click a lead for details</p>
          </div>
        ) : (
          <aside className="h-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              {focusedLead ? (
                <>
                  <button onClick={() => setFocusedLead(null)} className="p-1 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${qualityBadge(focusedLead.lead_quality)} uppercase`}>
                    {focusedLead.lead_quality} Quality
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold text-gray-900 text-sm">Bulk Assignment ({selectedLeads.length})</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {message.text}
                </div>
              )}

              {focusedLead && (
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold text-white">
                    {focusedLead.contact_name?.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{focusedLead.contact_name}</h2>
                  <p className="text-xs text-gray-400">{focusedLead.online_source} • #{focusedLead.id}</p>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-[9px] font-bold text-gray-500 uppercase">Phone</p>
                      <p className="text-xs font-semibold flex items-center gap-1"><Phone className="w-3 h-3" />{focusedLead.contact_phone}</p>
                    </div>
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-[9px] font-bold text-gray-500 uppercase">Email</p>
                      <p className="text-xs font-semibold truncate flex items-center gap-1"><Mail className="w-3 h-3" />{focusedLead.contact_email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Allocation Settings</h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Assign to Agent</label>
                  <select value={assignTo} onChange={e => setAssignTo(e.target.value)}
                    className="w-full mt-1.5 p-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Agent…</option>
                    {DUMMY_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={handleAllocate} disabled={!assignTo}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-30 transition-all"
              >
                {focusedLead ? 'Confirm Allocation' : `Bulk Allocate ${selectedLeads.length} Leads`}
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default OnlineAllocateData;