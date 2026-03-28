import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, Award, TrendingUp, UserPlus, RefreshCw,
  Filter, Search, Square, AlertCircle, Calendar, Phone, Mail,
  ArrowLeft, Trash2, CheckSquare
} from 'lucide-react';
import { InternalLeadService } from '../../../services/dataAndLeads.service';

// Dummy agents — replace with real API when auth is ready
const DUMMY_AGENTS = [
  { id: 1, name: "Agent A" },
  { id: 2, name: "Agent B" },
  { id: 3, name: "Agent C" },
  { id: 4, name: "Agent D" },
];
const PRODUCTS = ['Home Loan', 'Personal Loan', 'Car Loan', 'Business Loan'];
const DEPARTMENTS = ['Sales', 'HR', 'Operations', 'Marketing'];

const InternalAllocateData = () => {
  const [leads,          setLeads]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState('');
  const [selectedDepts,  setSelectedDepts]  = useState([]);
  const [priorityOnly,   setPriorityOnly]   = useState(false);
  const [selectedLeads,  setSelectedLeads]  = useState([]);
  const [focusedLead,    setFocusedLead]    = useState(null);
  const [assignTo,       setAssignTo]       = useState('');
  const [allocating,     setAllocating]     = useState(false);
  const [result,         setResult]         = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Fetch leads without an assigned_to (unallocated)
      const res = await InternalLeadService.list({ page_size: 500 });
      const all = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      // Show only unassigned leads
      setLeads(all.filter(l => !l.assigned_to));
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
    const matchesSearch = lead.contact_name?.toLowerCase().includes(q) ||
      lead.internal_lead_id?.toLowerCase().includes(q) ||
      String(lead.id).includes(q);
    const matchesDept = selectedDepts.length === 0 ||
      selectedDepts.some(d => lead.internal_source?.includes(d));
    const matchesPriority = !priorityOnly || lead.lead_quality === 'HIGH';
    return matchesSearch && matchesDept && matchesPriority;
  });

  const isBulkMode = selectedLeads.length > 0;
  const allVisibleSelected = filteredLeads.length > 0 && filteredLeads.every(l => selectedLeads.includes(l.id));

  const toggleSelectAll = () =>
    setSelectedLeads(allVisibleSelected ? [] : filteredLeads.map(l => l.id));

  const toggleLead = (id, e) => {
    e?.stopPropagation();
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const handleAllocate = async () => {
    if (!assignTo) return;
    const leadIds = focusedLead ? [focusedLead.id] : selectedLeads;
    if (leadIds.length === 0) return;
    setAllocating(true);
    setResult(null);
    try {
      await InternalLeadService.allocate({ lead_ids: leadIds, agent_id: Number(assignTo) });
      setResult({ ok: true, msg: `${leadIds.length} lead(s) allocated successfully!` });
      setSelectedLeads([]);
      setFocusedLead(null);
      setAssignTo('');
      await fetchLeads();
    } catch (err) {
      const msg = err.response?.data?.error || JSON.stringify(err.response?.data) || "Allocation failed.";
      setResult({ ok: false, msg });
    } finally {
      setAllocating(false);
    }
  };

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
            <Filter className="w-4 h-4 text-indigo-600" /> Filters
          </h3>
          <button onClick={fetchLeads} className="text-indigo-600 text-xs hover:underline flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search leads..." />
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Source / Department</label>
          <div className="mt-2 space-y-2">
            {DEPARTMENTS.map(dept => (
              <label key={dept} className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={selectedDepts.includes(dept)}
                  onChange={() => setSelectedDepts(prev => prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept])}
                  className="rounded text-indigo-600" />
                <span>{dept}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={priorityOnly} onChange={e => setPriorityOnly(e.target.checked)}
              className="rounded text-indigo-600" />
            <span>High Quality Only</span>
          </label>
        </div>
      </aside>

      {/* Lead list */}
      <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {result && (
          <div className={`p-3 text-sm font-medium border-b ${result.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
            {result.msg}
          </div>
        )}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={toggleSelectAll}>
              {allVisibleSelected
                ? <CheckSquare className="w-5 h-5 text-indigo-600" />
                : <Square className="w-5 h-5 text-gray-300" />}
            </button>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              {loading ? 'Loading…' : `${filteredLeads.length} Unallocated`}
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
            <div className="p-10 text-center text-gray-400 text-sm">Loading internal leads…</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm italic">No unallocated leads found.</div>
          ) : filteredLeads.map(lead => (
            <div key={lead.id} onClick={() => setFocusedLead(lead)}
              className={`p-4 border-b border-gray-50 cursor-pointer flex items-start space-x-3 transition-all ${
                focusedLead?.id === lead.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
              }`}>
              <div onClick={e => toggleLead(lead.id, e)}>
                {selectedLeads.includes(lead.id)
                  ? <CheckSquare className="w-5 h-5 text-indigo-600" />
                  : <Square className="w-5 h-5 text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{lead.contact_name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Award className="w-3 h-3 text-indigo-500" />
                  {lead.product} • {lead.internal_source}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{lead.contact_phone}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${qualityBadge(lead.lead_quality)}`}>
                {lead.lead_quality}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail / Allocate panel */}
      <div className="lg:col-span-4 h-full overflow-hidden">
        {!focusedLead && !isBulkMode ? (
          <div className="h-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center text-gray-400">
            <UserPlus className="w-12 h-12 mb-2 opacity-20" />
            <p className="max-w-[200px] text-sm">Select leads or click one for allocation details</p>
          </div>
        ) : (
          <aside className="h-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              {focusedLead ? (
                <>
                  <button onClick={() => setFocusedLead(null)} className="p-1 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${qualityBadge(focusedLead.lead_quality)}`}>
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
              {focusedLead && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl font-bold text-white">
                      {focusedLead.contact_name?.charAt(0)}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">{focusedLead.contact_name}</h2>
                    <p className="text-xs text-gray-400">{focusedLead.internal_source} • #{focusedLead.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-[9px] font-bold text-gray-500 uppercase">Phone</p>
                      <p className="text-xs font-semibold flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" />{focusedLead.contact_phone}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-[9px] font-bold text-gray-500 uppercase">Product</p>
                      <p className="text-xs font-semibold">{focusedLead.product}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg col-span-2">
                      <p className="text-[9px] font-bold text-gray-500 uppercase">Email</p>
                      <p className="text-xs font-semibold truncate flex items-center gap-1"><Mail className="w-3 h-3 text-gray-400" />{focusedLead.contact_email}</p>
                    </div>
                  </div>
                  {focusedLead.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 italic">"{focusedLead.notes}"</p>
                  )}
                </div>
              )}

              {/* Allocation settings */}
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 space-y-3">
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Allocation Settings</h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Assign to Agent</label>
                  <select value={assignTo} onChange={e => setAssignTo(e.target.value)}
                    className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select agent…</option>
                    {DUMMY_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              {(!assignTo) && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-xs font-bold border border-amber-100">
                  <AlertCircle className="w-4 h-4 shrink-0" /> SELECT AGENT TO PROCEED
                </div>
              )}

              <button onClick={handleAllocate} disabled={!assignTo || allocating}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-30 transition-all active:scale-[0.98]">
                {allocating ? 'Allocating…' : focusedLead ? 'Confirm Allocation' : `Bulk Allocate ${selectedLeads.length} Lead(s)`}
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default InternalAllocateData;
