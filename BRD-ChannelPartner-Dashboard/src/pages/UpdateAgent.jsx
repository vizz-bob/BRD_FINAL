import React, { useState, useEffect } from "react";
import "./UpdateAgent.css";

// ── Services ─────────────────────────────────────────────────────────────────
import {
  AgentService,
  KYCService,
  AddressService,
  SettingService,
} from "../services/UpdateAgentService";

// ── Constants ─────────────────────────────────────────────────────────────────
const tenants   = ["mumbai", "delhi", "bangalore", "hyderabad"];
const tenantLabels = {
  mumbai:    "Tenant — Mumbai",
  delhi:     "Tenant — Delhi",
  bangalore: "Tenant — Bangalore",
  hyderabad: "Tenant — Hyderabad",
};
const stateList = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "Gujarat", "Rajasthan", "West Bengal"];
const tabs      = ["Basic Info", "KYC Details", "Address", "Settings"];

const tabIcons = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg>,
];

// ── Field component ───────────────────────────────────────────────────────────
function Field({ label, required, error, icon, children }) {
  return (
    <div className="ua-field">
      <label className="ua-label">{label}{required && <span className="ua-required">*</span>}</label>
      <div className={`ua-input-wrap ${error ? "has-error" : ""}`}>
        {icon && <span className="ua-input-icon">{icon}</span>}
        {children}
      </div>
      {error && <span className="ua-error-msg">⚠ {error}</span>}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div className={`ua-toast ua-toast-${type}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>{msg}
    </div>
  );
}

// ── Loading Spinner ────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="ua-spinner-wrap">
      <div className="ua-spinner" />
      <span>Loading agents…</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UpdateAgent() {
  // — list / search state
  const [agentList,    setAgentList]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState(null);
  const [query,        setQuery]        = useState("");

  // — form state
  const [selected,     setSelected]     = useState(null);
  const [form,         setForm]         = useState(null);
  const [activeTab,    setActiveTab]    = useState(0);
  const [errors,       setErrors]       = useState({});
  const [toast,        setToast]        = useState(null);
  const [showSearch,   setShowSearch]   = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);

  // — profile sub-records
  const [kycRecord,    setKycRecord]    = useState(null);
  const [addressRecord,setAddressRecord]= useState(null);
  const [settingRecord,setSettingRecord]= useState(null);

  // ── Load agent list on mount ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/agents/");
        console.log("Status:", res.status, "Content-Type:", res.headers.get("content-type"));
        if (!res.ok) throw new Error("HTTP " + res.status);
        const agents = await res.json();
        console.log("Agents from API:", agents);
        // Handle both plain array and DRF paginated { results: [] }
        setAgentList(Array.isArray(agents) ? agents : (agents.results ?? []));
      } catch (err) {
        console.error("Fetch error:", err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = query.trim()
    ? agentList.filter(a =>
        a.full_name?.toLowerCase().includes(query.toLowerCase()) ||
        String(a.id).includes(query)
      )
    : agentList;

  // ── Select agent → load full profile ─────────────────────────────────────
  const safeFetch = async (fn) => { try { return await fn(); } catch { return []; } };

  const selectAgent = async (agent) => {
    try {
      setLoading(true);

      const [kycs, addresses, settings] = await Promise.all([
        safeFetch(() => KYCService.getAll()),
        safeFetch(() => AddressService.getAll()),
        safeFetch(() => SettingService.getAll()),
      ]);

      const kyc     = Array.isArray(kycs)     ? kycs.find(k => k.agent === agent.id)      || null : null;
      const address = Array.isArray(addresses) ? addresses.find(a => a.agent === agent.id) || null : null;
      const setting = Array.isArray(settings)  ? settings.find(s => s.id === agent.id)     || null : null;

      setSelected(agent);
      setKycRecord(kyc);
      setAddressRecord(address);
      setSettingRecord(setting);

      // Flatten everything into a single form state
      setForm({
        // Agent
        id:           agent.id,
        name:         agent.full_name,
        dob:          agent.date_of_birth,
        phone:        agent.phone_number,
        email:        agent.email_address,
        type:         agent.agent_type,
        status:       agent.status,
        // KYC
        pan:          kyc?.pan_number      || "",
        aadhaar:      kyc?.aadhaar_number  || "",
        bank:         kyc?.bank_name       || "",
        ifsc:         kyc?.ifsc_code       || "",
        account:      kyc?.account_number  || "",
        // Address
        address:      address?.street_address || "",
        city:         address?.city           || "",
        state:        address?.state          || "",
        pincode:      address?.pincode        || "",
        // Settings
        tenant:             setting?.tenant                    || "mumbai",
        notif_email:        setting?.email_notifications       || false,
        notif_sms:          setting?.sms_notifications         || false,
        auto_payout:        setting?.auto_payout               || false,
        show_report:        setting?.performance_report_access || false,
      });

      setUploadedDocs([]);
      setPhotoPreview(null);
      setErrors({});
      setActiveTab(0);
      setSaved(false);
      setShowSearch(false);
    } catch (err) {
      setToast({ msg: `Failed to load agent: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ── Field updater ─────────────────────────────────────────────────────────
  const f = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: undefined }));
    setSaved(false);
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name?.trim())    e.name    = "Full name is required";
    if (!form.phone?.trim())   e.phone   = "Phone number is required";
    if (!form.email?.trim())   e.email   = "Email is required";
    if (!form.pan?.trim())     e.pan     = "PAN is required";
    if (!form.aadhaar?.trim()) e.aadhaar = "Aadhaar is required";
    if (!form.bank?.trim())    e.bank    = "Bank name is required";
    if (!form.account?.trim()) e.account = "Account number is required";
    if (!form.ifsc?.trim())    e.ifsc    = "IFSC code is required";
    if (!form.address?.trim()) e.address = "Address is required";
    if (!form.city?.trim())    e.city    = "City is required";
    if (!form.pincode?.trim()) e.pincode = "Pincode is required";
    return e;
  };

  // ── Save — calls all 4 services ────────────────────────────────────────────
  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      if (e.name || e.phone || e.email)                          setActiveTab(0);
      else if (e.pan || e.aadhaar || e.bank || e.account || e.ifsc) setActiveTab(1);
      else if (e.address || e.city || e.pincode)                 setActiveTab(2);
      setToast({ msg: "Please fix the errors before saving.", type: "error" });
      return;
    }

    try {
      setSaving(true);

      // 1 — Agent
      await AgentService.partialUpdate(form.id, {
        full_name:     form.name,
        date_of_birth: form.dob,
        phone_number:  form.phone,
        email_address: form.email,
        agent_type:    form.type,
        status:        form.status,
      });

      // 2 — KYC  (create if missing, update if exists)
      const kycData = {
        agent:          form.id,
        pan_number:     form.pan,
        aadhaar_number: form.aadhaar,
        bank_name:      form.bank,
        ifsc_code:      form.ifsc,
        account_number: form.account,
      };

      // Attach any newly uploaded documents
      if (uploadedDocs.length && uploadedDocs[0] instanceof File) {
        kycData.document = uploadedDocs[0];
      }

      if (kycRecord?.id) {
        await KYCService.partialUpdate(kycRecord.id, kycData);
      } else {
        const created = await KYCService.create(kycData);
        setKycRecord(created);
      }

      // 3 — Address
      const addrData = {
        agent:          form.id,
        street_address: form.address,
        city:           form.city,
        state:          form.state,
        pincode:        form.pincode,
      };

      if (addressRecord?.id) {
        await AddressService.partialUpdate(addressRecord.id, addrData);
      } else {
        const created = await AddressService.create(addrData);
        setAddressRecord(created);
      }

      // 4 — Settings
      const settingData = {
        tenant:                   form.tenant,
        email_notifications:      form.notif_email,
        sms_notifications:        form.notif_sms,
        auto_payout:              form.auto_payout,
        performance_report_access: form.show_report,
        action:                   "save",
      };

      if (settingRecord?.id) {
        await SettingService.partialUpdate(settingRecord.id, settingData);
      } else {
        const created = await SettingService.create(settingData);
        setSettingRecord(created);
      }

      // Refresh agent list so search reflects changes
      const refreshed = await AgentService.getAll();
      setAgentList(refreshed);

      setSaved(true);
      setToast({ msg: `Agent ${form.name} updated successfully!`, type: "success" });
    } catch (err) {
      setToast({ msg: `Save failed: ${err.message}`, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // ── Photo & doc handlers ──────────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setSaved(false);
  };

  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedDocs(p => [
      ...p,
      ...files.map(file => Object.assign(file, {
        preview: { name: file.name, size: (file.size / 1024).toFixed(1) + " KB" },
      })),
    ]);
    setSaved(false);
  };

  const removeDoc = (i) => setUploadedDocs(p => p.filter((_, idx) => idx !== i));

  // ── SEARCH VIEW ───────────────────────────────────────────────────────────
  if (showSearch) return (
    <div className="ua-root">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="ua-page-header">
        <div>
          <h1 className="ua-title">Update Agent</h1>
          <p className="ua-subtitle">Search and select an agent to update their details</p>
        </div>
      </div>

      <div className="ua-search-card">
        <div className="ua-search-hero">
          <div className="ua-search-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <h2>Find Agent</h2>
            <p>Search by name or Agent ID</p>
          </div>
        </div>

        <div className="ua-search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or Agent ID..."
          />
          {query && (
            <button className="ua-search-clear" onClick={() => setQuery("")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        <div className="ua-agent-list">
          {loading && <Spinner />}
          {fetchError && <div className="ua-empty ua-error-state">⚠ {fetchError}</div>}
          {!loading && !fetchError && filtered.length === 0 && (
            <div className="ua-empty">No agents found{query ? ` for "${query}"` : ""}</div>
          )}
          {!loading && filtered.map(agent => (
            <button key={agent.id} className="ua-agent-row" onClick={() => selectAgent(agent)}>
              <div className="ua-agent-avatar">{agent.full_name?.charAt(0)}</div>
              <div className="ua-agent-row-info">
                <span className="ua-agent-row-name">{agent.full_name}</span>
                <span className="ua-agent-row-meta">ID: {agent.id} · {agent.agent_type?.toUpperCase()}</span>
              </div>
              <span className={`ua-agent-row-status ${agent.status === "active" ? "active" : "inactive"}`}>
                {agent.status === "active" ? "Active" : "Inactive"}
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="ua-row-arrow">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── FORM VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="ua-root">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="ua-page-header">
        <div className="ua-header-left">
          <button className="ua-back-btn" onClick={() => setShowSearch(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <div>
            <h1 className="ua-title">Update Agent</h1>
            <p className="ua-subtitle">
              Editing <strong>{selected?.full_name}</strong> · ID {selected?.id}
            </p>
          </div>
        </div>
        <div className="ua-header-actions">
          <button
            className="ua-btn-outline"
            onClick={() => selectAgent(selected)}
            disabled={saving}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
              <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>
            </svg>
            Reset
          </button>
          <button className={`ua-btn-save ${saved ? "saved" : ""}`} onClick={handleSave} disabled={saving}>
            {saving
              ? <><span className="ua-btn-spinner" /> Saving…</>
              : saved
                ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg> Saved!</>
                : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>
            }
          </button>
        </div>
      </div>

      <div className="ua-form-layout">

        {/* Left: Agent Card */}
        <div className="ua-agent-card">
          <div className="ua-agent-card-banner">
            <div className="ua-photo-wrap">
              {photoPreview
                ? <img src={photoPreview} alt="Agent" className="ua-photo-img" />
                : <div className="ua-photo-placeholder">{form.name?.charAt(0) || "?"}</div>
              }
              <label className="ua-photo-edit" title="Upload photo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
              </label>
            </div>
            <h3 className="ua-card-name">{form.name || "—"}</h3>
            <span className="ua-card-id">ID: {form.id}</span>
          </div>

          <div className="ua-card-body">
            <div className="ua-card-row">
              <span className="ua-card-key">Type</span>
              <span className="ua-card-val">{form.type?.toUpperCase()}</span>
            </div>
            <div className="ua-card-row">
              <span className="ua-card-key">Phone</span>
              <span className="ua-card-val">{form.phone || "—"}</span>
            </div>
            <div className="ua-card-row">
              <span className="ua-card-key">Email</span>
              <span className="ua-card-val ua-card-email">{form.email || "—"}</span>
            </div>
            <div className="ua-card-row">
              <span className="ua-card-key">Tenant</span>
              <span className="ua-card-val">{tenantLabels[form.tenant] || "—"}</span>
            </div>
            <div className="ua-card-row">
              <span className="ua-card-key">Status</span>
              <span className={`ua-status-pill ${form.status === "active" ? "active" : "inactive"}`}>
                {form.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Completion bar */}
          <div className="ua-completion">
            <div className="ua-completion-header">
              <span>Profile Completion</span>
              <span className="ua-completion-pct">
                {Math.round(
                  [form.name, form.phone, form.email, form.pan, form.aadhaar, form.bank, form.account, form.address, form.city]
                    .filter(Boolean).length / 9 * 100
                )}%
              </span>
            </div>
            <div className="ua-completion-bar">
              <div className="ua-completion-fill" style={{
                width: `${Math.round(
                  [form.name, form.phone, form.email, form.pan, form.aadhaar, form.bank, form.account, form.address, form.city]
                    .filter(Boolean).length / 9 * 100
                )}%`
              }} />
            </div>
          </div>
        </div>

        {/* Right: Tabbed Form */}
        <div className="ua-form-card">
          {/* Tabs */}
          <div className="ua-tabs">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                className={`ua-tab ${activeTab === i ? "active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {tabIcons[i]}
                <span>{tab}</span>
                {(
                  (i === 0 && (errors.name || errors.phone || errors.email)) ||
                  (i === 1 && (errors.pan || errors.aadhaar || errors.bank || errors.account || errors.ifsc)) ||
                  (i === 2 && (errors.address || errors.city || errors.pincode))
                ) && <span className="ua-tab-err-dot" />}
              </button>
            ))}
          </div>

          <div className="ua-tab-body">

            {/* TAB 0 — Basic Info */}
            {activeTab === 0 && (
              <div className="ua-tab-content">
                <div className="ua-form-grid">
                  <Field label="Full Name" required error={errors.name}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}>
                    <input value={form.name} onChange={e => f("name", e.target.value)} placeholder="Full name" />
                  </Field>

                  <Field label="Date of Birth"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}>
                    <input type="date" value={form.dob} onChange={e => f("dob", e.target.value)} />
                  </Field>

                  <Field label="Phone Number" required error={errors.phone}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>}>
                    <input value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="10-digit mobile" maxLength={10} />
                  </Field>

                  <Field label="Email Address" required error={errors.email}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>}>
                    <input type="email" value={form.email} onChange={e => f("email", e.target.value)} placeholder="agent@email.com" />
                  </Field>

                  <Field label="Agent Type" required>
                    <select value={form.type} onChange={e => f("type", e.target.value)}>
                      <option value="dsa">DSA</option>
                      <option value="broker">Broker</option>
                      <option value="lead_partner">Lead Partner</option>
                    </select>
                  </Field>

                  <div className="ua-field">
                    <label className="ua-label">Status <span className="ua-required">*</span></label>
                    <div className="ua-status-toggle">
                      {[["active", "Active"], ["inactive", "Inactive"]].map(([val, label]) => (
                        <button key={val} type="button"
                          className={`ua-toggle-btn ${form.status === val ? (val === "active" ? "tog-on" : "tog-off") : ""}`}
                          onClick={() => f("status", val)}>
                          <span className="ua-toggle-dot" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1 — KYC Details */}
            {activeTab === 1 && (
              <div className="ua-tab-content">
                <div className="ua-section-head">Identity Documents</div>
                <div className="ua-form-grid">
                  <Field label="PAN Number" required error={errors.pan}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>}>
                    <input value={form.pan} onChange={e => f("pan", e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} style={{ textTransform: "uppercase", letterSpacing: "1px" }} />
                  </Field>

                  <Field label="Aadhaar Number" required error={errors.aadhaar}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/></svg>}>
                    <input value={form.aadhaar} onChange={e => f("aadhaar", e.target.value)} placeholder="XXXX XXXX XXXX" maxLength={14} />
                  </Field>
                </div>

                <div className="ua-section-head" style={{ marginTop: 20 }}>Bank Details</div>
                <div className="ua-form-grid">
                  <Field label="Bank Name" required error={errors.bank}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>}>
                    <input value={form.bank} onChange={e => f("bank", e.target.value)} placeholder="e.g. HDFC Bank" />
                  </Field>

                  <Field label="IFSC Code" required error={errors.ifsc}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>}>
                    <input value={form.ifsc} onChange={e => f("ifsc", e.target.value.toUpperCase())} placeholder="HDFC0001234" maxLength={11} style={{ textTransform: "uppercase", letterSpacing: "1px" }} />
                  </Field>

                  <Field label="Account Number" required error={errors.account}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>}>
                    <input value={form.account} onChange={e => f("account", e.target.value)} placeholder="Account number" />
                  </Field>
                </div>

                <div className="ua-section-head" style={{ marginTop: 20 }}>KYC Documents</div>
                <label className="ua-doc-upload">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span>Click to upload documents</span>
                  <small>PDF, JPG, PNG — max 5MB each</small>
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocUpload} style={{ display: "none" }} />
                </label>
                {uploadedDocs.length > 0 && (
                  <div className="ua-doc-list">
                    {uploadedDocs.map((doc, i) => (
                      <div key={i} className="ua-doc-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <div className="ua-doc-info">
                          <span className="ua-doc-name">{doc.name}</span>
                          {doc.preview?.size && <span className="ua-doc-size">{doc.preview.size}</span>}
                        </div>
                        <button className="ua-doc-remove" onClick={() => removeDoc(i)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2 — Address */}
            {activeTab === 2 && (
              <div className="ua-tab-content">
                <div className="ua-form-grid">
                  <Field label="Street Address" required error={errors.address}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}>
                    <input value={form.address} onChange={e => f("address", e.target.value)} placeholder="House / Flat / Block, Street" />
                  </Field>

                  <Field label="City" required error={errors.city}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}>
                    <input value={form.city} onChange={e => f("city", e.target.value)} placeholder="City" />
                  </Field>

                  <Field label="State" required>
                    <select value={form.state} onChange={e => f("state", e.target.value)}>
                      {stateList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>

                  <Field label="Pincode" required error={errors.pincode}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 9.81 2 2 0 015 8h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 15.91"/></svg>}>
                    <input value={form.pincode} onChange={e => f("pincode", e.target.value)} placeholder="6-digit pincode" maxLength={6} />
                  </Field>
                </div>

                <div className="ua-map-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Map preview will appear here</span>
                  <small>{form.address ? `${form.address}, ${form.city}, ${form.state} — ${form.pincode}` : "Fill in the address above"}</small>
                </div>
              </div>
            )}

            {/* TAB 3 — Settings */}
            {activeTab === 3 && (
              <div className="ua-tab-content">
                <div className="ua-section-head">Tenant Assignment</div>
                <div className="ua-tenant-grid">
                  {tenants.map(t => (
                    <button key={t} type="button"
                      className={`ua-tenant-card ${form.tenant === t ? "selected" : ""}`}
                      onClick={() => f("tenant", t)}
                    >
                      <div className="ua-tenant-icon">🏢</div>
                      <span>{tenantLabels[t]}</span>
                      {form.tenant === t && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" className="ua-tenant-check"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  ))}
                </div>

                <div className="ua-section-head" style={{ marginTop: 24 }}>Account Settings</div>
                <div className="ua-settings-list">
                  {[
                    { key: "notif_email", label: "Email Notifications",       sub: "Receive payout & performance alerts via email" },
                    { key: "notif_sms",   label: "SMS Notifications",         sub: "Receive SMS for lead updates" },
                    { key: "auto_payout", label: "Auto Payout",               sub: "Automatically process payouts on milestone completion" },
                    { key: "show_report", label: "Performance Report Access", sub: "Allow agent to view their own performance reports" },
                  ].map(setting => (
                    <div key={setting.key} className="ua-setting-row">
                      <div className="ua-setting-info">
                        <span className="ua-setting-label">{setting.label}</span>
                        <span className="ua-setting-sub">{setting.sub}</span>
                      </div>
                      <button
                        type="button"
                        className={`ua-switch ${form[setting.key] ? "on" : ""}`}
                        onClick={() => f(setting.key, !form[setting.key])}
                      >
                        <span className="ua-switch-thumb" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tab Footer */}
          <div className="ua-form-footer">
            <button
              className="ua-btn-outline"
              onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
              disabled={activeTab === 0 || saving}
            >← Previous</button>
            <div className="ua-tab-dots">
              {tabs.map((_, i) => <span key={i} className={`ua-dot ${activeTab === i ? "active" : ""}`} />)}
            </div>
            {activeTab < tabs.length - 1
              ? <button className="ua-btn-save" onClick={() => setActiveTab(activeTab + 1)} disabled={saving}>Next →</button>
              : <button className={`ua-btn-save ${saved ? "saved" : ""}`} onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
