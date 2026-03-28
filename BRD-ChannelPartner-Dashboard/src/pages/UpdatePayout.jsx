import React, { useState, useMemo, useEffect } from "react";
import "./UpdatePayout.css";
import {
  getPayoutAgents,
  createPayoutAgent,
  updatePayoutAgent,
  getPayoutDashboard,
  createPayoutSearch,
} from "../services/UpdatePayoutService";

/* ── Mode maps ────────────────────────────────────────────────────────── */
const MODE_LABEL_TO_API = {
  "Bank Transfer": "bank_transfer",
  "UPI":           "upi",
  "Cheque":        "cheque",
  "NEFT/RTGS":     "neft/rtgs",
};
const MODE_API_TO_LABEL = Object.fromEntries(
  Object.entries(MODE_LABEL_TO_API).map(([k, v]) => [v, k])
);

const payoutModes = ["Bank Transfer", "UPI", "Cheque", "NEFT/RTGS"];

const typeColors = {
  "dsa":          { bg: "#dbeafe", color: "#2563eb", label: "DSA" },
  "broker":       { bg: "#fef9c3", color: "#b45309", label: "Broker" },
  "lead_partner": { bg: "#dcfce7", color: "#16a34a", label: "Lead Partner" },
};

/* ── API → UI shape ───────────────────────────────────────────────────── */
// Each row = one agent record from GET /api/update/agents/
// The backend object carries BOTH identity fields (agent, type) AND payout config.
function apiToUi(raw) {
  return {
    // Identity
    id:        String(raw.id),          // numeric DB pk → string key
    name:      raw.agent ?? `Agent #${raw.id}`,
    type:      raw.type ?? "dsa",       // e.g. "dsa", "broker", "lead_partner"
    // Payout config — preserve numbers as-is; only fall back to "" when null/undefined
    flatFee:      raw.flat_fee        != null ? raw.flat_fee        : "",
    percentRate:  raw.percentage_rate != null ? raw.percentage_rate : "",
    minPayout:    raw.min_amount      != null ? raw.min_amount      : "",
    maxPayout:    raw.max_amount      != null ? raw.max_amount      : "",
    cycleDay:     String(raw.cycle_day ?? "1"),
    payoutMode:   MODE_API_TO_LABEL[raw.mode] ?? "Bank Transfer",
    bonusThreshold: "",
    bonusAmt:     raw.bonus ?? "",
    active:       raw.status === "active",
    _raw:         raw,                  // keep original for PUT calls
  };
}

/* ── UI draft → API payload ───────────────────────────────────────────── */
function uiToApi(draft) {
  return {
    agent:            draft.name,
    type:             draft.type,
    flat_fee:         draft.flatFee      !== "" ? draft.flatFee      : null,
    percentage_rate:  draft.percentRate  !== "" ? draft.percentRate  : "0",
    min_amount:       draft.minPayout    !== "" ? draft.minPayout    : null,
    max_amount:       draft.maxPayout    !== "" ? draft.maxPayout    : null,
    cycle_day:        parseInt(draft.cycleDay ?? 1, 10),
    mode:             MODE_LABEL_TO_API[draft.payoutMode] ?? "bank_transfer",
    bonus:            draft.bonusAmt     !== "" ? draft.bonusAmt     : null,
    status:           draft.active ? "active" : "off",
    action_edit:      false,
  };
}

/* ── Toast ────────────────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`up-toast up-toast-${type}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      {msg}
    </div>
  );
}

/* ── Stat card ────────────────────────────────────────────────────────── */
function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className={`up-stat up-stat-${color}`}>
      <div className="up-stat-icon">{icon}</div>
      <div className="up-stat-val">{value}</div>
      <div className="up-stat-label">{label}</div>
      {sub && <div className="up-stat-sub">{sub}</div>}
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────── */
export default function UpdatePayout() {
  const [rows,       setRows]       = useState([]);    // all agents from API
  const [loading,    setLoading]    = useState(true);
  const [dashboard,  setDashboard]  = useState(null);
  const [search,     setSearch]     = useState("");
  const [filterType, setFilterType] = useState("All");
  const [editing,    setEditing]    = useState(null);  // row id being edited
  const [draftForm,  setDraftForm]  = useState({});
  const [toast,      setToast]      = useState(null);
  const [saving,     setSaving]     = useState(false);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  /* ── Fetch agents: GET /api/update/agents/ ────────────────────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await getPayoutAgents();
        const list = Array.isArray(res) ? res : (res.results ?? []);
        setRows(list.map(apiToUi));
      } catch (err) {
        console.error("getPayoutAgents failed:", err);
        showToast("Could not load agents from server", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Fetch dashboard: GET /api/update/ ───────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res     = await getPayoutDashboard();
        const records = Array.isArray(res) ? res : (res.results ?? []);
        if (records.length) setDashboard(records[records.length - 1]);
      } catch (err) {
        console.warn("getPayoutDashboard failed:", err.message);
      }
    })();
  }, []);

  /* ── Debounced search log: POST /api/update/search/ ─────────────── */
  useEffect(() => {
    if (!search.trim()) return;
    const timer = setTimeout(async () => {
      try { await createPayoutSearch({ search, type: "dsa" }); } catch (_) {}
    }, 600);
    return () => clearTimeout(timer);
  }, [search]);

  /* ── Derived unique types for filter tabs ─────────────────────────── */
  const uniqueTypes = useMemo(() => {
    const seen = new Set(rows.map((r) => r.type));
    return ["All", ...seen];
  }, [rows]);

  /* ── Filtered rows ────────────────────────────────────────────────── */
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase();
        const matchSearch =
          r.name.toLowerCase().includes(q) ||
          r.id.includes(search);
        const matchType =
          filterType === "All" || r.type === filterType;
        return matchSearch && matchType;
      }),
    [rows, search, filterType]
  );

  /* ── Edit helpers ─────────────────────────────────────────────────── */
  const startEdit  = (id) => { setEditing(id); setDraftForm({ ...rows.find((r) => r.id === id) }); };
  const cancelEdit = ()   => { setEditing(null); setDraftForm({}); };
  const df = (key, val)   => setDraftForm((prev) => ({ ...prev, [key]: val }));

  /* ── Save: PUT /api/update/agents/:id/ or POST /api/update/agents/ ── */
  const saveEdit = async (rowId) => {
    setSaving(true);
    try {
      const payload  = uiToApi(draftForm);
      const existing = rows.find((r) => r.id === rowId);
      let result;

      if (existing?._raw?.id) {
        // Record already exists → update
        result = await updatePayoutAgent(existing._raw.id, payload);
      } else {
        // No server record yet → create
        result = await createPayoutAgent(payload);
      }

      setRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...apiToUi(result), id: rowId } : r))
      );
      setEditing(null);
      showToast(`Payout updated for ${existing?.name}`);
    } catch (err) {
      console.error("saveEdit error:", err);
      showToast("Failed to save payout", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Toggle active/off: PUT /api/update/agents/:id/ ──────────────── */
  const toggleActive = async (rowId) => {
    const row       = rows.find((r) => r.id === rowId);
    const newStatus = row.active ? "off" : "active";

    // Optimistic update
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, active: !r.active } : r))
    );

    try {
      if (row._raw?.id) {
        await updatePayoutAgent(row._raw.id, { ...row._raw, status: newStatus });
      }
      showToast(
        `${row.name} payout ${newStatus === "active" ? "enabled" : "disabled"}`,
        newStatus === "active" ? "success" : "error"
      );
    } catch {
      // Revert on failure
      setRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, active: row.active } : r))
      );
      showToast("Status update failed", "error");
    }
  };

  /* ── Dashboard stats ──────────────────────────────────────────────── */
  // Helper: safely parse any value (string/number/null) to a finite number
  const safeNum = (v) => { const n = parseFloat(v); return isFinite(n) ? n : 0; };

  const totalActive = dashboard?.active_payouts
    ?? rows.filter((r) => r.active).length;

  const avgRate = dashboard?.Avg_rate ?? dashboard?.avg_rate
    ?? (rows.length
      ? (rows.reduce((s, r) => s + safeNum(r.percentRate), 0) / rows.length).toFixed(1)
      : "0.0");

  // max_amount from backend may come as string "50000" or number 50000
  const totalMaxPool = dashboard?.max_pool
    ?? rows.reduce((s, r) => s + safeNum(r.maxPayout), 0);

  const payoutModeCount = dashboard?.payout_modes
    ?? [...new Set(rows.map((r) => r.payoutMode).filter(Boolean))].length;

  /* ── Type label / style helpers ───────────────────────────────────── */
  const typeLabel  = (t) => typeColors[t]?.label ?? t;
  const typeStyle  = (t) => ({ background: typeColors[t]?.bg ?? "#f3f4f6", color: typeColors[t]?.color ?? "#374151" });
  const cycleLabel = (d) => (d === "1" || d === 1) ? "1st" : `${d}th`;

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <div className="up-root">

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="up-header">
        <div className="up-header-left">
          <div className="up-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" /><path d="M6 15h4M14 15h4" />
            </svg>
          </div>
          <div>
            <h1 className="up-title">Update Payout</h1>
            <p className="up-subtitle">Configure payout rules, rates &amp; schedules per agent</p>
          </div>
        </div>
        <div className="up-header-actions">
          <button className="up-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="up-stats-row">
        <StatCard label="Active Payouts"  value={totalActive}  sub={`of ${rows.length} agents`} color="green"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard label="Avg. Rate"       value={`${avgRate}%`} sub="per conversion" color="blue"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
        />
        <StatCard label="Max Pool / mo."  value={totalMaxPool >= 100000 ? `₹${(totalMaxPool / 100000).toFixed(1)}L` : `₹${totalMaxPool.toLocaleString("en-IN")}`} sub="combined cap" color="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>}
        />
        <StatCard label="Payout Modes"    value={payoutModeCount} sub="distinct methods" color="orange"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        />
      </div>

      {/* Main table */}
      <div className="up-main-card">
        <div className="up-toolbar">
          <div className="up-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input placeholder="Search agent…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="up-filters">
            {uniqueTypes.map((t) => (
              <button
                key={t}
                className={`up-filter-btn ${filterType === t ? "active" : ""}`}
                onClick={() => setFilterType(t)}
              >
                {t === "All" ? "All" : typeLabel(t)}
              </button>
            ))}
          </div>
        </div>

        <div className="up-table-wrap">
          {loading ? (
            <div className="up-loading">Loading agents…</div>
          ) : rows.length === 0 ? (
            <div className="up-empty">No agent data returned from server.</div>
          ) : (
            <table className="up-table">
              <thead>
                <tr>
                  <th>Agent</th><th>Type</th><th>Flat Fee (₹)</th>
                  <th>% Rate</th><th>Min / Max (₹)</th><th>Cycle Day</th>
                  <th>Mode</th><th>Bonus</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const isEdit = editing === row.id;
                  return (
                    <tr key={row.id} className={isEdit ? "row-editing" : ""}>

                      {/* Agent */}
                      <td>
                        <div className="up-agent-cell">
                          <div className="up-avatar">{row.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <div className="up-agent-name">{row.name}</div>
                            <div className="up-agent-id">#{row.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td>
                        <span className="up-type-badge" style={typeStyle(row.type)}>
                          {typeLabel(row.type)}
                        </span>
                      </td>

                      {/* Flat fee */}
                      <td>
                        {isEdit
                          ? <input className="up-inline-input" value={draftForm.flatFee || ""} onChange={(e) => df("flatFee", e.target.value)} />
                          : <span className="up-val-bold">₹{row.flatFee || "—"}</span>
                        }
                      </td>

                      {/* % Rate */}
                      <td>
                        {isEdit ? (
                          <div className="up-inline-rate">
                            <input className="up-inline-input" value={draftForm.percentRate || ""} onChange={(e) => df("percentRate", e.target.value)} />
                            <span>%</span>
                          </div>
                        ) : (
                          <span className="up-rate-badge">{row.percentRate || "—"}%</span>
                        )}
                      </td>

                      {/* Min / Max */}
                      <td>
                        {isEdit ? (
                          <div className="up-minmax-wrap">
                            <input className="up-inline-input sm" placeholder="Min" value={draftForm.minPayout || ""} onChange={(e) => df("minPayout", e.target.value)} />
                            <span className="up-sep">/</span>
                            <input className="up-inline-input sm" placeholder="Max" value={draftForm.maxPayout || ""} onChange={(e) => df("maxPayout", e.target.value)} />
                          </div>
                        ) : (
                          <span className="up-minmax-text">₹{row.minPayout || "—"} / ₹{row.maxPayout || "—"}</span>
                        )}
                      </td>

                      {/* Cycle day */}
                      <td>
                        {isEdit ? (
                          <select className="up-inline-select" value={draftForm.cycleDay || "1"} onChange={(e) => df("cycleDay", e.target.value)}>
                            <option value="1">1st</option>
                            <option value="15">15th</option>
                          </select>
                        ) : (
                          <span className="up-cycle-badge">🗓 {cycleLabel(row.cycleDay)}</span>
                        )}
                      </td>

                      {/* Payout mode */}
                      <td>
                        {isEdit ? (
                          <select className="up-inline-select" value={draftForm.payoutMode || "Bank Transfer"} onChange={(e) => df("payoutMode", e.target.value)}>
                            {payoutModes.map((m) => <option key={m} value={m}>{m}</option>)}
                          </select>
                        ) : (
                          <span className="up-mode-text">{row.payoutMode || "—"}</span>
                        )}
                      </td>

                      {/* Bonus */}
                      <td>
                        {isEdit ? (
                          <div className="up-minmax-wrap">
                            <input className="up-inline-input sm" placeholder="@Conv" value={draftForm.bonusThreshold || ""} onChange={(e) => df("bonusThreshold", e.target.value)} />
                            <span className="up-sep">→</span>
                            <input className="up-inline-input sm" placeholder="₹" value={draftForm.bonusAmt || ""} onChange={(e) => df("bonusAmt", e.target.value)} />
                          </div>
                        ) : (
                          <span className="up-bonus-text">
                            {row.bonusThreshold
                              ? `@${row.bonusThreshold} → ₹${row.bonusAmt}`
                              : row.bonusAmt ? `₹${row.bonusAmt}` : "—"}
                          </span>
                        )}
                      </td>

                      {/* Status toggle */}
                      <td>
                        <button
                          className={`up-toggle-status ${row.active ? "on" : "off"}`}
                          onClick={() => toggleActive(row.id)}
                        >
                          <span className="up-toggle-thumb" />
                          {row.active ? "Active" : "Off"}
                        </button>
                      </td>

                      {/* Edit / Save / Cancel */}
                      <td>
                        {isEdit ? (
                          <div className="up-action-btns">
                            <button className="up-save-btn" onClick={() => saveEdit(row.id)} disabled={saving}>
                              {saving ? "…" : "Save"}
                            </button>
                            <button className="up-cancel-btn" onClick={cancelEdit} disabled={saving}>✕</button>
                          </div>
                        ) : (
                          <button className="up-edit-btn" onClick={() => startEdit(row.id)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="up-table-footer">
          <span>{filtered.length} agent{filtered.length !== 1 ? "s" : ""} shown</span>
        </div>
      </div>
    </div>
  );
}
