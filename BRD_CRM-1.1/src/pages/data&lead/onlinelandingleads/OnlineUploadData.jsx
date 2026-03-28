// OnlineUploadData.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Upload, FileText, AlertCircle, CheckCircle,
  X, Plus, Globe, CheckSquare, Square, ShieldCheck, RefreshCw,
} from "lucide-react";
import { OnlineLeadService } from "../../../services/dataAndLeads.service";

const LEAD_STATUS_MAP = { Raw: "RAW", Qualified: "QUALIFIED", Hot: "HOT" };
const LEAD_QUALITY_MAP = { high: "HIGH", medium: "MEDIUM", low: "LOW" };

const OnlineUploadData = ({ onLeadCreated }) => {
  const [uploadMethod, setUploadMethod] = useState("webhook");
  const [showManualForm, setShowManualForm] = useState(false);
  const [message, setMessage] = useState(null);

  // ── Webhook state ──────────────────────────────────────────
  const [webhookLeads, setWebhookLeads] = useState([]);
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [selectedWebhooks, setSelectedWebhooks] = useState([]);
  const [webhookCampaign, setWebhookCampaign] = useState("");
  const [webhookQuality, setWebhookQuality] = useState("");

  // ── File upload state ──────────────────────────────────────
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // ── Manual form state ──────────────────────────────────────
  const emptyForm = {
    leadSource: "", productSelection: "", campaignName: "", leadStatus: "",
    contactName: "", contactPhone: "", contactEmail: "", leadQuality: "",
    notes: "", followUpDate: "", onlineLeadId: "", consentObtained: false,
    tags: "", leadFormUrl: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [formSaving, setFormSaving] = useState(false);

  const campaigns = ["Q1 Search Campaign", "FB Retargeting", "Organic SEO 2025", "Instagram Influencer"];
  const qualityLevels = ["High Intent", "Medium Intent", "Generic Inquiry"];
  const leadSources = ["Website", "Facebook Ads", "Google Ads", "Instagram Ads", "Direct", "Other"];
  const products = ["Home Loan", "Personal Loan", "Business Loan", "Credit Card"];
  const leadStatuses = ["Raw", "Qualified", "Hot"];
  const qualityRatings = [{ label: "High", value: "high" }, { label: "Medium", value: "medium" }, { label: "Low", value: "low" }];

  useEffect(() => { setShowManualForm(false); setMessage(null); }, [uploadMethod]);

  // ── Fetch RAW unassigned leads for webhook section ─────────
  const fetchWebhookLeads = async () => {
    setWebhookLoading(true);
    try {
      const res = await OnlineLeadService.list({ status: "RAW", unassigned: "true", page_size: 50 });
      setWebhookLeads(res.data?.results ?? res.data ?? []);
    } catch {
      setWebhookLeads([]);
    } finally {
      setWebhookLoading(false);
    }
  };

  useEffect(() => {
    if (uploadMethod === "webhook") fetchWebhookLeads();
  }, [uploadMethod]);

  // ── File upload ────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) { setSelectedFile(f); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const handleFileUpload = async () => {
    const file = fileInputRef.current?.files[0] || selectedFile;
    if (!file) return;
    setFileUploading(true);
    setMessage(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await OnlineLeadService.uploadFile(fd);
      const { created_count, failed_count, failed_rows } = res.data;
      let text = `✓ ${created_count} leads uploaded successfully.`;
      if (failed_count > 0) text += ` ${failed_count} rows failed — check console for details.`;
      if (failed_rows?.length) console.warn("Failed rows:", failed_rows.slice(0, 5));
      setMessage({ type: "success", text });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onLeadCreated?.();
    } catch (err) {
      const d = err.response?.data;
      setMessage({ type: "error", text: d?.error || JSON.stringify(d) || "Upload failed." });
    } finally {
      setFileUploading(false);
    }
  };

  // ── Webhook commit — allocates selected leads to a campaign tag ──
  const handleCommitWebhooks = async () => {
    if (!selectedWebhooks.length || !webhookCampaign || !webhookQuality) return;
    setMessage(null);
    try {
      // Update campaign_name and quality_tag on the selected leads via PATCH
      await Promise.all(
        selectedWebhooks.map(id =>
          OnlineLeadService.update(id, {
            campaign_name: webhookCampaign,
            quality_tag: webhookQuality === "High Intent" ? "HIGH" : webhookQuality === "Medium Intent" ? "MEDIUM" : "LOW",
          })
        )
      );
      setMessage({ type: "success", text: `${selectedWebhooks.length} lead(s) committed to "${webhookCampaign}".` });
      setSelectedWebhooks([]);
      setWebhookCampaign("");
      setWebhookQuality("");
      fetchWebhookLeads();
      onLeadCreated?.();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to commit leads." });
    }
  };

  // ── Manual entry ───────────────────────────────────────────
  const handleManualSave = async (e) => {
    e.preventDefault();
    const required = ["leadSource", "campaignName", "leadStatus", "contactName", "contactPhone", "contactEmail", "leadQuality"];
    for (let f of required) {
      if (!formData[f]) { setMessage({ type: "error", text: "Please fill all required fields." }); return; }
    }
    setFormSaving(true);
    setMessage(null);
    const payload = {
      online_source: formData.leadSource,
      product: formData.productSelection || "",
      campaign_name: formData.campaignName,
      lead_status: LEAD_STATUS_MAP[formData.leadStatus],
      contact_name: formData.contactName,
      contact_phone: formData.contactPhone,
      contact_email: formData.contactEmail,
      lead_quality: LEAD_QUALITY_MAP[formData.leadQuality],
      notes: formData.notes || "",
      follow_up_date: formData.followUpDate || null,
      online_lead_id: formData.onlineLeadId || null,
      consent_obtained: formData.consentObtained,
      tags: formData.tags || "",
      lead_form_url: formData.leadFormUrl || "",
    };
    try {
      await OnlineLeadService.create(payload);
      setMessage({ type: "success", text: "Lead added successfully!" });
      setFormData(emptyForm);
      setShowManualForm(false);
      onLeadCreated?.();
    } catch (err) {
      const d = err.response?.data;
      setMessage({ type: "error", text: JSON.stringify(d) || "Failed to save lead." });
    } finally {
      setFormSaving(false);
    }
  };

  const qualityBadge = (q) => {
    const m = { HIGH: "bg-green-100 text-green-700", MEDIUM: "bg-yellow-100 text-yellow-700", LOW: "bg-red-100 text-red-700" };
    return m[q] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Global message */}
      {message && (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${message.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
          <p className="text-sm">{message.text}</p>
          <button className="ml-auto" onClick={() => setMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Method</h2>

        {/* Method selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { key: "webhook", Icon: Globe,    label: "Pending Webhooks" },
            { key: "file",    Icon: FileText, label: "File Upload" },
            { key: "manual",  Icon: Plus,     label: "Manual Entry" },
            { key: "api",     Icon: Upload,   label: "API Integration" },
          ].map(({ key, Icon, label }) => (
            <button key={key} onClick={() => setUploadMethod(key)}
              className={`p-4 rounded-lg border-2 transition-all ${uploadMethod === key ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <Icon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="font-medium text-center text-sm">{label}</p>
            </button>
          ))}
        </div>

        {/* ── WEBHOOK SECTION ── */}
        {uploadMethod === "webhook" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium mb-1">Link to Campaign *</label>
                <select value={webhookCampaign} onChange={e => setWebhookCampaign(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="">Select Campaign</option>
                  {campaigns.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quality Tag *</label>
                <select value={webhookQuality} onChange={e => setWebhookQuality(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="">Select Quality</option>
                  {qualityLevels.map(q => <option key={q}>{q}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-indigo-600 uppercase">
                Pending RAW Leads ({webhookLeads.length})
              </p>
              <button onClick={fetchWebhookLeads} className="text-xs text-gray-500 flex items-center gap-1 hover:text-indigo-600">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            {webhookLoading ? (
              <div className="py-8 text-center text-sm text-gray-400">Loading leads…</div>
            ) : webhookLeads.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                No pending RAW unassigned leads found.
              </div>
            ) : webhookLeads.map(lead => (
              <button key={lead.id}
                onClick={() => setSelectedWebhooks(prev => prev.includes(lead.id) ? prev.filter(l => l !== lead.id) : [...prev, lead.id])}
                className={`w-full flex items-center justify-between p-4 border rounded-lg mb-2 transition-all ${selectedWebhooks.includes(lead.id) ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <div className="flex items-center space-x-4">
                  {selectedWebhooks.includes(lead.id)
                    ? <CheckSquare className="text-indigo-600 w-5 h-5 shrink-0" />
                    : <Square className="text-gray-300 w-5 h-5 shrink-0" />}
                  <div className="text-left">
                    <p className="font-semibold text-sm">{lead.contact_name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-green-500" />
                      {lead.online_source}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${qualityBadge(lead.lead_quality)}`}>
                    {lead.lead_quality}
                  </span>
                  <span className="text-xs text-indigo-600">{lead.product}</span>
                </div>
              </button>
            ))}

            <button
              onClick={handleCommitWebhooks}
              disabled={!selectedWebhooks.length || !webhookCampaign || !webhookQuality}
              className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Commit {selectedWebhooks.length} Lead(s) to Campaign
            </button>
          </>
        )}

        {/* ── FILE UPLOAD ── */}
        {uploadMethod === "file" && (
          <>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed p-10 text-center rounded-lg cursor-pointer transition-colors ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"}`}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.xls"
                onChange={e => setSelectedFile(e.target.files[0])} />
              <Upload className="mx-auto w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 font-medium">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400 mt-1">CSV, XLSX, XLS supported</p>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-bold text-gray-600 uppercase mb-2">Required Columns</p>
              <p className="text-xs text-gray-500 font-mono leading-relaxed">
                online_source · product · campaign_name · lead_status (RAW/QUALIFIED/HOT) · contact_name · contact_phone · contact_email · lead_quality (HIGH/MEDIUM/LOW) · consent_obtained (TRUE/FALSE)
              </p>
              <p className="text-xs text-gray-400 mt-1">Optional: online_lead_id · notes · follow_up_date · tags · lead_form_url</p>
            </div>

            {selectedFile && (
              <div className="mt-3 flex items-center gap-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            )}

            <button onClick={handleFileUpload} disabled={!selectedFile || fileUploading}
              className="w-full mt-4 py-2.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              {fileUploading ? "Uploading…" : "Upload File"}
            </button>
          </>
        )}

        {/* ── MANUAL ── */}
        {uploadMethod === "manual" && !showManualForm && (
          <button onClick={() => setShowManualForm(true)}
            className="w-full py-4 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 hover:bg-indigo-50 text-sm font-medium"
          >
            + Add Online Lead Manually
          </button>
        )}

        {/* ── API ── */}
        {uploadMethod === "api" && (
          <div className="bg-gray-50 p-6 rounded-lg border space-y-3">
            <AlertCircle className="text-indigo-600 mb-1" />
            <p className="text-sm text-gray-600">Configure vendor API to sync leads in real-time.</p>
            <input className="w-full p-2 border rounded text-sm" placeholder="API Endpoint" />
            <input className="w-full p-2 border rounded text-sm" placeholder="API Key" />
            <button className="w-full py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">Test Connection</button>
          </div>
        )}
      </div>

      {/* ── MANUAL ENTRY MODAL ── */}
      {showManualForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Add Online Lead</h2>
              <button onClick={() => setShowManualForm(false)}><X /></button>
            </div>

            <form onSubmit={handleManualSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Lead Source <span className="text-red-500">*</span></label>
                  <select required value={formData.leadSource} onChange={e => setFormData({ ...formData, leadSource: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm">
                    <option value="">Select source</option>
                    {leadSources.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Product</label>
                  <select value={formData.productSelection} onChange={e => setFormData({ ...formData, productSelection: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm">
                    <option value="">Select product</option>
                    {products.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Name <span className="text-red-500">*</span></label>
                  <input required value={formData.campaignName} onChange={e => setFormData({ ...formData, campaignName: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Lead Status <span className="text-red-500">*</span></label>
                  <select required value={formData.leadStatus} onChange={e => setFormData({ ...formData, leadStatus: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm">
                    <option value="">Select status</option>
                    {leadStatuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact Name <span className="text-red-500">*</span></label>
                  <input required value={formData.contactName} onChange={e => setFormData({ ...formData, contactName: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></label>
                  <input required value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                  <input required type="email" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Lead Quality <span className="text-red-500">*</span></label>
                  <select required value={formData.leadQuality} onChange={e => setFormData({ ...formData, leadQuality: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm">
                    <option value="">Select quality</option>
                    {qualityRatings.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Follow-up Date</label>
                  <input type="datetime-local" value={formData.followUpDate} onChange={e => setFormData({ ...formData, followUpDate: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Online Lead ID</label>
                  <input placeholder="ONL-001" value={formData.onlineLeadId} onChange={e => setFormData({ ...formData, onlineLeadId: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Landing Page URL</label>
                  <input placeholder="https://lp.example.com/homeloan" value={formData.leadFormUrl} onChange={e => setFormData({ ...formData, leadFormUrl: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <input placeholder="home-loan, urgent" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full border px-3 py-2 rounded-lg text-sm" />
                </div>
              </div>

              <textarea rows={3} placeholder="Notes (optional)" value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg text-sm" />

              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.consentObtained}
                  onChange={e => setFormData({ ...formData, consentObtained: e.target.checked })} className="rounded" />
                <span className="text-sm">Consent Obtained</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowManualForm(false)} className="flex-1 border rounded-lg py-2 text-sm">Cancel</button>
                <button type="submit" disabled={formSaving} className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm disabled:opacity-50">
                  {formSaving ? "Saving…" : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineUploadData;