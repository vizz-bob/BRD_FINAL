// AllData.jsx — integrated with /data_lead/used-leads/all_data/ + reactivate via reallocate
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  ArrowRight,
  Calendar,
  Activity,
} from "lucide-react";
import { UsedLeadService } from "../../../services/dataAndLeads.service";
import ReallocateData from "./ReallocateData";

/* ─── Toast ────────────────────────────────────────── */
const Toast = ({ msg, type, onClose }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium
      ${type === "success"
        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
        : "bg-red-50 border-red-200 text-red-800"
      }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
    )}
    <span>{msg}</span>
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">✕</button>
  </div>
);

/* ─── Status / Outcome badges ──────────────────────── */
const Badge = ({ value, variant = "default" }) => {
  const maps = {
    Converted:     "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    coverted:      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    "Follow-up":   "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    "follow up":   "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    Lost:          "bg-red-50 text-red-700 ring-1 ring-red-200",
    LOST:          "bg-red-50 text-red-700 ring-1 ring-red-200",
    Dead:          "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
    dead:          "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
    "In Progress": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    "in progress": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    Won:           "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300",
    won:           "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300",
  };
  const cls = maps[value] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {value ?? "—"}
    </span>
  );
};

/* ─── Lead Journey Timeline ────────────────────────── */
const Timeline = ({ events }) => {
  if (!events?.length) {
    return (
      <p className="text-sm text-gray-400 py-8 text-center">
        No journey events recorded for this lead.
      </p>
    );
  }
  const typeIcon = {
    call:    "📞",
    email:   "✉️",
    meeting: "🤝",
    success: "🎉",
  };
  return (
    <ol className="relative border-l border-gray-200 space-y-6 ml-3">
      {events.map((ev, i) => (
        <li key={i} className="ml-6">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-indigo-300 text-xs">
            {typeIcon[ev.type] ?? "•"}
          </span>
          <p className="text-xs text-gray-400 mb-0.5">{ev.date} · {ev.agent}</p>
          <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
          <p className="text-sm text-gray-600">{ev.description}</p>
        </li>
      ))}
    </ol>
  );
};

/* ─── Stat Card ─────────────────────────────────────── */
const StatCard = ({ label, value, accent }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 p-4 shadow-sm`}>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${accent ?? "text-gray-900"}`}>{value}</p>
  </div>
);

/* ─── Main Component ────────────────────────────────── */
const isAdmin = true; // replace with real auth context

const isLocked = (lead) =>
  ["won", "dead", "lost"].includes((lead.outcome ?? "").toLowerCase()) ||
  ["converted", "coverted"].includes((lead.status ?? "").toLowerCase());

const AllData = () => {
  const [leads, setLeads]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState(null);
  const [searchTerm, setSearchTerm]   = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const [filterAgent, setFilterAgent]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOutcome, setFilterOutcome] = useState("all");
  const [selectedLead, setSelectedLead]   = useState(null);
  const [reallocateLead, setReallocateLead] = useState(null);
  const [reactivating, setReactivating]   = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── fetch ── */
  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await UsedLeadService.allData();
      const data = Array.isArray(res.data) ? res.data : res.data.results ?? [];
      setLeads(data);
    } catch (err) {
      showToast("Failed to load leads: " + (err.response?.data?.error ?? err.message), "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLeads(); }, [loadLeads]);

  /* ── reactivate: reallocate with a system reason ── */
  const handleReactivate = async (lead) => {
    setReactivating(lead.id);
    try {
      /* Backend: POST /used-leads/:id/reallocate/ with same agent but reason = reactivation */
      await UsedLeadService.reallocate(lead.id, {
        agent_id: lead.allocated_to?.id ?? lead.allocated_to ?? 0,
        reason: "Reactivated from terminal state",
      });
      showToast(`Lead #${lead.id} reactivated.`);
      loadLeads();
    } catch (err) {
      showToast("Reactivation failed: " + (err.response?.data?.error ?? err.message), "error");
    } finally {
      setReactivating(null);
    }
  };

  /* ── helpers ── */
  const getName   = (l) => l.lead_object?.contact_name  ?? l.contact_name  ?? `Lead #${l.id}`;
  const getAgent  = (l) => l.allocated_to?.username      ?? l.agent         ?? "—";
  const getSource = (l) => l.Source ?? l.source ?? "—";
  const getAge    = (l) => {
    if (!l.created_at) return "—";
    return Math.floor((Date.now() - new Date(l.created_at)) / 86400000) + "d";
  };
  const getStatus  = (l) => l.status  ?? "—";
  const getOutcome = (l) => l.outcome ?? "—";

  /* ── unique filter options ── */
  const sources  = [...new Set(leads.map(getSource).filter(Boolean))];
  const agents   = [...new Set(leads.map(getAgent).filter((a) => a !== "—"))];
  const statuses = [...new Set(leads.map(getStatus).filter((s) => s !== "—"))];
  const outcomes = [...new Set(leads.map(getOutcome).filter((o) => o !== "—"))];

  /* ── filtered ── */
  const filtered = useMemo(() => leads.filter((l) => {
    if (filterSource !== "all" && getSource(l) !== filterSource) return false;
    if (filterAgent  !== "all" && getAgent(l)  !== filterAgent)  return false;
    if (filterStatus !== "all" && getStatus(l) !== filterStatus) return false;
    if (filterOutcome !== "all" && getOutcome(l) !== filterOutcome) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const n = getName(l).toLowerCase();
      const a = getAgent(l).toLowerCase();
      const id = String(l.id);
      if (!n.includes(q) && !a.includes(q) && !id.includes(q)) return false;
    }
    return true;
  }), [leads, filterSource, filterAgent, filterStatus, filterOutcome, searchTerm]);

  /* ── stats ── */
  const stats = useMemo(() => ({
    total:  leads.length,
    active: leads.filter((l) => !isLocked(l)).length,
    locked: leads.filter((l) => isLocked(l)).length,
    avgAge: leads.length
      ? Math.round(
          leads.reduce((s, l) => {
            if (!l.created_at) return s;
            return s + Math.floor((Date.now() - new Date(l.created_at)) / 86400000);
          }, 0) / leads.length
        )
      : 0,
  }), [leads]);

  /* ── placeholder journey ── */
  const buildJourney = (lead) => {
    const events = [];
    if (lead.created_at) {
      events.push({
        date: lead.created_at?.slice(0, 10),
        type: "call",
        title: "Lead Created",
        description: `Lead was created from ${getSource(lead)} source.`,
        agent: getAgent(lead),
      });
    }
    if (lead.last_contacted_at) {
      events.push({
        date: lead.last_contacted_at?.slice(0, 10),
        type: "call",
        title: "Last Contact",
        description: "Last recorded contact with the lead.",
        agent: getAgent(lead),
      });
    }
    if (lead.last_follow_up) {
      events.push({
        date: lead.last_follow_up?.slice(0, 10),
        type: "meeting",
        title: "Follow-up",
        description: "Follow-up activity recorded.",
        agent: getAgent(lead),
      });
    }
    if (isLocked(lead)) {
      events.push({
        date: lead.updated_at?.slice(0, 10) ?? "—",
        type: "success",
        title: `Outcome: ${getOutcome(lead)}`,
        description: `Lead was marked as ${getOutcome(lead)}.`,
        agent: getAgent(lead),
      });
    }
    return events;
  };

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Leads"   value={stats.total}          />
        <StatCard label="Active"        value={stats.active}   accent="text-indigo-600" />
        <StatCard label="Locked"        value={stats.locked}   accent="text-red-500"    />
        <StatCard label="Avg Lead Age"  value={`${stats.avgAge}d`}   />
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID, name, agent…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          {/* Source */}
          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            <option value="all">All Sources</option>
            {sources.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {/* Agent */}
          <select value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            <option value="all">All Agents</option>
            {agents.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          {/* Status */}
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            <option value="all">All Status</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {/* Outcome */}
          <select value={filterOutcome} onChange={(e) => setFilterOutcome(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            <option value="all">All Outcomes</option>
            {outcomes.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">
            {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={loadLeads}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-16 text-sm text-gray-400">No leads match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["ID", "Name", "Agent", "Source", "Status", "Outcome", "Age", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((lead) => {
                  const locked = isLocked(lead);
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">#{lead.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{getName(lead)}</td>
                      <td className="px-4 py-3 text-gray-600">{getAgent(lead)}</td>
                      <td className="px-4 py-3 text-gray-500">{getSource(lead)}</td>
                      <td className="px-4 py-3"><Badge value={getStatus(lead)} /></td>
                      <td className="px-4 py-3"><Badge value={getOutcome(lead)} /></td>
                      <td className="px-4 py-3 text-gray-500">{getAge(lead)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* View journey */}
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          {/* Reallocate — only if not locked */}
                          {!locked && (
                            <button
                              onClick={() => setReallocateLead(lead)}
                              className="px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition"
                            >
                              Reallocate
                            </button>
                          )}
                          {/* Reactivate — locked + admin */}
                          {locked && isAdmin && (
                            <button
                              onClick={() => handleReactivate(lead)}
                              disabled={reactivating === lead.id}
                              className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs hover:bg-amber-100 transition disabled:opacity-50"
                            >
                              {reactivating === lead.id
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : null}
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Journey Modal ── */}
      {selectedLead && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-base font-semibold text-gray-900">Lead Journey</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {getName(selectedLead)} · <span className="font-mono">#{selectedLead.id}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Timeline events={buildJourney(selectedLead)} />
          </div>
        </div>
      )}

      {/* ── Reallocate Modal ── */}
      {reallocateLead && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full md:max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-semibold text-gray-900">
                Reallocate Lead <span className="font-mono text-indigo-600">#{reallocateLead.id}</span>
              </p>
              <button
                onClick={() => setReallocateLead(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ReallocateData
              initialLead={reallocateLead}
              onBack={() => {
                setReallocateLead(null);
                loadLeads();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllData;
