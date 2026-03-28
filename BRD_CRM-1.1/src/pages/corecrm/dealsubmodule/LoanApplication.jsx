import React, { useState } from 'react';
import { 
  FileText, User, DollarSign, Calendar, Upload, 
  CheckCircle, AlertTriangle, Clock, ArrowLeft,
  Save, Send, Paperclip, X, Plus
} from 'lucide-react';

const LoanApplication = ({ onSelect, selectedId }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leadName: '',
    productType: 'Personal Loan',
    requestedAmount: '',
    tenure: '',
    interestType: 'Fixed',
    agentAssigned: 'Agent A',
    status: 'Draft',
    applicationDate: '',
    notes: ''
  });
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const applications = [
    { 
      id: 'APP-2301', 
      leadName: 'Amit Kumar', 
      leadId: 'LD-5521',
      productType: 'Home Loan', 
      requestedAmount: '₹45,00,000',
      tenure: '240 months',
      status: 'Under Review',
      applicationDate: '15 Jan 2025',
      agentAssigned: 'Agent A',
      docsUploaded: 5
    },
    { 
      id: 'APP-2302', 
      leadName: 'Priya Sharma', 
      leadId: 'LD-5522',
      productType: 'Personal Loan', 
      requestedAmount: '₹5,00,000',
      tenure: '36 months',
      status: 'Submitted',
      applicationDate: '16 Jan 2025',
      agentAssigned: 'Agent B',
      docsUploaded: 4
    },
    { 
      id: 'APP-2303', 
      leadName: 'Rahul Verma', 
      leadId: 'LD-5523',
      productType: 'Car Loan', 
      requestedAmount: '₹8,50,000',
      tenure: '60 months',
      status: 'Draft',
      applicationDate: '17 Jan 2025',
      agentAssigned: 'Agent A',
      docsUploaded: 2
    },
    { 
      id: 'APP-2304', 
      leadName: 'Sneha Patel', 
      leadId: 'LD-5524',
      productType: 'Business Loan', 
      requestedAmount: '₹25,00,000',
      tenure: '120 months',
      status: 'Approved',
      applicationDate: '14 Jan 2025',
      agentAssigned: 'Agent C',
      docsUploaded: 8
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-700',
      'Submitted': 'bg-indigo-100 text-indigo-700',
      'Under Review': 'bg-amber-100 text-amber-700',
      'Approved': 'bg-emerald-100 text-emerald-700',
      'Rejected': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedDocs(prev => [...prev, ...files.map(f => f.name)]);
  };

  const removeDoc = (index) => {
    setUploadedDocs(prev => prev.filter((_, i) => i !== index));
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Loan Application</h3>
          </div>
          <FileText className="w-4 h-4 text-slate-600" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-[10px] font-black text-indigo-600 uppercase mb-3">Lead Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Lead Name / ID</label>
                <input 
                  type="text" 
                  value={formData.leadName}
                  onChange={(e) => handleInputChange('leadName', e.target.value)}
                  placeholder="Search or enter lead name" 
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Application Date</label>
                <input 
                  type="date" 
                  value={formData.applicationDate}
                  onChange={(e) => handleInputChange('applicationDate', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-600 uppercase">Loan Details</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Product Type</label>
                <select 
                  value={formData.productType}
                  onChange={(e) => handleInputChange('productType', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500"
                >
                  <option>Personal Loan</option>
                  <option>Home Loan</option>
                  <option>Car Loan</option>
                  <option>Business Loan</option>
                  <option>Education Loan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Requested Amount (₹)</label>
                <input 
                  type="number" 
                  value={formData.requestedAmount}
                  onChange={(e) => handleInputChange('requestedAmount', e.target.value)}
                  placeholder="Enter amount" 
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Tenure (Months)</label>
                <input 
                  type="number" 
                  value={formData.tenure}
                  onChange={(e) => handleInputChange('tenure', e.target.value)}
                  placeholder="e.g., 36" 
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Interest Type</label>
                <select 
                  value={formData.interestType}
                  onChange={(e) => handleInputChange('interestType', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500"
                >
                  <option>Fixed</option>
                  <option>Floating</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Agent Assigned</label>
                <select 
                  value={formData.agentAssigned}
                  onChange={(e) => handleInputChange('agentAssigned', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500"
                >
                  <option>Agent A</option>
                  <option>Agent B</option>
                  <option>Agent C</option>
                  <option>Agent D</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Application Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500"
                >
                  <option>Draft</option>
                  <option>Submitted</option>
                  <option>Under Review</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-600 uppercase">Document Upload</p>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-bold mb-3">Upload Documents</p>
              <p className="text-xs text-gray-500 mb-4">ID Proof, Address Proof, Salary Slips, Bank Statements</p>
              <label className="inline-block">
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileUpload}
                  className="hidden" 
                />
                <span className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer hover:bg-indigo-700 transition-all inline-flex items-center gap-2">
                  <Paperclip className="w-4 h-4" /> Choose Files
                </span>
              </label>
            </div>

            {uploadedDocs.length > 0 && (
              <div className="space-y-2">
                {uploadedDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                    <button onClick={() => removeDoc(idx)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase">Additional Notes</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Enter any additional information or remarks..."
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95">
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button className="py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
              <Send className="w-4 h-4" /> Submit Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-[calc(100vh-180px)] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loan Applications</h3>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all"
        >
          <Plus className="w-3 h-3" /> New
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {applications.map((app) => (
          <div 
            key={app.id} 
            onClick={() => onSelect(app)} 
            className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-indigo-50 ${selectedId === app.id ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">{app.leadName}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{app.id} • Lead: {app.leadId}</p>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${getStatusColor(app.status)}`}>
                {app.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Product</p>
                <p className="text-xs font-bold text-gray-900">{app.productType}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Amount</p>
                <p className="text-xs font-bold text-indigo-600">{app.requestedAmount}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Tenure</p>
                <p className="text-xs font-bold text-gray-900">{app.tenure}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Documents</p>
                <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <Paperclip className="w-3 h-3" /> {app.docsUploaded}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-gray-500 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {app.applicationDate}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> {app.agentAssigned}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanApplication;