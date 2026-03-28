import { useEffect, useState } from "react";
import { UserPlus, RefreshCw } from "lucide-react";
import CampaignLeadAPI from "../../../services/campaignLeads.service";

// ── Dummy agents until backend auth/users is built ──
const DUMMY_AGENTS = [
  { id: 1, name: "Agent A" },
  { id: 2, name: "Agent B" },
  { id: 3, name: "Agent C" },
  { id: 4, name: "Agent D" },
];

const AllocateData = () => {
  const [leads,         setLeads]         = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedUser,  setSelectedUser]  = useState("");
  const [loading,       setLoading]       = useState(true);
  const [allocating,    setAllocating]    = useState(false);
  const [result,        setResult]        = useState(null);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await CampaignLeadAPI.unassigned();
      const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch unassigned leads:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleLead = (id) =>
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelectedLeads(selectedLeads.length === leads.length ? [] : leads.map(l => l.id));

  const handleAllocate = async () => {
    if (!selectedUser || selectedLeads.length === 0) return;
    setAllocating(true);
    setResult(null);
    try {
      const res = await CampaignLeadAPI.allocate({
        user_id:  Number(selectedUser),
        lead_ids: selectedLeads,
      });
      setResult({ ok: true, msg: res.data?.message || "Leads allocated successfully!" });
      setSelectedLeads([]);
      setSelectedUser("");
      await fetchLeads();
    } catch (err) {
      const msg = err.response?.data?.error || JSON.stringify(err.response?.data) || "Allocation failed.";
      setResult({ ok: false, msg });
    } finally {
      setAllocating(false);
    }
  };

  const isDisabled = !selectedUser || selectedLeads.length === 0 || allocating;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Allocate Unassigned Leads</h2>
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
          <label className="text-sm font-medium text-gray-700">
            Assign To <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:border-indigo-500 outline-none"
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
          >
            <option value="">Select agent</option>
            {DUMMY_AGENTS.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm text-indigo-700 font-medium">
            {selectedLeads.length} of {leads.length} leads selected
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-400 text-sm">Loading unassigned leads…</div>
      ) : leads.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">
          No unassigned leads. All leads have been allocated.
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
            <input type="checkbox" checked={selectedLeads.length === leads.length && leads.length > 0}
              onChange={toggleAll} className="w-4 h-4 accent-indigo-600" />
            <span className="text-sm font-medium text-gray-600">Select All</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {leads.map(lead => (
              <div key={lead.id}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedLeads.includes(lead.id) ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleLead(lead.id)}
              >
                <div className="flex items-start gap-4">
                  <input type="checkbox" checked={selectedLeads.includes(lead.id)}
                    onChange={() => toggleLead(lead.id)} onClick={e => e.stopPropagation()}
                    className="w-4 h-4 accent-indigo-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{lead.contact_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{lead.lead_source} • {lead.product}</p>
                    <p className="text-xs text-gray-400">{lead.contact_phone}</p>
                  </div>
                </div>
                <StatusBadge status={lead.lead_status} />
              </div>
            ))}
          </div>
        </>
      )}

      <button onClick={handleAllocate} disabled={isDisabled}
        className={`w-full py-3 rounded-xl font-medium flex justify-center items-center gap-2 transition-all ${
          isDisabled ? "bg-indigo-200 text-white cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
        }`}
      >
        <UserPlus size={18} />
        {allocating ? "Allocating…" : `Allocate ${selectedLeads.length} Lead(s)`}
      </button>
    </div>
  );
};

function StatusBadge({ status }) {
  const map = { RAW: "bg-gray-100 text-gray-700", QUALIFIED: "bg-indigo-100 text-indigo-700", HOT: "bg-orange-100 text-orange-700" };
  return <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${map[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

export default AllocateData;
