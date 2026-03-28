import React, { useState, useEffect, useMemo } from "react";
import {
  ShowTenantService,
  NewTenantService,
  DashboardService,
} from "../services/ManageTenantsService";
import "./ManageTenants.css";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const planColors = {
  Enterprise: { bg: "#ede9fe", color: "#7c3aed", border: "#c4b5fd" },
  Pro:        { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
  Starter:    { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
};
const moduleIcons = {
  "Agent Mgmt":  "👥",
  "Payout":      "💳",
  "Performance": "📊",
  "Offers":      "🎁",
  "KYC":         "🪪",
};
const emptyTenant = {
  id: "", name: "", city: "", state: "", region: "West",
  agents: 0, active: true, plan: "Starter", monthlyVolume: "",
  contactName: "", contactEmail: "", contactPhone: "",
  joined: "", modules: ["Agent Mgmt"],
};

// ─────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`mt-toast mt-toast-${type}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>{msg}
    </div>
  );
}

// ─────────────────────────────────────────────
// Add / Edit Modal
// ─────────────────────────────────────────────
function TenantModal({ tenant, onClose, onSave, loading }) {
  const isEdit = !!tenant;
  const [form, setForm] = useState(tenant ? { ...tenant } : { ...emptyTenant });
  const [errors, setErrors] = useState({});

  const f = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: undefined })); };
  const toggleModule = (m) =>
    setForm((p) => ({
      ...p,
      modules: p.modules.includes(m) ? p.modules.filter((x) => x !== m) : [...p.modules, m],
    }));

  const validate = () => {
    const e = {};
    if (!form.name?.trim())         e.name         = "Required";
    if (!form.city?.trim())         e.city         = "Required";
    if (!form.contactName?.trim())  e.contactName  = "Required";
    if (!form.contactEmail?.trim()) e.contactEmail = "Required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const allModules = Object.keys(moduleIcons);

  return (
    <div className="mt-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mt-modal">
        <div className="mt-modal-header">
          <div className="mt-modal-title-wrap">
            <div className="mt-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <h2>{isEdit ? "Edit Tenant" : "Add New Tenant"}</h2>
              <p>{isEdit ? `Editing ${tenant.id}` : "Onboard a new tenant organisation"}</p>
            </div>
          </div>
          <button className="mt-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="mt-modal-body">
          <div className="mt-section">Organisation Details</div>
          <div className="mt-form-grid">
            <div className="mt-mf full">
              <label>Organisation Name <span>*</span></label>
              <input value={form.name} onChange={(e) => f("name", e.target.value)} placeholder="e.g. Mumbai Metro Finance" className={errors.name ? "err" : ""} />
              {errors.name && <span className="mt-err">{errors.name}</span>}
            </div>
            <div className="mt-mf">
              <label>City <span>*</span></label>
              <input value={form.city} onChange={(e) => f("city", e.target.value)} placeholder="City" className={errors.city ? "err" : ""} />
              {errors.city && <span className="mt-err">{errors.city}</span>}
            </div>
            <div className="mt-mf">
              <label>State</label>
              <input value={form.state} onChange={(e) => f("state", e.target.value)} placeholder="State" />
            </div>
            <div className="mt-mf">
              <label>Region</label>
              <select value={form.region} onChange={(e) => f("region", e.target.value)}>
                {["North", "South", "East", "West", "Central"].map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="mt-mf">
              <label>Plan</label>
              <select value={form.plan} onChange={(e) => f("plan", e.target.value)}>
                <option>Starter</option><option>Pro</option><option>Enterprise</option>
              </select>
            </div>
            <div className="mt-mf">
              <label>Monthly Volume</label>
              <input value={form.monthlyVolume} onChange={(e) => f("monthlyVolume", e.target.value)} placeholder="e.g. ₹1.5Cr" />
            </div>
            <div className="mt-mf">
              <label>Status</label>
              <div className="mt-toggle">
                {["Active", "Inactive"].map((s) => (
                  <button key={s} type="button"
                    className={`mt-tog ${(form.active && s === "Active") || (!form.active && s === "Inactive") ? (s === "Active" ? "on" : "off") : ""}`}
                    onClick={() => f("active", s === "Active")}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-section" style={{ marginTop: 18 }}>Contact Person</div>
          <div className="mt-form-grid">
            <div className="mt-mf full">
              <label>Contact Name <span>*</span></label>
              <input value={form.contactName} onChange={(e) => f("contactName", e.target.value)} placeholder="Full name" className={errors.contactName ? "err" : ""} />
              {errors.contactName && <span className="mt-err">{errors.contactName}</span>}
            </div>
            <div className="mt-mf">
              <label>Email <span>*</span></label>
              <input type="email" value={form.contactEmail} onChange={(e) => f("contactEmail", e.target.value)} placeholder="email@org.com" className={errors.contactEmail ? "err" : ""} />
              {errors.contactEmail && <span className="mt-err">{errors.contactEmail}</span>}
            </div>
            <div className="mt-mf">
              <label>Phone</label>
              <input value={form.contactPhone} onChange={(e) => f("contactPhone", e.target.value)} placeholder="10-digit" maxLength={10} />
            </div>
          </div>

          <div className="mt-section" style={{ marginTop: 18 }}>Enabled Modules</div>
          <div className="mt-modules-grid">
            {allModules.map((m) => (
              <button key={m} type="button" className={`mt-module-btn ${form.modules.includes(m) ? "selected" : ""}`} onClick={() => toggleModule(m)}>
                <span>{moduleIcons[m]}</span>{m}
                {form.modules.includes(m) && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" style={{ marginLeft: "auto" }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-modal-footer">
          <button className="mt-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="mt-btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Tenant"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function ManageTenants() {
  const [tenants,     setTenants]     = useState([]);
  const [apiLoading,  setApiLoading]  = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [modal,       setModal]       = useState(null);   // null | "add" | tenantObj
  const [search,      setSearch]      = useState("");
  const [filterReg,   setFilterReg]   = useState("All");
  const [filterPlan,  setFilterPlan]  = useState("All");
  const [viewTenant,  setViewTenant]  = useState(null);
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // ── Load tenants on mount ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await ShowTenantService.getAll();
        setTenants(data);
      } catch (err) {
        showToast("Failed to load tenants: " + err.message, "error");
      } finally {
        setApiLoading(false);
      }
    })();
  }, []);

  // ── Sync dashboard stats after tenant list changes ─────────────
  const syncDashboard = (list) => {
    DashboardService.sync({
      totalTenants: list.length,
      active:       list.filter((t) => t.active).length,
      enterprises:  list.filter((t) => t.plan === "Enterprise").length,
      totalAgents:  list.reduce((s, t) => s + t.agents, 0),
    }).catch(() => {}); // fire-and-forget
  };

  // ── Filtered list (client-side, mirrors toolbar) ──────────────
  const filtered = useMemo(() =>
    tenants.filter((t) => {
      const ms = t.name.toLowerCase().includes(search.toLowerCase()) ||
                 t.id.includes(search) ||
                 t.city.toLowerCase().includes(search.toLowerCase());
      const mr = filterReg  === "All" || t.region === filterReg;
      const mp = filterPlan === "All" || t.plan   === filterPlan;
      return ms && mr && mp;
    }),
    [tenants, search, filterReg, filterPlan]
  );

  // ── Save (create or update) ────────────────────────────────────
  const handleSave = async (form) => {
    setSaveLoading(true);
    try {
      const isExisting = tenants.find((t) => t.id === form.id);
      let saved;

      if (isExisting) {
        // Update ShowTenant record  +  NewTenant record
        saved = await ShowTenantService.update(form.id, form);
        await NewTenantService.create(form).catch(() => {}); // best-effort sync
        setTenants((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
        // keep detail panel in sync
        if (viewTenant?.id === saved.id) setViewTenant(saved);
        showToast(`"${saved.name}" updated`);
      } else {
        // Create ShowTenant record first (source of truth for the list)
        saved = await ShowTenantService.create(form);
        // Also log into NewTenant (onboarding trail)
        await NewTenantService.create(form).catch(() => {});
        setTenants((prev) => [saved, ...prev]);
        showToast(`"${saved.name}" added successfully`);
      }

      const next = isExisting
        ? tenants.map((t) => (t.id === saved.id ? saved : t))
        : [saved, ...tenants];
      syncDashboard(next);
      setModal(null);
    } catch (err) {
      showToast("Save failed: " + err.message, "error");
    } finally {
      setSaveLoading(false);
    }
  };

  // ── Toggle active / inactive ───────────────────────────────────
  const toggleActive = async (id) => {
    const t = tenants.find((t) => t.id === id);
    if (!t) return;
    try {
      const updated = t.active
        ? await ShowTenantService.deactivate(id)
        : await ShowTenantService.activate(id);
      const next = tenants.map((x) => (x.id === id ? updated : x));
      setTenants(next);
      if (viewTenant?.id === id) setViewTenant(updated);
      showToast(`${updated.name} ${updated.active ? "activated" : "deactivated"}`, updated.active ? "success" : "error");
      syncDashboard(next);
    } catch (err) {
      showToast("Status update failed: " + err.message, "error");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const t = tenants.find((t) => t.id === id);
    try {
      await ShowTenantService.delete(id);
      const next = tenants.filter((x) => x.id !== id);
      setTenants(next);
      if (viewTenant?.id === id) setViewTenant(null);
      showToast(`"${t?.name}" removed`, "error");
      syncDashboard(next);
    } catch (err) {
      showToast("Delete failed: " + err.message, "error");
    }
  };

  // ── Derived stats (for stat cards) ────────────────────────────
  const totalAgents   = tenants.reduce((s, t) => s + t.agents, 0);
  const activeTenants = tenants.filter((t) => t.active).length;

  // ──────────────────────────────────────────────────────────────
  return (
    <div className="mt-root">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal && (
        <TenantModal
          tenant={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          loading={saveLoading}
        />
      )}

      {/* Header */}
      <div className="mt-header">
        <div className="mt-header-left">
          <div className="mt-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <h1 className="mt-title">Manage Tenants</h1>
            <p className="mt-subtitle">Oversee all tenant organisations, plans and module access</p>
          </div>
        </div>
        <div className="mt-header-actions">
          <button className="mt-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button className="mt-btn-primary" onClick={() => setModal("add")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Tenant
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-stats">
        {[
          { label: "Total Tenants", value: tenants.length,                                  color: "slate"  },
          { label: "Active",        value: activeTenants,                                   color: "green"  },
          { label: "Enterprise",    value: tenants.filter((t) => t.plan === "Enterprise").length, color: "violet" },
          { label: "Total Agents",  value: totalAgents,                                     color: "blue"   },
        ].map((s) => (
          <div key={s.label} className={`mt-stat mt-stat-${s.color}`}>
            <div className="mt-stat-val">{s.value}</div>
            <div className="mt-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className={`mt-layout ${viewTenant ? "split" : ""}`}>

        {/* Left: tenant list */}
        <div className="mt-list-panel">
          <div className="mt-toolbar">
            <div className="mt-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input placeholder="Search tenants…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="mt-filter-row">
              <select className="mt-select" value={filterReg} onChange={(e) => setFilterReg(e.target.value)}>
                {["All", "North", "South", "East", "West", "Central"].map((r) => (
                  <option key={r} value={r}>{r === "All" ? "All Regions" : r}</option>
                ))}
              </select>
              <select className="mt-select" value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)}>
                {["All", "Starter", "Pro", "Enterprise"].map((p) => (
                  <option key={p} value={p}>{p === "All" ? "All Plans" : p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-tenant-list">
            {apiLoading && <div className="mt-empty-list">Loading tenants…</div>}
            {!apiLoading && filtered.map((t) => (
              <div
                key={t.id}
                className={`mt-tenant-row ${viewTenant?.id === t.id ? "active" : ""} ${!t.active ? "inactive" : ""}`}
                onClick={() => setViewTenant(t)}
              >
                <div className="mt-row-icon">{t.name.charAt(0)}</div>
                <div className="mt-row-info">
                  <div className="mt-row-name">{t.name}</div>
                  <div className="mt-row-meta">{t.city} · {t.agents} agents</div>
                </div>
                <div className="mt-row-right">
                  <span className="mt-plan-badge" style={{
                    background: planColors[t.plan]?.bg,
                    color:      planColors[t.plan]?.color,
                    border:     `1px solid ${planColors[t.plan]?.border}`,
                  }}>{t.plan}</span>
                  <span className={`mt-dot ${t.active ? "on" : "off"}`} />
                </div>
              </div>
            ))}
            {!apiLoading && filtered.length === 0 && (
              <div className="mt-empty-list">No tenants found</div>
            )}
          </div>
          <div className="mt-list-footer">{filtered.length} tenants</div>
        </div>

        {/* Right: detail panel */}
        {viewTenant && (
          <div className="mt-detail-panel">
            <div className="mt-detail-header">
              <div className="mt-detail-banner">
                <div className="mt-detail-avatar">{viewTenant.name.charAt(0)}</div>
                <div>
                  <h2 className="mt-detail-name">{viewTenant.name}</h2>
                  <div className="mt-detail-sub">{viewTenant.id} · Joined {viewTenant.joined}</div>
                </div>
                <button className="mt-detail-close" onClick={() => setViewTenant(null)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="mt-detail-badges">
                <span className="mt-plan-badge" style={{
                  background: planColors[viewTenant.plan]?.bg,
                  color:      planColors[viewTenant.plan]?.color,
                  border:     `1px solid ${planColors[viewTenant.plan]?.border}`,
                }}>{viewTenant.plan}</span>
                <span className={`mt-status-pill ${viewTenant.active ? "active" : "inactive"}`}>
                  {viewTenant.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="mt-detail-body">
              <div className="mt-detail-grid">
                {[
                  ["📍 Location", `${viewTenant.city}, ${viewTenant.state}`],
                  ["🗺 Region",   viewTenant.region],
                  ["👥 Agents",   viewTenant.agents],
                  ["💰 Volume",   viewTenant.monthlyVolume || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="mt-detail-tile">
                    <div className="mt-tile-label">{k}</div>
                    <div className="mt-tile-val">{v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-detail-section">Contact Person</div>
              <div className="mt-contact-card">
                <div className="mt-contact-avatar">{viewTenant.contactName.charAt(0)}</div>
                <div className="mt-contact-info">
                  <div className="mt-contact-name">{viewTenant.contactName}</div>
                  <div className="mt-contact-email">{viewTenant.contactEmail}</div>
                  <div className="mt-contact-phone">{viewTenant.contactPhone}</div>
                </div>
              </div>

              <div className="mt-detail-section">Active Modules</div>
              <div className="mt-modules-row">
                {viewTenant.modules.map((m) => (
                  <div key={m} className="mt-module-chip">
                    <span>{moduleIcons[m]}</span>{m}
                  </div>
                ))}
              </div>

              <div className="mt-detail-actions">
                <button className="mt-action-edit" onClick={() => { setModal(viewTenant); setViewTenant(null); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Tenant
                </button>
                <button className="mt-action-toggle" onClick={() => toggleActive(viewTenant.id)}>
                  {viewTenant.active ? "Deactivate" : "Activate"}
                </button>
                <button className="mt-action-del" onClick={() => handleDelete(viewTenant.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
