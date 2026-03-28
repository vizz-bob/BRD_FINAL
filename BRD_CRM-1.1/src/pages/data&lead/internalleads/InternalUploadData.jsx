import React, { useState, useEffect, useRef } from "react";
import {
  UserCheck, Upload as UploadIcon, UserPlus, Database,
  X, Award, Users, FileUp, ClipboardList, Plus, CheckCircle
} from "lucide-react";
import { InternalLeadService } from "../../../services/dataAndLeads.service";

const LEAD_SOURCES = ["Employee Referral", "Internal Inquiry", "Internal Campaign"];
const LEAD_STATUSES = [
  { value: "RAW", label: "Raw" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "HOT", label: "Hot" },
];
const LEAD_QUALITIES = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];
const PRODUCTS = ["Home Loan", "Personal Loan", "Business Loan", "Car Loan", "Education Loan"];
const DEPARTMENTS = ["Sales", "HR", "Operations", "Marketing", "Customer Service"];
const PRIORITY_LEVELS = ["High Priority", "Medium Priority", "Standard"];

const EMPTY_FORM = {
  internal_source: "", product: "", campaign_name: "", lead_status: "",
  contact_name: "", contact_phone: "", contact_email: "",
  lead_quality: "", internal_lead_id: "", consent_obtained: false,
  notes: "", follow_up_date: "", tags: "",
  Upload_method: "manual",
};

const EMPTY_REFERRAL_FORM = {
  referrer_name: "", referrer_department: "", contact_name: "", contact_phone: "",
  contact_email: "", product: "", lead_quality: "HIGH", notes: "",
  consent_obtained: false, campaign_name: "Employee Referral Program",
  lead_status: "RAW", Upload_method: "employee_refferal",
  internal_source: "Employee Referral",
};

const InternalUploadData = ({ onLeadCreated }) => {
  const [uploadMethod, setUploadMethod] = useState("employee");

  // ── Employee referral state ──
  const [referrals, setReferrals] = useState([]);
  const [referralLoading, setReferralLoading] = useState(false);
  const [selectedReferrals, setSelectedReferrals] = useState([]);
  const [department, setDepartment] = useState("");
  const [priorityTag, setPriorityTag] = useState("");
  const [showAddReferralForm, setShowAddReferralForm] = useState(false);
  const [referralForm, setReferralForm] = useState(EMPTY_REFERRAL_FORM);
  const [referralSubmitting, setReferralSubmitting] = useState(false);
  const [referralResult, setReferralResult] = useState(null);

  // ── File upload state ──
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // ── Manual entry state ──
  const [showManualForm, setShowManualForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualResult, setManualResult] = useState(null);

  // Fetch pending employee referrals (unassigned internal leads from employee source)
  const fetchReferrals = async () => {
    setReferralLoading(true);
    try {
      const res = await InternalLeadService.list({ source: "Employee Referral", page_size: 200 });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      setReferrals(data);
    } catch (err) {
      console.error("Fetch referrals failed:", err);
    } finally {
      setReferralLoading(false);
    }
  };

  useEffect(() => {
    if (uploadMethod === "employee") fetchReferrals();
  }, [uploadMethod]);

  // ── Employee referral handlers ──
  const toggleReferral = (id) =>
    setSelectedReferrals(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);

  const handleAddReferral = async (e) => {
    e.preventDefault();
    setReferralSubmitting(true);
    setReferralResult(null);
    try {
      await InternalLeadService.employeeReferral(referralForm);
      setReferralResult({ ok: true, msg: "Referral added successfully!" });
      setReferralForm(EMPTY_REFERRAL_FORM);
      setShowAddReferralForm(false);
      fetchReferrals();
      onLeadCreated?.();
    } catch (err) {
      const detail = err.response?.data ? JSON.stringify(err.response.data, null, 2) : "Failed to add referral.";
      setReferralResult({ ok: false, msg: detail });
    } finally {
      setReferralSubmitting(false);
    }
  };

  // ── File upload handlers ──
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      try {
        const dt = new DataTransfer();
        dt.items.add(f);
        if (fileInputRef.current) fileInputRef.current.files = dt.files;
      } catch (_) {}
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const fileToUpload = fileInputRef.current?.files?.[0] || file;
    if (!fileToUpload) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const fd = new FormData();
      fd.append("file", fileToUpload);
      const res = await InternalLeadService.uploadFile(fd);
      const { created_count = 0, failed_count = 0, failed_rows = [] } = res.data;
      let msg = `${created_count} leads created from "${fileToUpload.name}"!`;
      if (failed_count > 0) {
        msg += `\n${failed_count} rows failed.`;
        failed_rows.slice(0, 3).forEach(f => { msg += `\n  Row ${f.row}: ${JSON.stringify(f.errors)}`; });
      }
      setUploadResult({ ok: created_count > 0, msg });
      if (created_count > 0) {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onLeadCreated?.();
      }
    } catch (err) {
      const detail = err.response?.data?.error || JSON.stringify(err.response?.data) || "Upload failed.";
      setUploadResult({ ok: false, msg: detail });
    } finally {
      setUploading(false);
    }
  };

  // ── Manual entry handler ──
  const handleManualSave = async (e) => {
    e.preventDefault();
    setManualSubmitting(true);
    setManualResult(null);
    try {
      const payload = {
        internal_source: formData.internal_source,
        Upload_method: "manual",
        product: formData.product,
        campaign_name: formData.campaign_name,
        lead_status: formData.lead_status,
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        lead_quality: formData.lead_quality,
        consent_obtained: formData.consent_obtained,
        notes: formData.notes || "",
        tags: formData.tags || "",
      };
      if (formData.internal_lead_id) payload.internal_lead_id = formData.internal_lead_id;
      if (formData.follow_up_date) payload.follow_up_date = formData.follow_up_date;

      await InternalLeadService.create(payload);
      setManualResult({ ok: true, msg: "Lead added successfully!" });
      setFormData(EMPTY_FORM);
      setShowManualForm(false);
      onLeadCreated?.();
    } catch (err) {
      const detail = err.response?.data ? JSON.stringify(err.response.data, null, 2) : "Unknown error.";
      setManualResult({ ok: false, msg: detail });
    } finally {
      setManualSubmitting(false);
    }
  };

  const ic = "w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Method</h2>

        {/* Method selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { id: "employee", label: "Employee Referrals", Icon: UserCheck },
            { id: "file",     label: "File Upload",        Icon: UploadIcon },
            { id: "manual",   label: "Manual Entry",       Icon: UserPlus  },
            { id: "database", label: "Internal DB (API)",  Icon: Database  },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setUploadMethod(id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                uploadMethod === id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="font-medium text-center text-sm">{label}</p>
            </button>
          ))}
        </div>

        {/* ── EMPLOYEE REFERRALS ── */}
        {uploadMethod === "employee" && (
          <div className="space-y-4">
            {referralResult && (
              <div className={`rounded-xl p-3 border text-sm font-medium ${referralResult.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                {referralResult.msg}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-indigo-600 uppercase">
                Employee Referrals ({referrals.length})
              </p>
              <button
                onClick={() => { setShowAddReferralForm(true); setReferralResult(null); }}
                className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
              >
                <Plus className="w-4 h-4" /> Add New Referral
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Department</label>
                <select value={department} onChange={e => setDepartment(e.target.value)} className={ic}>
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority Tag</label>
                <select value={priorityTag} onChange={e => setPriorityTag(e.target.value)} className={ic}>
                  <option value="">Select Priority</option>
                  {PRIORITY_LEVELS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {referralLoading ? (
              <div className="py-8 text-center text-gray-400 text-sm">Loading referrals…</div>
            ) : referrals.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm border-2 border-dashed rounded-lg">
                No employee referrals yet. Click "Add New Referral" to add one.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {referrals
                  .filter(r => !department || r.internal_source?.includes(department))
                  .map(lead => (
                  <button
                    key={lead.id}
                    onClick={() => toggleReferral(lead.id)}
                    className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all text-left ${
                      selectedReferrals.includes(lead.id)
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {selectedReferrals.includes(lead.id)
                        ? <UserCheck className="text-indigo-600 w-5 h-5" />
                        : <Users className="text-gray-300 w-5 h-5" />}
                      <div>
                        <p className="font-semibold text-sm">{lead.contact_name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Award className="w-3 h-3 text-indigo-500" />
                          {lead.internal_source} • {lead.product}
                        </p>
                        <p className="text-xs text-gray-400">{lead.contact_phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        lead.lead_quality === 'HIGH' ? 'bg-green-100 text-green-700' :
                        lead.lead_quality === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{lead.lead_quality}</span>
                      <p className="text-xs text-indigo-600 mt-1">{lead.lead_status}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedReferrals.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-700">
                {selectedReferrals.length} referral(s) selected — use the Allocate tab to assign them to agents.
              </div>
            )}
          </div>
        )}

        {/* ── FILE UPLOAD ── */}
        {uploadMethod === "file" && (
          <form onSubmit={handleFileUpload} className="space-y-4">
            {uploadResult && (
              <div className={`rounded-xl p-4 border ${uploadResult.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                <p className="text-sm font-bold mb-1">{uploadResult.ok ? "✓ Success" : "✗ Error"}</p>
                <pre className="text-xs whitespace-pre-wrap">{uploadResult.msg}</pre>
              </div>
            )}

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                dragOver ? "border-indigo-400 bg-indigo-50"
                : file ? "border-emerald-400 bg-emerald-50"
                : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
              }`}
            >
              <FileUp className={`w-12 h-12 mx-auto mb-3 ${file ? "text-emerald-500" : "text-gray-400"}`} />
              {file ? (
                <>
                  <p className="font-semibold text-emerald-700">{file.name}</p>
                  <p className="text-sm text-emerald-600 mt-1">{(file.size / 1024).toFixed(1)} KB — ready to upload</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-700">Drag & drop or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">Supports: CSV, XLSX, XLS</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={e => setFile(e.target.files[0] || null)}
              />
            </div>

            {/* Format guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">Required Columns</p>
              <div className="flex flex-wrap gap-1">
                {['internal_source','product','campaign_name','lead_status','contact_name','contact_phone','contact_email','lead_quality','consent_obtained'].map(col => (
                  <span key={col} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">{col}</span>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">Optional: internal_lead_id, notes, follow_up_date, tags</p>
              <a
                href="/outputs/internal_leads_template.xlsx"
                className="text-xs text-indigo-600 hover:underline mt-1 block"
                onClick={e => e.stopPropagation()}
              >
                ↓ Download template file
              </a>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!file || uploading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                <FileUp className="w-4 h-4" />
                {uploading ? "Uploading…" : "Upload File"}
              </button>
              {file && (
                <button type="button" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-sm text-red-500 hover:text-red-700">Remove</button>
              )}
            </div>
          </form>
        )}

        {/* ── MANUAL ENTRY ── */}
        {uploadMethod === "manual" && (
          <div className="space-y-4">
            {manualResult && (
              <div className={`rounded-xl p-3 border text-sm ${manualResult.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                <pre className="whitespace-pre-wrap text-xs">{manualResult.msg}</pre>
              </div>
            )}
            <button
              onClick={() => { setShowManualForm(true); setManualResult(null); }}
              className="w-full py-3 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" /> Add Internal Lead Manually
            </button>
          </div>
        )}

        {/* ── DATABASE ── */}
        {uploadMethod === "database" && (
          <div className="bg-gray-50 p-6 rounded-lg border space-y-3">
            <Database className="text-indigo-600 w-8 h-8" />
            <p className="text-sm text-gray-600">Connect to internal CRM or database to import existing customer referrals</p>
            <input className="w-full p-2 border rounded-lg text-sm" placeholder="Database Connection String" />
            <input className="w-full p-2 border rounded-lg text-sm" placeholder="Authentication Credentials" />
            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm">Test Database Connection</button>
          </div>
        )}
      </div>

      {/* ══ ADD REFERRAL MODAL ══ */}
      {showAddReferralForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" /> Add Employee Referral
              </h2>
              <button onClick={() => setShowAddReferralForm(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleAddReferral} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Referrer Name <span className="text-red-500">*</span></label>
                  <input required value={referralForm.referrer_name}
                    onChange={e => setReferralForm({...referralForm, referrer_name: e.target.value})}
                    className={ic} placeholder="Referrer's full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Referrer Department</label>
                  <select value={referralForm.referrer_department}
                    onChange={e => setReferralForm({...referralForm, referrer_department: e.target.value})}
                    className={ic}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Name <span className="text-red-500">*</span></label>
                  <input required value={referralForm.contact_name}
                    onChange={e => setReferralForm({...referralForm, contact_name: e.target.value})}
                    className={ic} placeholder="Lead's full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Phone <span className="text-red-500">*</span></label>
                  <input required type="tel" value={referralForm.contact_phone}
                    onChange={e => setReferralForm({...referralForm, contact_phone: e.target.value})}
                    className={ic} placeholder="10-digit number" maxLength={10} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Email <span className="text-red-500">*</span></label>
                  <input required type="email" value={referralForm.contact_email}
                    onChange={e => setReferralForm({...referralForm, contact_email: e.target.value})}
                    className={ic} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Product <span className="text-red-500">*</span></label>
                  <select required value={referralForm.product}
                    onChange={e => setReferralForm({...referralForm, product: e.target.value})}
                    className={ic}>
                    <option value="">Select product</option>
                    {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lead Quality <span className="text-red-500">*</span></label>
                  <select required value={referralForm.lead_quality}
                    onChange={e => setReferralForm({...referralForm, lead_quality: e.target.value})}
                    className={ic}>
                    {LEAD_QUALITIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Name <span className="text-red-500">*</span></label>
                  <input required value={referralForm.campaign_name}
                    onChange={e => setReferralForm({...referralForm, campaign_name: e.target.value})}
                    className={ic} placeholder="e.g. Q1 Referral Drive" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea rows={2} value={referralForm.notes}
                  onChange={e => setReferralForm({...referralForm, notes: e.target.value})}
                  className={ic + " resize-none"} placeholder="Additional notes…" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input type="checkbox" checked={referralForm.consent_obtained}
                  onChange={e => setReferralForm({...referralForm, consent_obtained: e.target.checked})}
                  className="w-4 h-4 accent-indigo-600" />
                Consent Obtained <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddReferralForm(false)}
                  className="flex-1 py-2 border rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={referralSubmitting}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-60">
                  {referralSubmitting ? "Saving…" : "Add Referral"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ MANUAL ENTRY MODAL ══ */}
      {showManualForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add Internal Lead</h2>
              <button onClick={() => setShowManualForm(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleManualSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Lead Source <span className="text-red-500">*</span></label>
                  <select required value={formData.internal_source}
                    onChange={e => setFormData({...formData, internal_source: e.target.value})}
                    className={ic}>
                    <option value="">Select source</option>
                    {LEAD_SOURCES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Product</label>
                  <select value={formData.product}
                    onChange={e => setFormData({...formData, product: e.target.value})}
                    className={ic}>
                    <option value="">Select product</option>
                    {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Name <span className="text-red-500">*</span></label>
                  <input required value={formData.campaign_name}
                    onChange={e => setFormData({...formData, campaign_name: e.target.value})}
                    className={ic} placeholder="Campaign / Activity name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lead Status <span className="text-red-500">*</span></label>
                  <select required value={formData.lead_status}
                    onChange={e => setFormData({...formData, lead_status: e.target.value})}
                    className={ic}>
                    <option value="">Select status</option>
                    {LEAD_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Name <span className="text-red-500">*</span></label>
                  <input required value={formData.contact_name}
                    onChange={e => setFormData({...formData, contact_name: e.target.value})}
                    className={ic} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Phone <span className="text-red-500">*</span></label>
                  <input required type="tel" value={formData.contact_phone}
                    onChange={e => setFormData({...formData, contact_phone: e.target.value})}
                    className={ic} maxLength={10} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Email <span className="text-red-500">*</span></label>
                  <input required type="email" value={formData.contact_email}
                    onChange={e => setFormData({...formData, contact_email: e.target.value})}
                    className={ic} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lead Quality <span className="text-red-500">*</span></label>
                  <select required value={formData.lead_quality}
                    onChange={e => setFormData({...formData, lead_quality: e.target.value})}
                    className={ic}>
                    <option value="">Select quality</option>
                    {LEAD_QUALITIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Internal Lead ID</label>
                  <input value={formData.internal_lead_id}
                    onChange={e => setFormData({...formData, internal_lead_id: e.target.value})}
                    className={ic} placeholder="e.g. INT-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <input value={formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value})}
                    className={ic} placeholder="high-value, urgent" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Follow-up Date</label>
                  <input type="datetime-local" value={formData.follow_up_date}
                    onChange={e => setFormData({...formData, follow_up_date: e.target.value})}
                    className={ic} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea rows={3} value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className={ic + " resize-none"} placeholder="Additional notes…" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input type="checkbox" checked={formData.consent_obtained}
                  onChange={e => setFormData({...formData, consent_obtained: e.target.checked})}
                  className="w-4 h-4 accent-indigo-600" />
                Consent Obtained <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowManualForm(false)}
                  className="flex-1 py-2 border rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={manualSubmitting}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-60">
                  {manualSubmitting ? "Saving…" : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalUploadData;
