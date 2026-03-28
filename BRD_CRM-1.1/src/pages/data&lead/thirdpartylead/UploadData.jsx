// UploadData.jsx – Upload third-party leads (API-integrated)
import React, { useState, useEffect } from 'react';
import {
  Upload, FileText, Download, AlertCircle, CheckCircle, X, Plus
} from 'lucide-react';
import { ThirdPartyLeadService } from '../../../services/dataAndLeads.service';


// ─── constants ────────────────────────────────────────────────────────────────

const VENDORS = [
  'JustDial', 'Sulekha', 'IndiaMART', 'TradeIndia',
  'Lead Generation Co.', 'Marketing Agency XYZ',
];

const PRODUCTS = [
  'Personal Loan', 'Home Loan', 'Car Loan', 'Business Loan', 'Credit Card',
];

const QUALITY_OPTIONS = [
  { value: 'HIGH',   label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW',    label: 'Low' },
];

const BLANK_FORM = {
  vendorSource:     '',
  campaignName:     '',
  productSelection: '',
  contactName:      '',
  contactPhone:     '',
  contactEmail:     '',
  assignedUser:     '',
  thirdPartyLeadId: '',
  leadQuality:      '',
  consentObtained:  false,
  tags:             [],
};

// ─── component ────────────────────────────────────────────────────────────────

const UploadData = ({ onUploadSuccess }) => {
  const [uploadMethod, setUploadMethod]     = useState('file');
  const [file, setFile]                     = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus]     = useState(null); // null | 'uploading' | 'success' | 'error'
  const [uploadResult, setUploadResult]     = useState(null); // { created_count, failed_count, failed_rows }

  const [showManualForm, setShowManualForm] = useState(false);
  const [formData, setFormData]             = useState(BLANK_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // ── Agents (fetched from API) ──────────────────────────────────────────────

  const [agents] = useState([{ id: 1, username: 'sakshijagtap' }]);

  // ── File upload ────────────────────────────────────────────────────────────

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setUploadStatus(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('uploading');
    setUploadProgress(0);

    const formDataPayload = new FormData();
    formDataPayload.append('file', file);

    try {
      // ThirdPartyLeadService.uploadFile → POST /data_lead/third-party-leads/upload-file/
      const res = await ThirdPartyLeadService.uploadFile(formDataPayload, {
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setUploadProgress(pct);
        },
      });

      setUploadStatus('success');
      setUploadResult(res.data);
      if (onUploadSuccess) onUploadSuccess();

      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus(null);
        setUploadResult(null);
        setFile(null);
      }, 4000);
    } catch (err) {
      console.error('File upload failed:', err);
      setUploadStatus('error');
      setUploadResult(
        err.response?.data ?? { message: 'Upload failed. Check console for details.' }
      );
    }
  };

  // ── Manual entry ───────────────────────────────────────────────────────────

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const required = {
      vendorSource:     'Vendor Source',
      campaignName:     'Campaign Name',
      productSelection: 'Product',
      contactName:      'Contact Name',
      contactPhone:     'Contact Phone',
      contactEmail:     'Contact Email',
      leadQuality:      'Lead Quality',
      assignedUser:     'Assigned User',
    };

    for (const [key, label] of Object.entries(required)) {
      if (!formData[key]) {
        alert(`${label} is required.`);
        return;
      }
    }

    // Map frontend fields → backend field names (ThirdPartyLead model)
    const payload = {
      third_party_source:  formData.vendorSource,
      campaign_name:       formData.campaignName,
      product:             formData.productSelection,
      contact_name:        formData.contactName,
      contact_phone:       formData.contactPhone,
      contact_email:       formData.contactEmail,
      assigned_users:      formData.assignedUser ? [parseInt(formData.assignedUser, 10)] : [],
      third_party_lead_id: formData.thirdPartyLeadId || null,
      lead_quality:        formData.leadQuality,       // HIGH | MEDIUM | LOW
      lead_status:         'RAW',                      // default on creation
      consent_obtained:    formData.consentObtained,
      tags:                formData.tags.join(',') || '',
    };

    setFormSubmitting(true);
    try {
      // ThirdPartyLeadService.manualCreate → POST /data_lead/third-party-leads/manual/
      await ThirdPartyLeadService.manualCreate(payload);
      alert('✅ Lead added successfully!');
      setShowManualForm(false);
      setFormData(BLANK_FORM);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error('Manual lead submission failed:', err.response || err);
      alert(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : 'Failed to add lead. Check console for details.'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const setField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  // ── API integration test ──────────────────────────────────────────────────

  const handleTestConnection = async () => {
    // Placeholder – wire to ApiIntegrationService.testApi if needed
    alert('API connection test is not yet configured.');
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Upload Method Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Method</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { id: 'file',   Icon: FileText, label: 'File Upload',      sub: 'CSV / XLSX' },
            { id: 'manual', Icon: Plus,     label: 'Manual Entry',     sub: 'Add Single Lead' },
            { id: 'api',    Icon: Download, label: 'API Integration',  sub: 'Automated Sync' },
          ].map(({ id, Icon, label, sub }) => (
            <button
              key={id}
              onClick={() => setUploadMethod(id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                uploadMethod === id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="font-medium text-center">{label}</p>
              <p className="text-xs text-gray-500 text-center mt-1">{sub}</p>
            </button>
          ))}
        </div>

        {/* ── File Upload ── */}
        {uploadMethod === 'file' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">CSV or XLSX (Max 10 MB)</p>
              </label>
            </div>

            {file && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {uploadProgress > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{uploadProgress}% uploaded</p>
                  </div>
                )}
              </div>
            )}

            {uploadStatus === 'success' && uploadResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">Upload successful!</p>
                </div>
                <p className="text-xs text-green-700 ml-8">
                  {uploadResult.created_count} lead(s) created
                  {uploadResult.failed_count > 0 && `, ${uploadResult.failed_count} failed`}.
                </p>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <X className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Upload failed</p>
                  {uploadResult?.message && (
                    <p className="text-xs text-red-600 mt-0.5">{uploadResult.message}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <a
                href="/data_lead/third-party-leads/sample-template.csv"
                download
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Sample Template</span>
              </a>

              <button
                onClick={handleUpload}
                disabled={!file || uploadStatus === 'uploading'}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadStatus === 'uploading' ? 'Uploading…' : 'Upload File'}
              </button>
            </div>
          </div>
        )}

        {/* ── Manual Entry ── */}
        {uploadMethod === 'manual' && (
          <button
            onClick={() => setShowManualForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors text-indigo-600 font-medium"
          >
            + Add New Lead Manually
          </button>
        )}

        {/* ── API Integration ── */}
        {uploadMethod === 'api' && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-start space-x-3 mb-4">
              <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">API Integration Setup</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configure your vendor's API endpoint to automatically sync leads in real-time.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Endpoint URL
                </label>
                <input
                  type="url"
                  placeholder="https://api.vendor.com/leads"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="password"
                  placeholder="Enter your API key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleTestConnection}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Test Connection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Entry Modal */}
      {showManualForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add New Lead</h2>
              <button onClick={() => setShowManualForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Vendor Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Source <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.vendorSource}
                    onChange={(e) => setField('vendorSource', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select vendor</option>
                    {VENDORS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                {/* Campaign Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.campaignName}
                    onChange={(e) => setField('campaignName', e.target.value)}
                    placeholder="Enter campaign name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Product */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.productSelection}
                    onChange={(e) => setField('productSelection', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select product</option>
                    {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setField('contactName', e.target.value)}
                    placeholder="Full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setField('contactPhone', e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setField('contactEmail', e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Lead Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Quality <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.leadQuality}
                    onChange={(e) => setField('leadQuality', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select quality</option>
                    {QUALITY_OPTIONS.map((q) => (
                      <option key={q.value} value={q.value}>{q.label}</option>
                    ))}
                  </select>
                </div>

                {/* Third Party Lead ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Third Party Lead ID
                  </label>
                  <input
                    type="text"
                    value={formData.thirdPartyLeadId}
                    onChange={(e) => setField('thirdPartyLeadId', e.target.value)}
                    placeholder="Vendor's unique ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Assigned User */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned User <span className="text-red-500">*</span>
                  </label>
                  {agentsError ? (
                    <p className="text-xs text-red-500 mt-1">{agentsError}</p>
                  ) : (
                    <select
                      required
                      value={formData.assignedUser}
                      onChange={(e) => setField('assignedUser', e.target.value)}
                      disabled={agentsLoading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      <option value="">
                        {agentsLoading ? 'Loading users…' : 'Select user'}
                      </option>
                      {agents.map((a) => (
                        <option key={a.id} value={a.id}>{a.username}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consentObtained}
                  onChange={(e) => setField('consentObtained', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  Consent Obtained (GDPR Compliance)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving…' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Uploads (static display – connect to BulkUploadService.list() if needed) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          {[
            { file: 'vendor_leads_jan_2025.csv',    date: '2025-01-15', leads: 450 },
            { file: 'justdial_leads_batch2.xlsx',   date: '2025-01-10', leads: 320 },
            { file: 'marketing_agency_data.csv',    date: '2025-01-05', leads: 180 },
          ].map((u, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{u.file}</p>
                  <p className="text-xs text-gray-500">{u.date} • {u.leads} leads</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Completed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadData;
