import React, { useState } from 'react';
import {
  Upload, FileText, CheckCircle, XCircle, AlertTriangle,
  Download, ArrowRight, Check, X
} from 'lucide-react';
import { FileUploadService } from '../../../services/dataAndLeads.service';

// Must match FileUpload model PRODUCT_SELECTION_CHOICES
const PRODUCT_CHOICES = [
  { id: 'personal_loan',  name: 'Personal Loan'  },
  { id: 'home_loan',      name: 'Home Loan'       },
  { id: 'car_loan',       name: 'Car Loan'        },
  { id: 'business_loan',  name: 'Business Loan'  },
  { id: 'education_loan', name: 'Education Loan' },
];

// Must match FileUpload model ASSIGN_AGENT_CHOICES
const AGENT_CHOICES = [
  { id: 'agent_a',    name: 'Agent A'    },
  { id: 'agent_b',    name: 'Agent B'    },
  { id: 'agent_c',    name: 'Agent C'    },
  { id: 'sales_team', name: 'Sales Team' },
];

const FileUploadMethod = ({ onSelect, selectedId }) => {
  const [uploadedFile,      setUploadedFile]      = useState(null);
  const [uploadProgress,    setUploadProgress]    = useState(0);
  const [isUploading,       setIsUploading]       = useState(false);
  const [showPreview,       setShowPreview]       = useState(false);
  const [duplicateCheck,    setDuplicateCheck]    = useState(true);
  const [consentObtained,   setConsentObtained]   = useState(false);
  const [selectedProduct,   setSelectedProduct]   = useState('personal_loan');
  const [selectedAgent,     setSelectedAgent]     = useState('');
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [isImporting,       setIsImporting]       = useState(false);
  const [importSuccess,     setImportSuccess]     = useState(false);
  const [importError,       setImportError]       = useState(null);

  // Static preview — backend doesn't return parsed row previews yet
  const previewData = [
    { name: 'Rajesh Kumar', mobile: '9876543210', email: 'rajesh@example.com', product: 'Home Loan',     city: 'Mumbai',    status: 'Valid'                   },
    { name: 'Priya Sharma', mobile: '9876543211', email: 'priya@example.com',  product: 'Personal Loan', city: 'New Delhi', status: 'Valid'                   },
    { name: 'Amit Patel',   mobile: '9876543212', email: '',                   product: 'Car Loan',      city: 'Ahmedabad', status: 'Invalid - Missing Email' },
    { name: 'Sneha Desai',  mobile: '9876543210', email: 'sneha@example.com',  product: 'Business Loan', city: 'Bangalore', status: 'Duplicate Phone'         },
  ];

  const validRecords     = previewData.filter(r => r.status === 'Valid').length;
  const invalidRecords   = previewData.filter(r => r.status.includes('Invalid')).length;
  const duplicateRecords = previewData.filter(r => r.status.includes('Duplicate')).length;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    setImportError(null);
    setImportSuccess(false);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setIsUploading(false); setShowPreview(true); return 100; }
        return prev + 10;
      });
    }, 200);
  };

  const handleImport = async () => {
    if (!uploadedFile) return;
    setIsImporting(true);
    setImportError(null);

    try {
      const formData = new FormData();
      // ⚠️ Keys must match FileUpload model field names exactly
      formData.append('select_file',             uploadedFile);
      formData.append('product_selection',       selectedProduct);
      formData.append('assign_agent',            selectedAgent);
      formData.append('enable_duplicate_check',  duplicateCheck    ? 'true' : 'false');
      formData.append('consent_obtained',        consentObtained   ? 'true' : 'false');
      formData.append('overwrite_existing_data', overwriteExisting ? 'true' : 'false');

      await FileUploadService.create(formData);
      setImportSuccess(true);
      setTimeout(() => {
        setShowPreview(false);
        setUploadedFile(null);
        setUploadProgress(0);
        setImportSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err);
      setImportError(JSON.stringify(err.response?.data || 'Upload failed.', null, 2));
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setShowPreview(false);
    setUploadedFile(null);
    setUploadProgress(0);
    setImportError(null);
    setImportSuccess(false);
  };

  // ── PREVIEW ───────────────────────────────────────────────────────────────
  if (showPreview) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-black text-gray-900">Upload Preview</h3>
            <p className="text-xs text-gray-500 mt-1">{uploadedFile?.name}</p>
          </div>
          <button onClick={handleReset} className="p-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Valid Records',   value: validRecords,     Icon: CheckCircle,   bg: 'bg-emerald-50', border: 'border-emerald-200', iconCls: 'text-emerald-600', valueCls: 'text-emerald-700' },
            { label: 'Invalid Records', value: invalidRecords,   Icon: XCircle,       bg: 'bg-red-50',     border: 'border-red-200',     iconCls: 'text-red-600',     valueCls: 'text-red-700'     },
            { label: 'Duplicates',      value: duplicateRecords, Icon: AlertTriangle, bg: 'bg-amber-50',   border: 'border-amber-200',   iconCls: 'text-amber-600',   valueCls: 'text-amber-700'   },
          ].map(({ label, value, Icon, bg, border, iconCls, valueCls }) => (
            <div key={label} className={`${bg} border ${border} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${iconCls}`} />
                <p className={`text-[10px] font-black ${iconCls} uppercase`}>{label}</p>
              </div>
              <p className={`text-3xl font-black ${valueCls}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black text-gray-600 uppercase">Data Preview (First 4 Records)</p>
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>{['Name','Mobile','Email','Product','City','Status'].map(h => (
                    <th key={h} className="text-left text-[9px] font-black text-gray-600 uppercase p-3">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {previewData.map((r, idx) => (
                    <tr key={idx} className="border-t border-gray-200 hover:bg-white">
                      <td className="p-3 text-xs font-bold text-gray-900">{r.name}</td>
                      <td className="p-3 text-xs text-gray-700">{r.mobile}</td>
                      <td className="p-3 text-xs text-gray-700">{r.email || '-'}</td>
                      <td className="p-3 text-xs text-gray-700">{r.product}</td>
                      <td className="p-3 text-xs text-gray-700">{r.city}</td>
                      <td className="p-3 text-center">
                        {r.status === 'Valid' ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-emerald-100 text-emerald-700"><Check className="w-3 h-3" /> Valid</span>
                        ) : r.status.includes('Duplicate') ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-amber-100 text-amber-700"><AlertTriangle className="w-3 h-3" /> {r.status}</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-red-100 text-red-700"><X className="w-3 h-3" /> {r.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {importError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs font-bold text-red-700 mb-1">Import Error:</p>
            <pre className="text-[10px] text-red-600 whitespace-pre-wrap">{importError}</pre>
          </div>
        )}
        {importSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <p className="text-sm font-bold text-emerald-700">File uploaded successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button onClick={handleReset} className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button onClick={handleImport} disabled={isImporting} className="py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60">
            <CheckCircle className="w-4 h-4" />
            {isImporting ? 'Importing...' : `Import ${validRecords} Records`}
          </button>
        </div>
      </div>
    );
  }

  // ── UPLOAD FORM ───────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Upload Instructions</p>
        <ul className="text-xs text-indigo-900 space-y-1">
          <li>• Supported formats: CSV, XLSX</li>
          <li>• Required fields: Name, Mobile/Email, Product</li>
          <li>• Optional fields: Country, State, City</li>
          <li>• Maximum file size: 10MB</li>
        </ul>
        <button className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          <Download className="w-3 h-3" /> Download Sample Template
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-black text-gray-600 uppercase">Select File</p>
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          {!uploadedFile ? (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-bold mb-2">Drag & drop your file here</p>
              <p className="text-xs text-gray-500 mb-4">or click to browse</p>
              <label className="inline-block">
                <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="hidden" />
                <span className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer hover:bg-indigo-700 transition-all inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Choose File
                </span>
              </label>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-10 h-10 text-indigo-600" />
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Reading file...</span><span className="font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
              {!isUploading && uploadProgress === 100 && (
                <div className="flex items-center justify-center gap-2 text-emerald-600">
                  <CheckCircle className="w-5 h-5" /><span className="text-sm font-bold">Ready for validation</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black text-gray-600 uppercase">Upload Configuration</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[12px] font-black text-gray-600 uppercase">Product Selection</label>
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500">
              {PRODUCT_CHOICES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[12px] font-black text-gray-600 uppercase">Assign Agent</label>
            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500">
              <option value="">Select Agent</option>
              {AGENT_CHOICES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Enable Duplicate Check',  desc: 'Check for existing phone/email in database',  value: duplicateCheck,    setter: setDuplicateCheck,    color: 'bg-indigo-600'  },
            { label: 'Consent Obtained',         desc: 'GDPR/DPDP compliance confirmation',           value: consentObtained,   setter: setConsentObtained,   color: 'bg-emerald-600' },
            { label: 'Overwrite Existing Data',  desc: 'Replace existing records with new data',      value: overwriteExisting, setter: setOverwriteExisting, color: 'bg-amber-600'   },
          ].map(t => (
            <div key={t.label} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">{t.label}</p>
                <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
              </div>
              <button onClick={() => t.setter(!t.value)} className={`relative w-12 h-6 rounded-full transition-colors ${t.value ? t.color : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${t.value ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {uploadedFile && !isUploading && uploadProgress === 100 && (
        <button onClick={() => setShowPreview(true)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
          <ArrowRight className="w-5 h-5" /> Proceed to Validation
        </button>
      )}
    </div>
  );
};

export default FileUploadMethod;
