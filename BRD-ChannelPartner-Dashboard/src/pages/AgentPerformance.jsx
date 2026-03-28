import React, { useState, useEffect } from "react";
import "./AgentPerformance.css";

import {
  getDashboardList,
  getAllAgentList,
  createAllAgent,
  updateAllAgent,
  deleteAllAgent,
  removeAgent,
  createNewAgent,
} from "../services/AgentPerformanceService";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const barData = [
  { month: "Aug", value: 68 },
  { month: "Sep", value: 74 },
  { month: "Oct", value: 61 },
  { month: "Nov", value: 85 },
  { month: "Dec", value: 79 },
  { month: "Jan", value: 92 },
];

const typeColors = {
  DSA:            { bg: "#dbeafe", color: "#4f46e5" },
  Broker:         { bg: "#fef9c3", color: "#b45309" },
  "Lead Partner": { bg: "#dcfce7", color: "#16a34a" },
};

const emptyForm = {
  name: "",
  type: "DSA",
  leads: "",
  converted: "",
  payout: "",
  status: "Active",
  score: "",
};

// ─── AGENT MODAL (Add / Edit) ────────────────────────────────────────────────
function AgentModal({ agent, onClose, onSave }) {
  const [form, setForm]     = useState(agent ? { ...agent } : { ...emptyForm });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!agent;

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name      = "Name is required";
    if (!form.leads)         e.leads     = "Required";
    if (!form.converted)     e.converted = "Required";
    if (!form.payout.toString().trim()) e.payout = "Required";
    if (!form.score)         e.score     = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await onSave(form);
    } finally {
      setLoading(false);
    }
  };

  const f = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: undefined }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className={`modal-header-icon ${isEdit ? "edit" : "add"}`}>
              {isEdit
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
              }
            </div>
            <div>
              <h2>{isEdit ? "Edit Agent" : "Add New Agent"}</h2>
              <p>{isEdit ? `Updating details for ${agent.agent_id || agent.id}` : "Fill in details to onboard a new agent"}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="mf-section-label">Basic Information</div>
          <div className="modal-grid">
            <div className="mf-group full">
              <label>Full Name <span>*</span></label>
              <div className="mf-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input value={form.name} onChange={e => f("name", e.target.value)} placeholder="e.g. Rahul Verma" className={errors.name ? "err" : ""} />
              </div>
              {errors.name && <span className="mf-err">⚠ {errors.name}</span>}
            </div>

            <div className="mf-group">
              <label>Agent Type <span>*</span></label>
              <select value={form.type} onChange={e => f("type", e.target.value)}>
                <option value="DSA">DSA</option>
                <option value="Broker">Broker</option>
                <option value="Lead Partner">Lead Partner</option>
              </select>
            </div>

            <div className="mf-group">
              <label>Status <span>*</span></label>
              <div className="mf-status-toggle">
                {["Active", "Inactive"].map(s => (
                  <button key={s} type="button"
                    className={`mf-toggle-btn ${form.status === s ? (s === "Active" ? "tog-active" : "tog-inactive") : ""}`}
                    onClick={() => f("status", s)}>{s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mf-section-label" style={{ marginTop: 16 }}>Performance Metrics</div>
          <div className="modal-grid">
            <div className="mf-group">
              <label>Total Leads <span>*</span></label>
              <div className="mf-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <input type="number" value={form.leads} onChange={e => f("leads", e.target.value)} placeholder="0" className={errors.leads ? "err" : ""} />
              </div>
              {errors.leads && <span className="mf-err">⚠ {errors.leads}</span>}
            </div>

            <div className="mf-group">
              <label>Converted <span>*</span></label>
              <div className="mf-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <input type="number" value={form.converted} onChange={e => f("converted", e.target.value)} placeholder="0" className={errors.converted ? "err" : ""} />
              </div>
              {errors.converted && <span className="mf-err">⚠ {errors.converted}</span>}
            </div>

            <div className="mf-group">
              <label>Payout <span>*</span></label>
              <div className="mf-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                <input value={form.payout} onChange={e => f("payout", e.target.value)} placeholder="e.g. 114000" className={errors.payout ? "err" : ""} />
              </div>
              {errors.payout && <span className="mf-err">⚠ {errors.payout}</span>}
            </div>

            <div className="mf-group">
              <label>Score (0–100) <span>*</span></label>
              <div className="mf-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                <input type="number" min="0" max="100" value={form.score} onChange={e => f("score", e.target.value)} placeholder="0–100" className={errors.score ? "err" : ""} />
              </div>
              {errors.score && <span className="mf-err">⚠ {errors.score}</span>}
              {form.score > 0 && (
                <div className="mf-score-preview">
                  <div className="mf-score-bar">
                    <div style={{ width: `${Math.min(form.score, 100)}%`, background: form.score >= 80 ? "#22c55e" : form.score >= 60 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                  <span style={{ color: form.score >= 80 ? "#16a34a" : form.score >= 60 ? "#d97706" : "#dc2626", fontSize: 11, fontWeight: 600 }}>
                    {form.score >= 80 ? "Excellent" : form.score >= 60 ? "Average" : "Needs Work"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="ap-btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="ap-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : isEdit
              ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>
              : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Agent</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VIEW DRAWER ─────────────────────────────────────────────────────────────
function ViewDrawer({ agent, onClose, onEdit }) {
  if (!agent) return null;
  const convRate   = agent.leads > 0 ? ((agent.converted / agent.leads) * 100).toFixed(1) : 0;
  const scoreColor = agent.score >= 80 ? "#16a34a" : agent.score >= 60 ? "#d97706" : "#dc2626";
  const scoreBg    = agent.score >= 80 ? "#dcfce7" : agent.score >= 60 ? "#fef9c3" : "#fee2e2";
  const scoreLabel = agent.score >= 80 ? "Excellent" : agent.score >= 60 ? "Average" : "Needs Work";

  return (
    <div className="drawer-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer-box">
        <div className="drawer-banner">
          <button className="drawer-close-top" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div className="drawer-banner-avatar">{agent.name.charAt(0)}</div>
          <h2 className="drawer-banner-name">{agent.name}</h2>
          <div className="drawer-banner-meta">
            <span className="ap-type-badge" style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>{agent.type}</span>
            <span className="drawer-banner-id">{agent.agent_id || agent.id}</span>
          </div>
          <span className={`drawer-banner-status ${agent.status === "Active" ? "active" : "inactive"}`}>{agent.status}</span>
        </div>

        <div className="drawer-body">
          <div className="drawer-stats">
            {[
              { label: "Total Leads", value: agent.leads,              icon: "📊" },
              { label: "Converted",   value: agent.converted,          icon: "✅" },
              { label: "Conv. Rate",  value: `${convRate}%`,           icon: "📈" },
              { label: "Payout",      value: `₹${Number(agent.payout).toLocaleString()}`, icon: "💳" },
            ].map((s) => (
              <div key={s.label} className="drawer-stat">
                <div className="drawer-stat-icon">{s.icon}</div>
                <div className="drawer-stat-val">{s.value}</div>
                <div className="drawer-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="drawer-score-card" style={{ borderLeft: `4px solid ${scoreColor}` }}>
            <div className="drawer-score-top">
              <div>
                <div className="drawer-score-title">Performance Score</div>
                <div className="drawer-score-sub">Based on conversion & activity</div>
              </div>
              <div className="drawer-score-badge" style={{ background: scoreBg, color: scoreColor }}>
                {agent.score}<span>/100</span>
              </div>
            </div>
            <div className="drawer-score-track">
              <div className="drawer-score-fill" style={{ width: `${agent.score}%`, background: scoreColor }} />
            </div>
            <div className="drawer-score-footer" style={{ color: scoreColor }}>
              {agent.score >= 80 ? "🟢" : agent.score >= 60 ? "🟡" : "🔴"} {scoreLabel} performance
            </div>
          </div>

          <div className="drawer-actions">
            <button className="drawer-edit-btn" onClick={() => { onClose(); onEdit(agent); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Agent
            </button>
            <button className="drawer-close-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DELETE CONFIRM ──────────────────────────────────────────────────────────
function DeleteConfirm({ agent, onClose, onConfirm, loading }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <div>
            <h2 style={{ color: "#dc2626" }}>Remove Agent</h2>
            <p>This action cannot be undone</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="delete-confirm-body">
            <div className="delete-icon">🗑️</div>
            <p>Are you sure you want to remove <strong>{agent?.name}</strong> ({agent?.agent_id || agent?.id}) from the system?</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="ap-btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Removing..." : "Yes, Remove Agent"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className={`toast toast-${type}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
}

// ─── LOADING SKELETON ────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i}>
          {[...Array(9)].map((_, j) => (
            <td key={j}><div style={{ height: 16, background: "#f1f5f9", borderRadius: 4, animation: "pulse 1.5s infinite" }} /></td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AgentPerformance() {
  const [agents, setAgents]           = useState([]);
  const [dashboard, setDashboard]     = useState(null);
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("All");
  const [modal, setModal]             = useState(null);   // null | "add" | "edit"
  const [editAgent, setEditAgent]     = useState(null);
  const [viewAgent, setViewAgent]     = useState(null);
  const [deleteAgent, setDeleteAgent] = useState(null);
  const [toast, setToast]             = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [apiError, setApiError]       = useState(null);

  const maxBar = Math.max(...barData.map((b) => b.value));

  // ── Fetch agents & dashboard on mount ──────────────────────────────────────
  useEffect(() => {
    fetchAgents();
    fetchDashboard();
  }, []);

  const fetchAgents = async () => {
    setTableLoading(true);
    setApiError(null);
    try {
      const data = await getAllAgentList();
      // Normalize API fields to match UI expectations
      const normalized = (Array.isArray(data) ? data : data.results || []).map((a) => ({
        ...a,
        id:        a.agent_id || a.id,
        name:      a.name,
        type:      a.type,
        leads:     a.leads,
        converted: a.converted,
        payout:    a.payout,
        score:     a.score,
        status:    a.status,
      }));
      setAgents(normalized);
    } catch (err) {
      setApiError("Failed to load agents. Please try again.");
      showToast("Failed to load agents.", "error");
    } finally {
      setTableLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardList();
      const list = Array.isArray(data) ? data : data.results || [];
      if (list.length > 0) setDashboard(list[0]);
    } catch {
      // Dashboard stats fall back to computed values from agents
    }
  };

  // ── Stats — prefer dashboard API, fallback to computed ────────────────────
  const statsData = [
    {
      label: "Total Agents",
      value: (dashboard?.total_agents ?? agents.length).toLocaleString(),
      change: "+12%", positive: true, color: "blue",
    },
    {
      label: "Active Agents",
      value: (dashboard?.active_agents ?? agents.filter(a => a.status === "Active").length).toLocaleString(),
      change: "+8%", positive: true, color: "green",
    },
    {
      label: "Total Payouts",
      value: dashboard?.total_payouts
        ? `₹${Number(dashboard.total_payouts).toLocaleString()}`
        : "₹48.2L",
      change: "+23%", positive: true, color: "purple",
    },
    {
      label: "Leads Generated",
      value: (dashboard?.lead_generated ?? agents.reduce((s, a) => s + Number(a.leads || 0), 0)).toLocaleString(),
      change: "-3%", positive: false, color: "orange",
    },
  ];

  // ── Filtered agents ────────────────────────────────────────────────────────
  const filtered = agents.filter((a) => {
    const matchSearch = a.name?.toLowerCase().includes(search.toLowerCase()) || String(a.agent_id || a.id || "").includes(search);
    const matchFilter = filter === "All" || a.status === filter || a.type === filter;
    return matchSearch && matchFilter;
  });

  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Add Agent ──────────────────────────────────────────────────────────────
  const handleAdd = async (form) => {
    try {
      // 1. Create in New Agent endpoint (for onboarding flow)
      await createNewAgent({
        full_name:   form.name,
        agent_type:  form.type,
        status:      form.status,
        total_leads: Number(form.leads),
        converted:   Number(form.converted),
        payout:      Number(form.payout),
        score:       Number(form.score),
        add_agent:   true,
      });

      // 2. Create in All Agent endpoint (master list)
      const newAgentId = `AG${String(agents.length + 1).padStart(3, "0")}`;
      const created = await createAllAgent({
        agent_id:  newAgentId,
        name:      form.name,
        type:      form.type,
        status:    form.status,
        leads:     Number(form.leads),
        converted: Number(form.converted),
        payout:    Number(form.payout),
        score:     Number(form.score),
      });

      setAgents(prev => [...prev, {
        ...created,
        id:   created.agent_id || created.id,
        name: created.name,
      }]);

      setModal(null);
      showToast(`Agent ${form.name} added successfully!`);
      fetchDashboard(); // refresh dashboard counts
    } catch (err) {
      showToast("Failed to add agent. Please try again.", "error");
    }
  };

  // ── Edit Agent ─────────────────────────────────────────────────────────────
  const handleEdit = async (form) => {
    try {
      const pk = form.pk || form.id;
      const updated = await updateAllAgent(pk, {
        agent_id:  form.agent_id || form.id,
        name:      form.name,
        type:      form.type,
        status:    form.status,
        leads:     Number(form.leads),
        converted: Number(form.converted),
        payout:    Number(form.payout),
        score:     Number(form.score),
      });

      setAgents(prev => prev.map(a =>
        (a.pk || a.id) === pk
          ? { ...updated, id: updated.agent_id || updated.id }
          : a
      ));
      setModal(null);
      setEditAgent(null);
      showToast(`Agent ${form.name} updated successfully!`);
    } catch {
      showToast("Failed to update agent. Please try again.", "error");
    }
  };

  // ── Delete Agent ───────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const pk = deleteAgent.pk || deleteAgent.id;

      // 1. Record removal reason via Remove Agent endpoint
      await removeAgent({
        agent_name:      deleteAgent.name,
        agent_id:        deleteAgent.agent_id || deleteAgent.id,
        reason:          "Removed by admin",
        yes_remove_agent: true,
      });

      // 2. Hard delete from All Agent list
      await deleteAllAgent(pk);

      setAgents(prev => prev.filter(a => (a.pk || a.id) !== pk));
      showToast(`Agent ${deleteAgent.name} removed.`, "error");
      setDeleteAgent(null);
      fetchDashboard();
    } catch {
      showToast("Failed to remove agent. Please try again.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEdit = (agent) => { setEditAgent(agent); setModal("edit"); };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="ap-root">

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modals */}
      {modal === "add"  && <AgentModal agent={null}      onClose={() => setModal(null)} onSave={handleAdd} />}
      {modal === "edit" && <AgentModal agent={editAgent} onClose={() => { setModal(null); setEditAgent(null); }} onSave={handleEdit} />}
      {viewAgent   && <ViewDrawer agent={viewAgent} onClose={() => setViewAgent(null)} onEdit={openEdit} />}
      {deleteAgent && <DeleteConfirm agent={deleteAgent} loading={deleteLoading} onClose={() => setDeleteAgent(null)} onConfirm={handleDelete} />}

      {/* Page Header */}
      <div className="ap-page-header">
        <div>
          <h1 className="ap-title">Agent Performance</h1>
          <p className="ap-subtitle">Monitor and evaluate your referral agent network</p>
        </div>
        <div className="ap-header-actions">
          <button className="ap-btn-outline" onClick={fetchAgents}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            Refresh
          </button>
          <button className="ap-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
          <button className="ap-btn-primary" onClick={() => setModal("add")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Agent
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="ap-stats">
        {statsData.map((s) => (
          <div key={s.label} className={`ap-stat-card ap-stat-${s.color}`}>
            <div className="ap-stat-top">
              <div className={`ap-stat-icon ap-icon-${s.color}`}>
                {s.color === "blue"   && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>}
                {s.color === "green"  && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                {s.color === "purple" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>}
                {s.color === "orange" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
              </div>
              <span className={`ap-stat-change ${s.positive ? "pos" : "neg"}`}>{s.positive ? "↑" : "↓"} {s.change}</span>
            </div>
            <div className="ap-stat-value">{s.value}</div>
            <div className="ap-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mid Row */}
      <div className="ap-mid-row">
        <div className="ap-card ap-chart-card">
          <div className="ap-card-header"><div><h3>Monthly Leads</h3><p>Last 6 months overview</p></div></div>
          <div className="ap-bar-chart">
            {barData.map((b) => (
              <div key={b.month} className="ap-bar-col">
                <div className="ap-bar-track">
                  <div className="ap-bar-fill" style={{ height: `${(b.value / maxBar) * 100}%` }}>
                    <span className="ap-bar-val">{b.value}</span>
                  </div>
                </div>
                <span className="ap-bar-label">{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ap-card ap-top-card">
          <div className="ap-card-header"><div><h3>Top Performers</h3><p>By conversion score</p></div></div>
          <div className="ap-top-list">
            {[...agents].sort((a, b) => b.score - a.score).slice(0, 4).map((a, i) => (
              <div key={a.agent_id || a.id} className="ap-top-item">
                <div className={`ap-rank ap-rank-${i + 1}`}>{i + 1}</div>
                <div className="ap-top-info">
                  <span className="ap-top-name">{a.name}</span>
                  <span className="ap-top-type">{a.type}</span>
                </div>
                <div className="ap-score-wrap">
                  <div className="ap-score-bar-bg"><div className="ap-score-bar-fill" style={{ width: `${a.score}%` }} /></div>
                  <span className="ap-score-num">{a.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ap-card ap-table-card">
        <div className="ap-card-header">
          <div>
            <h3>All Agents</h3>
            <p>{tableLoading ? "Loading..." : `${filtered.length} agents found`}</p>
          </div>
          <div className="ap-table-controls">
            <div className="ap-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input placeholder="Search agent..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="ap-filter-select">
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="DSA">DSA</option>
              <option value="Broker">Broker</option>
              <option value="Lead Partner">Lead Partner</option>
            </select>
          </div>
        </div>

        {apiError && (
          <div style={{ padding: "16px 24px", color: "#dc2626", background: "#fef2f2", borderBottom: "1px solid #fecaca", fontSize: 13 }}>
            ⚠ {apiError} <button onClick={fetchAgents} style={{ marginLeft: 8, color: "#4f46e5", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Retry</button>
          </div>
        )}

        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Agent ID</th><th>Name</th><th>Type</th><th>Leads</th>
                <th>Converted</th><th>Payout</th><th>Score</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableLoading ? (
                <TableSkeleton />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                    No agents found.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.agent_id || a.id}>
                    <td className="ap-agent-id">{a.agent_id || a.id}</td>
                    <td className="ap-agent-name">
                      <div className="ap-avatar">{a.name?.charAt(0)}</div>{a.name}
                    </td>
                    <td>
                      <span className="ap-type-badge" style={{ background: typeColors[a.type]?.bg, color: typeColors[a.type]?.color }}>{a.type}</span>
                    </td>
                    <td>{a.leads}</td>
                    <td>{a.converted}</td>
                    <td className="ap-payout">₹{Number(a.payout).toLocaleString()}</td>
                    <td>
                      <div className="ap-score-cell">
                        <div className="ap-mini-bar">
                          <div className="ap-mini-fill" style={{ width: `${a.score}%`, background: a.score >= 80 ? "#22c55e" : a.score >= 60 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                        <span>{a.score}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`ap-status-badge ${a.status === "Active" ? "active" : "inactive"}`}>{a.status}</span>
                    </td>
                    <td>
                      <div className="ap-actions">
                        <button className="ap-action-btn" title="Edit" onClick={() => openEdit(a)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="ap-action-btn" title="View" onClick={() => setViewAgent(a)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="ap-action-btn ap-action-delete" title="Delete" onClick={() => setDeleteAgent(a)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
