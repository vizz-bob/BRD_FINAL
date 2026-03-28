import React, { useState, useMemo, useEffect, useCallback } from "react";
import "./UpdateRepayment.css";

/* ─────────────────────────────────────────────────────────────
   SERVICE IMPORT
   Adjust the path below to match where your repaymentService.js lives:
     Same folder as this file  →  "./repaymentService"
     src/services/             →  "../services/repaymentService"
     src/api/                  →  "../api/repaymentService"
───────────────────────────────────────────────────────────── */
import {
  getRecoveryRecords,
  createRecoveryRecord,
  updateRecoveryRecord,
  deleteRecoveryRecord,
  getDashboard,
} from "../services/repaymentService";
// NOTE: If your repaymentService.js is in a different folder, adjust the path above.
// e.g. same folder as this file → "./repaymentService"
//      src/api/ folder          → "../api/repaymentService" 

/* ── Mock data — used automatically when API returns 404 ──── */
const MOCK_RECORDS = [
  { id: "RR001", agentId: "AG001", agentName: "Rahul Verma",   type: "DSA",         totalOwed: 18500, recovered: 12000, emiAmt: 2000, emiDay: "5",  reason: "Advance Clawback",   status: "Active",    startDate: "2025-09-01", dueDate: "2026-03-01" },
  { id: "RR002", agentId: "AG002", agentName: "Priya Sharma",  type: "Broker",      totalOwed: 9000,  recovered: 9000,  emiAmt: 3000, emiDay: "10", reason: "Overpayment",        status: "Cleared",   startDate: "2025-07-01", dueDate: "2025-10-01" },
  { id: "RR003", agentId: "AG004", agentName: "Neha Gupta",    type: "DSA",         totalOwed: 25000, recovered: 5000,  emiAmt: 2500, emiDay: "1",  reason: "Policy Breach Fine", status: "Active",    startDate: "2025-11-01", dueDate: "2026-07-01" },
  { id: "RR004", agentId: "AG005", agentName: "Karan Mehta",   type: "Broker",      totalOwed: 6000,  recovered: 6000,  emiAmt: 2000, emiDay: "15", reason: "Advance Clawback",   status: "Cleared",   startDate: "2025-06-01", dueDate: "2025-09-01" },
  { id: "RR005", agentId: "AG007", agentName: "Deepak Singh",  type: "DSA",         totalOwed: 13000, recovered: 4000,  emiAmt: 1500, emiDay: "5",  reason: "Dispute Recovery",   status: "On Hold",   startDate: "2025-10-01", dueDate: "2026-06-01" },
  { id: "RR006", agentId: "AG008", agentName: "Meera Pillai",  type: "Broker",      totalOwed: 7500,  recovered: 0,     emiAmt: 1500, emiDay: "1",  reason: "Overpayment",        status: "Defaulted", startDate: "2025-08-01", dueDate: "2025-12-01" },
  { id: "RR007", agentId: "AG003", agentName: "Amit Joshi",    type: "Lead Partner",totalOwed: 30000, recovered: 22000, emiAmt: 4000, emiDay: "1",  reason: "Advance Clawback",   status: "Active",    startDate: "2025-05-01", dueDate: "2026-02-01" },
];

const reasonOptions = ["Advance Clawback", "Overpayment", "Policy Breach", "Dispute Recovery", "Other"];
const statusOptions = ["Active", "On Hold", "Cleared", "Defaulted"];
const typeColors    = { DSA: { bg: "#dbeafe", color: "#2563eb" }, Broker: { bg: "#fef9c3", color: "#b45309" }, "Lead Partner": { bg: "#dcfce7", color: "#16a34a" } };
const statusStyles  = {
  Active:    { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6" },
  Cleared:   { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  "On Hold": { bg: "#fef9c3", color: "#a16207", dot: "#eab308" },
  Defaulted: { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
};

/* ── Helpers ─────────────────────────────────────────────── */

// deduction_day: UI uses "1","5","10","15" — Django model uses "1st","5th","10th","15th"
const emiDayToChoice   = { "1": "1st", "5": "5th", "10": "10th", "15": "15th" };
const emiDayFromChoice = { "1st": "1", "5th": "5", "10th": "10", "15th": "15" };

/**
 * Normalise a record coming from the backend so it always has the
 * field names the UI expects.  The backend may use snake_case or
 * different key names, so we map everything here once.
 */
function normaliseRecord(r) {
  // Log raw backend record — check Console to see exact field names & values
  console.log("[normalise] raw →", JSON.stringify(r));

  const rawDay  = r.deduction_day ?? r.emiDay ?? r.emi_day ?? "1st";
  const emiDay  = emiDayFromChoice[rawDay] ?? String(rawDay).replace(/[^0-9]/g, "") ?? "1";

  // parseFloat handles Django DecimalField strings like "12.00" correctly
  const totalOwed  = parseFloat(r.total_amount_owed ?? r.totalOwed  ?? r.total_owed ?? 0) || 0;
  const recovered  = parseFloat(r.already_recovered ?? r.recovered  ?? 0) || 0;
  const emiAmt     = parseFloat(r.emi_amount        ?? r.emiAmt     ?? 0) || 0;

  const norm = {
    id:        r.id        ?? "",
    agentId:   r.agent_id  ?? r.agentId  ?? "",
    agentName: r.agent_name ?? r.agentName ?? r.name ?? "",
    type:      r.agent_type ?? r.type     ?? "DSA",
    totalOwed,
    recovered,
    emiAmt,
    emiDay,
    reason:    r.reason  ?? "Other",
    status:    r.status  ?? "Active",
    startDate: r.start_date ?? r.startDate ?? "",
    dueDate:   r.due_date   ?? r.dueDate   ?? "",
  };

  console.log("[normalise] result → totalOwed:", norm.totalOwed, "recovered:", norm.recovered);
  return norm;
}

/**
 * Convert UI record → backend payload shape.
 * Update the keys here to match exactly what your API expects in POST/PUT body.
 */

/**
 * Convert a UI record to the shape the backend expects.
 */
function toPayload(form) {
  return {
    agent_id:           form.agentId,
    agent_name:         form.agentName,
    agent_type:         form.type,
    total_amount_owed:  form.totalOwed,       // model field: total_amount_owed
    already_recovered:  form.recovered,        // model field: already_recovered
    emi_amount:         form.emiAmt,
    deduction_day:      emiDayToChoice[form.emiDay] ?? form.emiDay, // "1" → "1st"
    reason:             form.reason,
    status:             form.status,
    start_date:         form.startDate,
    due_date:           form.dueDate,
  };
}

/* ── Toast ───────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`urr-toast urr-toast-${type}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>{msg}
    </div>
  );
}

/* ── Loading Spinner ─────────────────────────────────────── */
function Spinner() {
  return (
    <div className="urr-spinner-wrap">
      <div className="urr-spinner" />
      <p>Loading records…</p>
    </div>
  );
}

/* ── Add Modal ───────────────────────────────────────────── */
function AddModal({ onClose, onAdd, loading }) {
  const [form, setForm] = useState({
    agentId: "", agentName: "", type: "DSA",
    totalOwed: "", recovered: "0", emiAmt: "",
    emiDay: "1st", reason: "Advance Clawback",
    status: "Active", startDate: "", dueDate: "",
  });
  const [errors, setErrors] = useState({});

  const f = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.agentName.trim()) e.agentName = "Required";
    if (!form.totalOwed)        e.totalOwed = "Required";
    if (!form.emiAmt)           e.emiAmt    = "Required";
    if (!form.startDate)        e.startDate = "Required";
    if (!form.dueDate)          e.dueDate   = "Required";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      ...form,
      totalOwed: parseInt(form.totalOwed),
      recovered: parseInt(form.recovered || 0),
      emiAmt:    parseInt(form.emiAmt),
    });
  };

  return (
    <div className="urr-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="urr-modal">
        <div className="urr-modal-header">
          <div className="urr-modal-title-wrap">
            <div className="urr-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M12 5v14M5 12l7-7 7 7"/></svg>
            </div>
            <div>
              <h2>Add Recovery Record</h2>
              <p>Create a new repayment recovery entry</p>
            </div>
          </div>
          <button className="urr-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="urr-modal-body">
          <div className="urr-modal-grid">
            <div className="urr-mf full">
              <label>Agent Name <span>*</span></label>
              <input value={form.agentName} onChange={e => f("agentName", e.target.value)} placeholder="Agent full name" className={errors.agentName ? "err" : ""} />
              {errors.agentName && <span className="urr-err">{errors.agentName}</span>}
            </div>
            <div className="urr-mf">
              <label>Agent ID</label>
              <input value={form.agentId} onChange={e => f("agentId", e.target.value)} placeholder="e.g. AG001" />
            </div>
            <div className="urr-mf">
              <label>Agent Type</label>
              <select value={form.type} onChange={e => f("type", e.target.value)}>
                <option value="DSA">DSA</option>
                <option value="Broker">Broker</option>
                <option value="Lead Partner">Lead Partner</option>
              </select>
            </div>
            <div className="urr-mf">
              <label>Total Amount Owed (₹) <span>*</span></label>
              <input type="number" value={form.totalOwed} onChange={e => f("totalOwed", e.target.value)} placeholder="0" className={errors.totalOwed ? "err" : ""} />
              {errors.totalOwed && <span className="urr-err">{errors.totalOwed}</span>}
            </div>
            <div className="urr-mf">
              <label>Already Recovered (₹)</label>
              <input type="number" value={form.recovered} onChange={e => f("recovered", e.target.value)} placeholder="0" />
            </div>
            <div className="urr-mf">
              <label>EMI Amount (₹) <span>*</span></label>
              <input type="number" value={form.emiAmt} onChange={e => f("emiAmt", e.target.value)} placeholder="0" className={errors.emiAmt ? "err" : ""} />
              {errors.emiAmt && <span className="urr-err">{errors.emiAmt}</span>}
            </div>
            <div className="urr-mf">
              <label>Deduction Day</label>
              <select value={form.emiDay} onChange={e => f("emiDay", e.target.value)}>
                <option value="1st">1st of month</option>
                <option value="5th">5th of month</option>
                <option value="10th">10th of month</option>
                <option value="15th">15th of month</option>
              </select>
            </div>
            <div className="urr-mf">
              <label>Reason</label>
              <select value={form.reason} onChange={e => f("reason", e.target.value)}>
                {reasonOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="urr-mf">
              <label>Status</label>
              <select value={form.status} onChange={e => f("status", e.target.value)}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="urr-mf">
              <label>Start Date <span>*</span></label>
              <input type="date" value={form.startDate} onChange={e => f("startDate", e.target.value)} className={errors.startDate ? "err" : ""} />
              {errors.startDate && <span className="urr-err">{errors.startDate}</span>}
            </div>
            <div className="urr-mf">
              <label>Due Date <span>*</span></label>
              <input type="date" value={form.dueDate} onChange={e => f("dueDate", e.target.value)} className={errors.dueDate ? "err" : ""} />
              {errors.dueDate && <span className="urr-err">{errors.dueDate}</span>}
            </div>
          </div>
        </div>
        <div className="urr-modal-footer">
          <button className="urr-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="urr-btn-primary" onClick={handleAdd} disabled={loading}>
            {loading ? "Saving…" : "Add Record"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Drawer ─────────────────────────────────────────── */
function EditDrawer({ record, onClose, onSave, loading }) {
  const [form, setForm] = useState({ ...record });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const pending = form.totalOwed - form.recovered;
  const pct = form.totalOwed > 0 ? Math.min(Math.round((form.recovered / form.totalOwed) * 100), 100) : 0;

  return (
    <div className="urr-drawer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="urr-drawer">
        <div className="urr-drawer-header">
          <div>
            <h2>Edit Recovery</h2>
            <p>{record.id} · {record.agentName}</p>
          </div>
          <button className="urr-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="urr-drawer-body">
          <div className="urr-meter-card">
            <div className="urr-meter-top">
              <div>
                <div className="urr-meter-title">Recovery Progress</div>
                <div className="urr-meter-sub">₹{form.recovered.toLocaleString()} of ₹{form.totalOwed.toLocaleString()}</div>
              </div>
              <div className="urr-meter-pct" style={{ color: pct >= 100 ? "#16a34a" : pct >= 60 ? "#4f46e5" : pct >= 30 ? "#d97706" : "#dc2626" }}>{pct}%</div>
            </div>
            <div className="urr-meter-bar">
              <div className="urr-meter-fill" style={{ width: `${pct}%`, background: pct >= 100 ? "#22c55e" : pct >= 60 ? "#4f46e5" : pct >= 30 ? "#f59e0b" : "#ef4444" }} />
            </div>
            <div className="urr-meter-pending">Pending: <strong>₹{Math.max(0, pending).toLocaleString()}</strong></div>
          </div>
          <div className="urr-edit-grid">
            <div className="urr-ef">
              <label>Total Owed (₹)</label>
              <input type="number" value={form.totalOwed} onChange={e => f("totalOwed", parseInt(e.target.value) || 0)} />
            </div>
            <div className="urr-ef">
              <label>Recovered (₹)</label>
              <input type="number" value={form.recovered} onChange={e => f("recovered", parseInt(e.target.value) || 0)} />
            </div>
            <div className="urr-ef">
              <label>EMI Amount (₹)</label>
              <input type="number" value={form.emiAmt} onChange={e => f("emiAmt", parseInt(e.target.value) || 0)} />
            </div>
            <div className="urr-ef">
              <label>Deduction Day</label>
              <select value={form.emiDay} onChange={e => f("emiDay", e.target.value)}>
                <option value="1st">1st</option><option value="5th">5th</option>
                <option value="10th">10th</option><option value="15th">15th</option>
              </select>
            </div>
            <div className="urr-ef full">
              <label>Reason</label>
              <select value={form.reason} onChange={e => f("reason", e.target.value)}>
                {reasonOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="urr-ef full">
              <label>Status</label>
              <div className="urr-status-pills">
                {statusOptions.map(s => (
                  <button key={s} type="button"
                    className={`urr-pill ${form.status === s ? "selected" : ""}`}
                    style={form.status === s ? { background: statusStyles[s].bg, color: statusStyles[s].color, borderColor: statusStyles[s].dot } : {}}
                    onClick={() => f("status", s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className="urr-ef">
              <label>Start Date</label>
              <input type="date" value={form.startDate} onChange={e => f("startDate", e.target.value)} />
            </div>
            <div className="urr-ef">
              <label>Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => f("dueDate", e.target.value)} />
            </div>
          </div>
        </div>
        <div className="urr-drawer-footer">
          <button className="urr-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="urr-btn-primary" onClick={() => onSave(form)} disabled={loading}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function UpdateRepayment() {
  const [records,       setRecords]       = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [pageLoading,   setPageLoading]   = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("All");
  const [showAdd,       setShowAdd]       = useState(false);
  const [editRecord,    setEditRecord]    = useState(null);
  const [toast,         setToast]         = useState(null);
  const [apiError,      setApiError]      = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  /* ── Fetch all data on mount ── */
  const fetchAll = useCallback(async () => {
    setPageLoading(true);
    setApiError(null);
    try {
      const [recoveryData, dashData] = await Promise.all([
        getRecoveryRecords(),
        getDashboard().catch(() => null),
      ]);

      // Log raw API response so you can inspect field names in DevTools Console
      console.log("[UpdateRepayment] raw API response →", recoveryData);

      // Handle all common response shapes: array, { results }, { data }, { records }
      const raw = Array.isArray(recoveryData)
        ? recoveryData
        : recoveryData?.results
        ?? recoveryData?.data
        ?? recoveryData?.records
        ?? recoveryData?.recovery
        ?? [];

      console.log("[UpdateRepayment] parsed records count →", raw.length);

      setRecords(raw.map(normaliseRecord));
      if (dashData) setDashboardData(dashData);
    } catch (err) {
      console.error("[UpdateRepayment] Failed to load:", err);
      const status = err?.response?.status;
      if (status === 404 || status === 500 || err?.code === "ERR_NETWORK") {
        // API not ready — show mock data so the UI is fully functional
        console.warn("[UpdateRepayment] API unavailable (status=" + status + "), loading mock data");
        setRecords(MOCK_RECORDS);
        setApiError("⚠️ Backend API not connected — showing demo data.");
      } else {
        setApiError(`Unable to load records: ${err?.response?.data?.detail ?? err.message ?? "Server error"}`);
      }
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Add ── */
  const handleAdd = async (formData) => {
    setActionLoading(true);
    try {
      const created = await createRecoveryRecord(toPayload(formData));
      const norm    = normaliseRecord({ ...formData, ...created });
      setRecords(p => [norm, ...p]);
      setShowAdd(false);
      showToast(`Recovery record added for ${norm.agentName}`);
    } catch (err) {
      console.error("Create failed:", err);
      // API down — save locally so UI stays functional
      const localRecord = { ...formData, id: `RR${String(Date.now()).slice(-4)}` };
      setRecords(p => [localRecord, ...p]);
      setShowAdd(false);
      showToast(`Record added locally (API unavailable)`);
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Edit / Save ── */
  const handleSave = async (updated) => {
    setActionLoading(true);
    const payload = toPayload(updated);
    console.log("[handleSave] PUT payload sent to backend →", payload);
    try {
      const saved = await updateRecoveryRecord(updated.id, payload);
      const norm  = normaliseRecord({ ...updated, ...saved });
      setRecords(p => p.map(r => r.id === norm.id ? norm : r));
      setEditRecord(null);
      showToast(`Record ${norm.id} updated successfully`);
    } catch (err) {
      // Log the full backend validation error so we know exactly which fields are wrong
      const backendError = err?.response?.data;
      console.error("[handleSave] Update failed — backend says:", JSON.stringify(backendError, null, 2));
      showToast(
        backendError
          ? `Validation error: ${Object.entries(backendError).map(([k,v]) => `${k}: ${v}`).join(" | ")}`
          : "Failed to update record. Please try again.",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await deleteRecoveryRecord(id);
      setRecords(p => p.filter(r => r.id !== id));
      showToast(`Record ${id} removed`, "error");
    } catch (err) {
      console.error("Delete failed:", err);
      // API down — remove locally
      setRecords(p => p.filter(r => r.id !== id));
      showToast(`Record ${id} removed locally (API unavailable)`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Derived stats ──
     Prefer backend dashboard data when available, otherwise compute locally. */
  // Always compute stats from the live records array so all 4 cards stay in sync.
  const totalOwed      = records.reduce((s, r) => s + (parseFloat(r.totalOwed)  || 0), 0);
  const totalRecovered = records.reduce((s, r) => s + (parseFloat(r.recovered)  || 0), 0);
  const totalPending   = totalOwed - totalRecovered;
  const overallPct     = totalOwed > 0 ? Math.round((totalRecovered / totalOwed) * 100) : 0;
  const activeCount    = records.filter(r => r.status === "Active").length;
  const defaultedCount = records.filter(r => r.status === "Defaulted").length;
  const clearedCount   = records.filter(r => r.status === "Cleared").length;
  const onHoldCount    = records.filter(r => r.status === "On Hold").length;

  // Debug — remove after confirming cards show correct values
  console.log("[Stats] records:", records.length, "totalOwed:", totalOwed, "totalRecovered:", totalRecovered, "pending:", totalPending, "pct:", overallPct);

  /* ── Filter ── */
  const filtered = useMemo(() => records.filter(r => {
    const matchS = r.agentName.toLowerCase().includes(search.toLowerCase()) ||
                   String(r.id).includes(search) ||
                   String(r.agentId).includes(search);
    const matchF = filterStatus === "All" || r.status === filterStatus;
    return matchS && matchF;
  }), [records, search, filterStatus]);

  /* ── Render ── */
  return (
    <div className="urr-root">
      {toast     && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {showAdd   && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} loading={actionLoading} />}
      {editRecord && <EditDrawer record={editRecord} onClose={() => setEditRecord(null)} onSave={handleSave} loading={actionLoading} />}

      {/* Header */}
      <div className="urr-header">
        <div className="urr-header-left">
          <div className="urr-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0"/><path d="M3 12h4l3 3 4-6 3 3h4"/></svg>
          </div>
          <div>
            <h1 className="urr-title">Update Repayment Recovery</h1>
            <p className="urr-subtitle">Track and manage agent repayment recovery schedules</p>
          </div>
        </div>
        <div className="urr-header-actions">
          <button className="urr-btn-outline" onClick={fetchAll} disabled={pageLoading || actionLoading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.36-3.36L23 10M1 14l5.13 4.36A9 9 0 0020.49 15"/></svg>
            Refresh
          </button>
          <button className="urr-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
          <button className="urr-btn-primary" onClick={() => setShowAdd(true)} disabled={pageLoading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Record
          </button>
        </div>
      </div>

      {/* API Error Banner */}
      {apiError && (
        <div className="urr-api-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {apiError}
          <button onClick={fetchAll} className="urr-retry-btn">Retry</button>
        </div>
      )}

      {/* Summary Band */}
      <div className="urr-summary-band">
        <div className="urr-summary-item" style={{ "--card-color": "#4f46e5" }}>
          <div className="urr-stat-icon" style={{ background: "#eef2ff", color: "#4f46e5" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
          </div>
          <div className="urr-summary-val">₹{(totalOwed / 1000).toFixed(1)}K</div>
          <div className="urr-summary-label">Total Owed</div>
          <div className="urr-summary-sub">{records.length} records</div>
        </div>

        <div className="urr-summary-item" style={{ "--card-color": "#22c55e" }}>
          <div className="urr-stat-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="urr-summary-val">₹{(totalRecovered / 1000).toFixed(1)}K</div>
          <div className="urr-summary-label">Recovered</div>
          <div className="urr-summary-sub">{clearedCount} cleared</div>
        </div>

        <div className="urr-summary-item" style={{ "--card-color": "#f97316" }}>
          <div className="urr-stat-icon" style={{ background: "#ffedd5", color: "#ea580c" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="urr-summary-val">₹{(totalPending / 1000).toFixed(1)}K</div>
          <div className="urr-summary-label">Pending</div>
          <div className="urr-summary-sub">{activeCount} active · {defaultedCount} defaulted</div>
        </div>

        <div className="urr-summary-progress">
          <div className="urr-stat-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          </div>
          <div className="urr-summary-pct-label">
            <span className="urr-summary-label" style={{ display: "block", marginBottom: 2 }}>Overall Recovery</span>
          </div>
          <div className="urr-summary-val" style={{ color: "#4f46e5" }}>{overallPct}%</div>
          <div className="urr-summary-pct-bar" style={{ marginTop: 6 }}>
            <div className="urr-summary-pct-fill" style={{ width: `${overallPct}%` }} />
          </div>
          <div className="urr-summary-sub" style={{ marginTop: 2 }}>{onHoldCount} on hold</div>
        </div>
      </div>

      {/* Main Card */}
      <div className="urr-main-card">
        {/* Toolbar */}
        <div className="urr-toolbar">
          <div className="urr-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              placeholder="Search by agent or record ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="urr-filters">
            {["All", "Active", "On Hold", "Cleared", "Defaulted"].map(s => (
              <button key={s}
                className={`urr-filter-btn ${filterStatus === s ? "active" : ""}`}
                style={filterStatus === s && s !== "All" ? { background: statusStyles[s]?.bg, color: statusStyles[s]?.color, borderColor: statusStyles[s]?.dot } : {}}
                onClick={() => setFilterStatus(s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        {pageLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="urr-cards-grid">
              {filtered.map(r => {
                const pct     = r.totalOwed > 0 ? Math.min(Math.round((r.recovered / r.totalOwed) * 100), 100) : 0;
                const ss      = statusStyles[r.status] ?? statusStyles["Active"];
                const pending = r.totalOwed - r.recovered;
                const emis    = pending > 0 ? Math.ceil(pending / r.emiAmt) : 0;
                const emiLabel = r.emiDay === "1st" ? "1st" : r.emiDay === "5th" ? "5th" : r.emiDay === "10th" ? "10th" : r.emiDay === "15th" ? "15th" : r.emiDay;

                return (
                  <div key={r.id} className="urr-record-card">
                    <div className="urr-card-top">
                      <div className="urr-card-agent">
                        <div className="urr-card-avatar">{r.agentName.charAt(0)}</div>
                        <div>
                          <div className="urr-card-name">{r.agentName}</div>
                          <div className="urr-card-meta">
                            {r.agentId} ·{" "}
                            <span className="urr-type-badge" style={{ background: typeColors[r.type]?.bg, color: typeColors[r.type]?.color }}>
                              {r.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="urr-status-badge" style={{ background: ss.bg, color: ss.color }}>
                        <span className="urr-status-dot" style={{ background: ss.dot }} />
                        {r.status}
                      </span>
                    </div>

                    <div className="urr-card-reason">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {r.reason}
                    </div>

                    <div className="urr-card-amounts">
                      <div className="urr-amount-item">
                        <span className="urr-amount-val">₹{r.totalOwed.toLocaleString()}</span>
                        <span className="urr-amount-lbl">Total Owed</span>
                      </div>
                      <div className="urr-amount-item green">
                        <span className="urr-amount-val">₹{r.recovered.toLocaleString()}</span>
                        <span className="urr-amount-lbl">Recovered</span>
                      </div>
                      <div className="urr-amount-item orange">
                        <span className="urr-amount-val">₹{Math.max(0, pending).toLocaleString()}</span>
                        <span className="urr-amount-lbl">Pending</span>
                      </div>
                    </div>

                    <div className="urr-card-progress">
                      <div className="urr-progress-header">
                        <span>Recovery Progress</span>
                        <span style={{ color: pct >= 100 ? "#16a34a" : pct >= 60 ? "#4f46e5" : pct >= 30 ? "#d97706" : "#dc2626", fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div className="urr-prog-bar">
                        <div className="urr-prog-fill" style={{ width: `${pct}%`, background: pct >= 100 ? "#22c55e" : pct >= 60 ? "#4f46e5" : pct >= 30 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                    </div>

                    <div className="urr-card-emi">
                      <div className="urr-emi-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>₹{r.emiAmt.toLocaleString()} / {emiLabel}</span>
                      </div>
                      {r.status !== "Cleared" && emis > 0 && (
                        <div className="urr-emi-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <span>{emis} EMIs left</span>
                        </div>
                      )}
                      <div className="urr-emi-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <span>Due: {r.dueDate ? new Date(r.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                      </div>
                    </div>

                    <div className="urr-card-actions">
                      <button className="urr-card-edit-btn" onClick={() => setEditRecord(r)} disabled={actionLoading}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <button className="urr-card-del-btn" onClick={() => handleDelete(r.id)} disabled={actionLoading}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="urr-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0"/><path d="M3 12h4l3 3 4-6 3 3h4"/></svg>
                <p>No recovery records found</p>
              </div>
            )}
          </>
        )}

        <div className="urr-card-footer">
          <span>{pageLoading ? "Loading…" : `${filtered.length} records shown`}</span>
        </div>
      </div>
    </div>
  );
}
