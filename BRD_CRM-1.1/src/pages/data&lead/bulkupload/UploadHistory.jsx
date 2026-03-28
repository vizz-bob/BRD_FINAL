import React, { useState, useEffect } from 'react';
import {
  History, CheckCircle, XCircle, FileText,
  Download, Eye, User, Calendar, ArrowLeft, RefreshCw
} from 'lucide-react';
import { FileUploadService } from '../../../services/dataAndLeads.service';

const PRODUCT_DISPLAY = {
  personal_loan:  'Personal Loan',
  home_loan:      'Home Loan',
  car_loan:       'Car Loan',
  business_loan:  'Business Loan',
  education_loan: 'Education Loan',
};

const AGENT_DISPLAY = {
  agent_a:    'Agent A',
  agent_b:    'Agent B',
  agent_c:    'Agent C',
  sales_team: 'Sales Team',
};

const UploadHistory = ({ onSelect, selectedId }) => {
  const [uploads,        setUploads]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [showDetails,    setShowDetails]    = useState(false);

  useEffect(() => {
    const fetchUploads = async () => {
      setLoading(true);
      try {
        const res = await FileUploadService.list();
        setUploads(res.data);
      } catch (err) {
        console.error('Failed to fetch upload history:', err);
        setError('Failed to load upload history.');
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []);

  if (showDetails && selectedUpload) {
    const product = PRODUCT_DISPLAY[selectedUpload.product_selection] || selectedUpload.product_selection || 'N/A';
    const agent   = AGENT_DISPLAY[selectedUpload.assign_agent]        || selectedUpload.assign_agent        || 'N/A';
    const fileName = selectedUpload.select_file ? selectedUpload.select_file.split('/').pop() : 'No file attached';

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowDetails(false)} className="p-2 text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Upload Details</h3>
              <p className="text-[9px] text-slate-500 font-mono">#{selectedUpload.id}</p>
            </div>
          </div>
          <History className="w-4 h-4 text-slate-600" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center pb-6 border-b border-gray-50">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-100">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mt-2">{fileName}</h2>
            <p className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase mt-1">{product}</p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
            <p className="text-[10px] font-black text-indigo-600 uppercase">Upload Configuration</p>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-[9px] text-gray-500 uppercase font-bold">Product</p><p className="text-sm font-bold text-gray-900 mt-1">{product}</p></div>
              <div><p className="text-[9px] text-gray-500 uppercase font-bold">Assigned Agent</p><p className="text-sm font-bold text-gray-900 mt-1">{agent}</p></div>
              <div><p className="text-[9px] text-gray-500 uppercase font-bold">Duplicate Check</p><p className="text-sm font-bold text-gray-900 mt-1">{selectedUpload.enable_duplicate_check ? 'Enabled' : 'Disabled'}</p></div>
              <div><p className="text-[9px] text-gray-500 uppercase font-bold">Consent Obtained</p><p className="text-sm font-bold text-gray-900 mt-1">{selectedUpload.consent_obtained ? 'Yes' : 'No'}</p></div>
              <div><p className="text-[9px] text-gray-500 uppercase font-bold">Overwrite Existing</p><p className="text-sm font-bold text-gray-900 mt-1">{selectedUpload.overwrite_existing_data ? 'Yes' : 'No'}</p></div>
            </div>
          </div>

          {/* Record counts — not tracked in current model → N/A */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-600 uppercase">Records Breakdown</p>
            <div className="grid grid-cols-2 gap-4">
              {['Total Records', 'Valid Records', 'Invalid Records', 'Duplicates'].map(label => (
                <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-2">{label}</p>
                  <p className="text-2xl font-black text-gray-400">N/A</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 text-center">Record-level analytics are not tracked in the current model</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95">
              <Download className="w-4 h-4" /> Download Report
            </button>
            <button className="py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
              <RefreshCw className="w-4 h-4" /> Re-import
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload History</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">All file upload records</p>
        </div>
        <History className="w-4 h-4 text-slate-600" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading upload history...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 text-sm">{error}</div>
        ) : uploads.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No uploads found.</div>
        ) : (
          uploads.map((upload) => {
            const product  = PRODUCT_DISPLAY[upload.product_selection] || upload.product_selection || 'N/A';
            const agent    = AGENT_DISPLAY[upload.assign_agent]        || upload.assign_agent        || 'N/A';
            const fileName = upload.select_file ? upload.select_file.split('/').pop() : 'No file';

            return (
              <div key={upload.id} onClick={() => onSelect(upload)} className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-indigo-50 ${selectedId === upload.id ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg"><FileText className="w-4 h-4 text-indigo-600" /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{fileName}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{upload.id}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div><p className="text-[9px] text-gray-500 uppercase font-bold">Product</p><p className="text-xs font-bold text-gray-900">{product}</p></div>
                  <div><p className="text-[9px] text-gray-500 uppercase font-bold">Agent</p><p className="text-xs font-bold text-gray-900">{agent}</p></div>
                  <div><p className="text-[9px] text-gray-500 uppercase font-bold">Duplicate Check</p><p className="text-xs font-bold text-gray-900">{upload.enable_duplicate_check ? 'Enabled' : 'Disabled'}</p></div>
                  <div><p className="text-[9px] text-gray-500 uppercase font-bold">Consent</p><p className="text-xs font-bold text-gray-900">{upload.consent_obtained ? 'Obtained' : 'Not Obtained'}</p></div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Total: N/A &nbsp;|&nbsp; Valid: N/A &nbsp;|&nbsp; Invalid: N/A</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedUpload(upload); setShowDetails(true); }}
                    className="text-xs font-bold px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-700 flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UploadHistory;
