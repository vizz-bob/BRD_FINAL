import { useState, useEffect } from "react";
import { RefreshCcw, Users, RefreshCw } from "lucide-react";
import CampaignLeadAPI from "../../../services/campaignLeads.service";

// ── Dummy agents until backend auth/users is built ──
const DUMMY_AGENTS = [
  { id: 1, name: "Agent A" },
  { id: 2, name: "Agent B" },
  { id: 3, name: "Agent C" },
  { id: 4, name: "Agent D" },
];

const ReallocateData = () => {
  const [leads,         setLeads]         = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [fromAgentId,   setFromAgentId]   = useState("");
  const [toAgentId,     setToAgentId]     = useState("");
  const [loading,       setLoading]       = useState(true);
  const [reallocating,  setReallocating]  = useState(false);
  const [result,        setResult]        = useState(null);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await CampaignLeadAPI.list({ page_size: 1000 });
      const all = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      // Only show leads that have assigned users
      setLeads(all.filter(l => l.assigned_users && l.assigned_users.length > 0));
    } catch (err) {
      console.error("Fetch failed:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter by fromAgent if selected (matches by agent id in assigned_users array)
  const filteredLeads = fromAgentId
    ? leads.filter(l => Array.isArray(l.assigned_users) && l.assigned_users.includes(Number(fromAgentId)))
    : leads;

  const toggleLead = (id) =>
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelectedLeads(selectedLeads.length === filteredLeads.length ? [] : filteredLeads.map(l => l.id));

  const handleReallocate = async () => {
    if (!toAgentId || selectedLeads.length === 0) return;
    setReallocating(true);
    setResult(null);
    try {
      const payload = { to_user_id: Number(toAgentId), lead_ids: selectedLeads };
      if (fromAgentId) payload.from_user_id = Number(fromAgentId);
      const res = await CampaignLeadAPI.reallocate(payload);
      setResult({ ok: true, msg: res.data?.message || "Leads reallocated successfully!" });
      setSelectedLeads([]);
      setToAgentId("");
      await fetchLeads();
    } catch (err) {
      const msg = err.response?.data?.error || JSON.stringify(err.response?.data) || "Reallocation failed.";
      setResult({ ok: false, msg });
    } finally {
      setReallocating(false);
    }
  };

  const isDisabled = !toAgentId || selectedLeads.length === 0 || reallocating;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Reallocate Assigned Leads</h2>
        <button onClick={fetchLeads} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {result && (
        <div className={`rounded-xl p-3 border text-sm font-medium ${result.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          {result.msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Filter by Current Assigned Agent</label>
          <select
            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:border-indigo-500 outline-none"
            value={fromAgentId}
            onChange={e => { setFromAgentId(e.target.value); setSelectedLeads([]); }}
          >
            <option value="">All assigned agents</option>
            {DUMMY_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Reassign To <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:border-indigo-500 outline-none"
            value={toAgentId}
            onChange={e => setToAgentId(e.target.value)}
          >
            <option value="">Select new agent</option>
            {DUMMY_AGENTS.filter(a => String(a.id) !== fromAgentId).map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-400 text-sm">Loading assigned leads…</div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">
          {fromAgentId ? "No leads assigned to this agent." : "No assigned leads found."}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
            <input type="checkbox"
              checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
              onChange={toggleAll} className="w-4 h-4 accent-indigo-600" />
            <span className="text-sm font-medium text-gray-600">Select All ({filteredLeads.length} leads)</span>
            {selectedLeads.length > 0 && (
              <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                {selectedLeads.length} selected
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {filteredLeads.map(lead => (
              <div key={lead.id}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedLeads.includes(lead.id) ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleLead(lead.id)}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <input type="checkbox" checked={selectedLeads.includes(lead.id)}
                    onChange={() => toggleLead(lead.id)} onClick={e => e.stopPropagation()}
                    className="w-4 h-4 accent-indigo-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{lead.contact_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{lead.lead_source} • {lead.product}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Assigned users: {lead.assigned_users?.join(", ") || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <StatusBadge status={lead.lead_status} />
                  <Users className="text-gray-400" size={16} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <button onClick={handleReallocate} disabled={isDisabled}
        className={`w-full py-3 rounded-xl font-medium flex justify-center items-center gap-2 transition-all ${
          isDisabled ? "bg-indigo-200 text-white cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
        }`}
      >
        <RefreshCcw size={18} />
        {reallocating ? "Reallocating…" : `Reallocate ${selectedLeads.length} Lead(s)`}
      </button>
    </div>
  );
};

function StatusBadge({ status }) {
  const map = { RAW: "bg-gray-100 text-gray-700", QUALIFIED: "bg-indigo-100 text-indigo-700", HOT: "bg-orange-100 text-orange-700" };
  return <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${map[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

export default ReallocateData;
