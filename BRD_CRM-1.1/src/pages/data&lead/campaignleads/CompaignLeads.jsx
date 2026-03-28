import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Users, TrendingUp, Star, CheckCircle,
  Upload, UserPlus, RefreshCw, Database,
  FileUp, ClipboardList,
} from "lucide-react";
import AllocateData from "./AllocateData";
import ReallocateData from "./ReallocateData";
import AllData from "./AllData";
import CampaignLeadAPI from "../../../services/campaignLeads.service";

const LEAD_SOURCE_CHOICES = [
  { value: "EMAIL",  label: "Email"  },
  { value: "SMS",    label: "SMS"    },
  { value: "SOCIAL", label: "Social" },
  { value: "CALL",   label: "Call"   },
];
const LEAD_STATUS_CHOICES = [
  { value: "RAW",       label: "Raw"       },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "HOT",       label: "Hot"       },
];
const CONVERSION_STATUS_CHOICES = [
  { value: "NOT_CONVERTED", label: "Not Converted" },
  { value: "CONVERTED",     label: "Converted"     },
];
const TABS = [
  { id: "upload",     label: "Upload Data",     icon: Upload    },
  { id: "allocate",   label: "Allocate Data",   icon: UserPlus  },
  { id: "reallocate", label: "Reallocate Data", icon: RefreshCw },
  { id: "all",        label: "All Data",        icon: Database  },
];

export default function CampaignLeads() {
  const location = useLocation();

  /* ── Stats ── */
  const [stats, setStats] = useState([
    { title: "Total Campaign Leads", value: "—", sub: "", icon: Users,       color: "bg-indigo-100 text-indigo-600"  },
    { title: "High Quality Leads",   value: "—", sub: "", icon: Star,        color: "bg-yellow-100 text-yellow-600" },
    { title: "Conversion Rate",      value: "—", sub: "", icon: TrendingUp,  color: "bg-green-100 text-green-700"   },
    { title: "Qualified Leads",      value: "—", sub: "", icon: CheckCircle, color: "bg-purple-100 text-purple-600" },
  ]);

  const fetchStats = async () => {
    try {
      const res   = await CampaignLeadAPI.list({ page_size: 1000 });
      const leads = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      const total     = leads.length;
      const qualified = leads.filter(l => l.lead_status === "QUALIFIED").length;
      const highQ     = leads.filter(l => ["HOT","QUALIFIED"].includes(l.lead_status)).length;
      const converted = leads.filter(l => l.conversion_status === "CONVERTED").length;
      const rate      = total ? ((converted / total) * 100).toFixed(1) : "0.0";
      setStats([
        { title: "Total Campaign Leads", value: total.toLocaleString(),     sub: "All uploaded leads",                                         icon: Users,       color: "bg-indigo-100 text-indigo-600"  },
        { title: "High Quality Leads",   value: highQ.toLocaleString(),     sub: `${total ? Math.round((highQ/total)*100) : 0}% of total`,     icon: Star,        color: "bg-yellow-100 text-yellow-600" },
        { title: "Conversion Rate",      value: `${rate}%`,                 sub: `${converted} converted`,                                     icon: TrendingUp,  color: "bg-green-100 text-green-700"   },
        { title: "Qualified Leads",      value: qualified.toLocaleString(), sub: `${total ? Math.round((qualified/total)*100) : 0}% qualified`, icon: CheckCircle, color: "bg-purple-100 text-purple-600" },
      ]);
    } catch (err) {
      console.error("Stats fetch failed:", err);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  /* ── Tabs ── */
  const [activeTab, setActiveTab] = useState("upload");
  useEffect(() => {
    const last = location.pathname.split("/").pop();
    if (TABS.some(t => t.id === last)) setActiveTab(last);
  }, [location.pathname]);

  /* ── Upload sub-tab: "manual" | "file" ── */
  const [uploadMode, setUploadMode] = useState("manual");

  /* ── Manual entry form ── */
  const EMPTY_FORM = {
    product: "", lead_source: "", lead_status: "",
    contact_name: "", contact_phone: "", contact_email: "",
    notes: "", follow_up_date: "", campaign_start: "", campaign_end: "",
    conversion_status: "", consent_obtained: false, tags: "",
  };
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [errors,       setErrors]       = useState({});
  const [submitting,   setSubmitting]   = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.product)              err.product        = "Product is required";
    if (!form.lead_source)          err.lead_source    = "Lead Source is required";
    if (!form.lead_status)          err.lead_status    = "Lead Status is required";
    if (!form.contact_name.trim())  err.contact_name   = "Contact Name is required";
    if (!/^\d{10}$/.test(form.contact_phone)) err.contact_phone = "Phone must be 10 digits";
    if (!form.contact_email.trim()) err.contact_email  = "Email is required";
    if (!form.campaign_start)       err.campaign_start = "Campaign Start Date is required";
    if (!form.consent_obtained)     err.consent_obtained = "Consent must be obtained";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const fd = new FormData();
      fd.append("product",          form.product);
      fd.append("lead_source",      form.lead_source);
      fd.append("lead_status",      form.lead_status);
      fd.append("contact_name",     form.contact_name.trim());
      fd.append("contact_phone",    form.contact_phone.trim());
      fd.append("contact_email",    form.contact_email.trim());
      fd.append("consent_obtained", form.consent_obtained ? "true" : "false");
      fd.append("campaign_start",   form.campaign_start);
      if (form.notes)             fd.append("notes",             form.notes);
      if (form.follow_up_date)    fd.append("follow_up_date",    form.follow_up_date);
      if (form.campaign_end)      fd.append("campaign_end",      form.campaign_end);
      if (form.conversion_status) fd.append("conversion_status", form.conversion_status);
      if (form.tags)              fd.append("tags",              form.tags);

      await CampaignLeadAPI.create(fd);
      setSubmitResult({ ok: true, msg: "Campaign Lead saved successfully!" });
      setForm(EMPTY_FORM);
      fetchStats();
    } catch (err) {
      const detail = err.response?.data
        ? JSON.stringify(err.response.data, null, 2)
        : "Unknown error.";
      setSubmitResult({ ok: false, msg: detail });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── File upload form ── */
  const fileInputRef = useRef(null);
  const [fileUpload,       setFileUpload]       = useState(null);
  const [fileUploading,    setFileUploading]    = useState(false);
  const [fileUploadResult, setFileUploadResult] = useState(null);
  const [dragOver,         setDragOver]         = useState(false);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    // Get file from ref directly — more reliable than state in React StrictMode
    const fileToUpload = fileInputRef.current?.files?.[0] || fileUpload;
    if (!fileToUpload) {
      setFileUploadResult({ ok: false, msg: "Please select a file first." });
      return;
    }
    setFileUploading(true);
    setFileUploadResult(null);
    try {
      const fd = new FormData();
      fd.append("file", fileToUpload);
      // Debug: confirm file is in FormData before sending
      console.log("Uploading file:", fileToUpload?.name, fileToUpload?.size, "bytes");
      console.log("FormData file entry:", fd.get("file"));
      const res = await CampaignLeadAPI.uploadFile(fd);
      const { created_count = 0, failed_count = 0, failed_rows = [] } = res.data;
      let msg = `${created_count} leads created successfully from "${fileUpload.name}"!`;
      if (failed_count > 0) {
        msg += `\n\n${failed_count} rows had errors:`;
        failed_rows.slice(0, 5).forEach(f => {
          msg += `\n  Row ${f.row}: ${JSON.stringify(f.errors)}`;
        });
        if (failed_rows.length > 5) msg += `\n  ...and ${failed_rows.length - 5} more`;
      }
      setFileUploadResult({ ok: created_count > 0, msg });
      if (created_count > 0) {
        setFileUpload(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchStats();
      }
    } catch (err) {
      const detail = err.response?.data?.error
        || (err.response?.data ? JSON.stringify(err.response.data, null, 2) : "Upload failed. Please check file format.");
      setFileUploadResult({ ok: false, msg: detail });
    } finally {
      setFileUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      setFileUpload(f);
      // Also inject into the file input so ref reads it correctly
      try {
        const dt = new DataTransfer();
        dt.items.add(f);
        if (fileInputRef.current) fileInputRef.current.files = dt.files;
      } catch (_) {}
    }
  };

  /* ─────── RENDER ─────── */
  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Campaign Leads</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-2 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="text-sm text-gray-500 mt-2">{s.title}</p>
                <h2 className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</h2>
                <p className="text-sm text-gray-500 mt-1">{s.sub}</p>
              </div>
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto border-b border-gray-200">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                active ? "border-indigo-600 text-indigo-600 font-medium" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6">

        {/* ── UPLOAD TAB ── */}
        {activeTab === "upload" && (
          <div className="space-y-6">

            {/* Upload mode toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
              <button
                onClick={() => { setUploadMode("manual"); setSubmitResult(null); }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  uploadMode === "manual"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ClipboardList className="w-4 h-4" /> Manual Entry
              </button>
              <button
                onClick={() => { setUploadMode("file"); setFileUploadResult(null); }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  uploadMode === "file"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FileUp className="w-4 h-4" /> File Upload
              </button>
            </div>

            {/* ── MANUAL ENTRY ── */}
            {uploadMode === "manual" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitResult && (
                  <div className={`rounded-xl p-4 border ${submitResult.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                    <p className="text-sm font-bold mb-1">{submitResult.ok ? "✓ Success" : "✗ Error"}</p>
                    <pre className="text-xs whitespace-pre-wrap font-mono">{submitResult.msg}</pre>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FF label="Product *" error={errors.product}>
                    <select name="product" value={form.product} onChange={handleChange} className={ic(errors.product)}>
                      <option value="">Select product</option>
                      <option>Home Loan</option><option>Personal Loan</option>
                      <option>Car Loan</option><option>Business Loan</option><option>Education Loan</option>
                    </select>
                  </FF>

                  <FF label="Lead Source *" error={errors.lead_source}>
                    <select name="lead_source" value={form.lead_source} onChange={handleChange} className={ic(errors.lead_source)}>
                      <option value="">Select source</option>
                      {LEAD_SOURCE_CHOICES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </FF>

                  <FF label="Lead Status *" error={errors.lead_status}>
                    <select name="lead_status" value={form.lead_status} onChange={handleChange} className={ic(errors.lead_status)}>
                      <option value="">Select status</option>
                      {LEAD_STATUS_CHOICES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </FF>

                  <FF label="Conversion Status">
                    <select name="conversion_status" value={form.conversion_status} onChange={handleChange} className={ic()}>
                      <option value="">Not specified</option>
                      {CONVERSION_STATUS_CHOICES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </FF>

                  <FF label="Contact Name *" error={errors.contact_name}>
                    <input type="text" name="contact_name" value={form.contact_name} onChange={handleChange} placeholder="Full name" className={ic(errors.contact_name)} />
                  </FF>

                  <FF label="Contact Phone *" error={errors.contact_phone}>
                    <input type="tel" name="contact_phone" value={form.contact_phone} onChange={handleChange} placeholder="10-digit number" maxLength={10} className={ic(errors.contact_phone)} />
                  </FF>

                  <FF label="Contact Email *" error={errors.contact_email}>
                    <input type="email" name="contact_email" value={form.contact_email} onChange={handleChange} placeholder="email@example.com" className={ic(errors.contact_email)} />
                  </FF>

                  <FF label="Tags">
                    <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. high-value, urgent" className={ic()} />
                  </FF>

                  <FF label="Campaign Start Date *" error={errors.campaign_start}>
                    <input type="date" name="campaign_start" value={form.campaign_start} onChange={handleChange} className={ic(errors.campaign_start)} />
                  </FF>

                  <FF label="Campaign End Date">
                    <input type="date" name="campaign_end" value={form.campaign_end} onChange={handleChange} className={ic()} />
                  </FF>

                  <FF label="Follow-up Date & Time">
                    <input type="datetime-local" name="follow_up_date" value={form.follow_up_date} onChange={handleChange} className={ic()} />
                  </FF>
                </div>

                <FF label="Lead Notes">
                  <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any additional details..." rows={3} className={ic() + " resize-none"} />
                </FF>

                <label className={`flex items-center gap-3 cursor-pointer ${errors.consent_obtained ? "text-red-600" : "text-gray-700"}`}>
                  <input type="checkbox" name="consent_obtained" checked={form.consent_obtained} onChange={handleChange} className="w-4 h-4 accent-indigo-600" />
                  <span className="text-sm font-medium">Consent Obtained *</span>
                </label>
                {errors.consent_obtained && <p className="text-xs text-red-500">{errors.consent_obtained}</p>}

                <button type="submit" disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-8 py-3 rounded-xl font-medium transition-all active:scale-95 w-full sm:w-auto">
                  {submitting ? "Saving…" : "Save Campaign Lead"}
                </button>
              </form>
            )}

            {/* ── FILE UPLOAD ── */}
            {uploadMode === "file" && (
              <form onSubmit={handleFileUpload} className="space-y-6">
                {fileUploadResult && (
                  <div className={`rounded-xl p-4 border ${fileUploadResult.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                    <p className="text-sm font-bold mb-1">{fileUploadResult.ok ? "✓ Success" : "✗ Error"}</p>
                    <pre className="text-xs whitespace-pre-wrap font-mono">{fileUploadResult.msg}</pre>
                  </div>
                )}

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                    dragOver
                      ? "border-indigo-400 bg-indigo-50"
                      : fileUpload
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileUp className={`w-12 h-12 mx-auto mb-3 ${fileUpload ? "text-emerald-500" : "text-gray-400"}`} />
                  {fileUpload ? (
                    <>
                      <p className="font-semibold text-emerald-700">{fileUpload.name}</p>
                      <p className="text-sm text-emerald-600 mt-1">{(fileUpload.size / 1024).toFixed(1)} KB — ready to upload</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-gray-700">Drag & drop your file here</p>
                      <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                      <p className="text-xs text-gray-400 mt-3">Supports: CSV, XLSX, XLS</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={e => setFileUpload(e.target.files[0] || null)}
                  />
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-2">File Format Requirements</p>
                  <p className="text-xs text-blue-700">Your file should have these columns (in any order):</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {["product","lead_source","lead_status","contact_name","contact_phone","contact_email","campaign_start","consent_obtained","notes","follow_up_date","campaign_end","conversion_status","tags"].map(col => (
                      <span key={col} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">{col}</span>
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    After upload, all leads from the file will appear in <strong>Allocate Data</strong> and <strong>All Data</strong> tabs.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={!fileUpload || fileUploading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-all active:scale-95 flex items-center gap-2"
                  >
                    <FileUp className="w-4 h-4" />
                    {fileUploading ? "Uploading…" : "Upload File"}
                  </button>
                  {fileUpload && (
                    <button
                      type="button"
                      onClick={() => { setFileUpload(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove file
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === "allocate"   && <AllocateData />}
        {activeTab === "reallocate" && <ReallocateData />}
        {activeTab === "all"        && <AllData />}
      </div>
    </div>
  );
}

const ic = (err = "") =>
  `bg-gray-50 p-3 rounded-xl border w-full text-sm outline-none focus:border-indigo-500 transition-colors ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;

const FF = ({ label, error, children }) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-700 font-medium">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
