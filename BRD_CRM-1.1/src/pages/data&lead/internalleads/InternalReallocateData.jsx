import React, { useState, useEffect } from 'react';
import {
  Users, Award, RefreshCw, Filter, Search,
  CheckSquare, Square, ArrowLeft, Trash2
} from 'lucide-react';
import { InternalLeadService } from '../../../services/dataAndLeads.service';

const DUMMY_AGENTS = [
  { id: 1, name: "Agent A" },
  { id: 2, name: "Agent B" },
  { id: 3, name: "Agent C" },
  { id: 4, name: "Agent D" },
];

const InternalReallocateData = () => {
  const [leads,         setLeads]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [filterAgent,   setFilterAgent]   = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [focusedLead,   setFocusedLead]   = useState(null);
  const [reassignTo,    setReassignTo]    = useState('');
  const [reallocating,  setReallocating]  = useState(false);
  const [result,        setResult]        = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await InternalLeadService.list({ page_size: 500 });
      const all = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      // Only show leads that have been assigned
      setLeads(all.filter(l => l.assigned_to));
    } catch (err) {
      console.error('Fetch failed:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filteredLeads = leads.filter(lead => {
    const q = search.toLowerCase();
    const matchesSearch = lead.contact_name?.toLowerCase().includes(q) || String(lead.id).includes(q);
    const matchesAgent = !filterAgent || String(lead.assigned_to) === filterAgent;
    return matchesSearch && matchesAgent;
  });

  const isBulkMode = selectedLeads.length > 0;
  const allVisibleSelected = filteredLeads.length > 0 && filteredLeads.every(l => selectedLeads.includes(l.id));

  const toggleSelectAll = () =>
    setSelectedLeads(allVisibleSelected ? [] : filteredLeads.map(l => l.id));

  const toggleLead = (id, e) => {
    e?.stopPropagation();
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const handleReallocate = async () => {
    if (!reassignTo) return;
    setReallocating(true);
    setResult(null);
    try {
      if (focusedLead) {
        await InternalLeadService.reallocate(focusedLead.id, { agent_id: Number(reassignTo) });
        setResult({ ok: true, msg: `Lead reallocated successfully!` });
        setFocusedLead(null);
      } else {
        // Bulk — reallocate each
        await Promise.all(
          selectedLeads.map(id => InternalLeadService.reallocate(id, { agent_id: Number(reassignTo) }))
        );
        setResult({ ok: true, msg: `${selectedLeads.length} leads reallocated successfully!` });
        setSelectedLeads([]);
      }
      setReassignTo('');
      await fetchLeads();
    } catch (err) {
      const msg = err.response?.data?.error || JSON.stringify(err.response?.data) || "Reallocation failed.";
      setResult({ ok: false, msg });
    } finally {
      setReallocating(false);
    }
  };

  const agentName = (id) => DUMMY_AGENTS.find(a => a.id === id)?.name || `Agent #${id}`;
  const qualityBadge = (q) => {
    const map = { HIGH: 'bg-green-100 text-green-700', MEDIUM: 'bg-yellow-100 text-yellow-700', LOW: 'bg-gray-100 text-gray-600' };
    return map[q] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-200px)] bg-gray-50 p-4">

      {/* Filters */}
      <aside className="lg:col-span-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" /> Filter by Agent
          </h3>
          <button onClick={fetchLeads} className="text-indigo-600 text-xs hover:underline flex items-center gap-1">
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
          <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)}
            className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none">
            <option value="">All Agents</option>
            {DUMMY_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </aside>

      {/* Lead list */}
      <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {result && (
          <div className={`p-3 text-sm font-medium border-b ${result.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
            {result.msg}
          </div>
        )}
        <div className="p-4 border-b border-gray-100 bg-orange-50/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={toggleSelectAll}>
              {allVisibleSelected
                ? <CheckSquare className="w-5 h-5 text-indigo-600" />
                : <Square className="w-5 h-5 text-gray-300" />}
            </button>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              {loading ? 'Loading…' : `${filteredLeads.length} Allocated Leads`}
            </span>
          </div>
          {isBulkMode && (
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
              {selectedLeads.length} Selected
            </span>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm italic">No allocated leads found.</div>
          ) : filteredLeads.map(lead => (
            <div key={lead.id} onClick={() => setFocusedLead(lead)}
              className={`p-4 border-b border-gray-50 cursor-pointer flex items-start space-x-3 transition-all ${
                focusedLead?.id === lead.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
              }`}>
              <div onClick={e => toggleLead(lead.id, e)}>
                {selectedLeads.includes(lead.id)
                  ? <CheckSquare className="w-5 h-5 text-indigo-600" />
                  : <Square className="w-5 h-5 text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-gray-900 text-sm">{lead.contact_name}</p>
                  <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded">
                    {agentName(lead.assigned_to)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Award className="w-3 h-3 text-indigo-500" />
                  {lead.product} • {lead.internal_source}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${qualityBadge(lead.lead_quality)}`}>
                  {lead.lead_quality}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reallocation panel */}
      <div className="lg:col-span-4 h-full">
        {!focusedLead && !isBulkMode ? (
          <div className="h-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center text-gray-400">
            <RefreshCw className="w-12 h-12 mb-2 opacity-20" />
            <p className="max-w-[200px] text-sm">Select leads to change ownership</p>
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
                  <Users className="w-5 h-5 text-indigo-500" />
                  <span className="font-bold text-gray-900 text-sm">Bulk Reassign ({selectedLeads.length})</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {focusedLead && (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white">
                    {focusedLead.contact_name?.charAt(0)}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{focusedLead.contact_name}</h2>
                  <p className="text-xs text-gray-400 uppercase font-bold">Currently: {agentName(focusedLead.assigned_to)}</p>
                  {focusedLead.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2 italic">"{focusedLead.notes}"</p>
                  )}
                </div>
              )}

              <div className="p-4 bg-indigo-50 rounded-xl border border-orange-100 space-y-3">
                <h4 className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                  <RefreshCw className="w-3 h-3" /> New Assignment
                </h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Transfer To Agent</label>
                  <select value={reassignTo} onChange={e => setReassignTo(e.target.value)}
                    className="w-full mt-1.5 p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="">Select New Owner…</option>
                    {DUMMY_AGENTS.filter(a => !focusedLead || String(a.id) !== String(focusedLead.assigned_to)).map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleReallocate} disabled={!reassignTo || reallocating}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-30 transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {reallocating ? 'Reallocating…' : 'Confirm Reallocation'}
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default InternalReallocateData;

