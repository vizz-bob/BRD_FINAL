import React, { useState } from 'react';
import { 
  Clock, CheckCircle, XCircle, AlertTriangle, 
  User, Calendar, FileCheck, Shield, ArrowLeft,
  MessageSquare, Eye
} from 'lucide-react';

const ApplicationStatus = ({ onSelect, selectedId }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const applications = [
    { 
      id: 'APP-2301',
      leadName: 'Amit Kumar',
      leadId: 'LD-5521',
      productType: 'Home Loan',
      requestedAmount: '₹45,00,000',
      currentStatus: 'Under Review',
      assignedUnderwriter: 'Sarah Johnson',
      lastUpdated: '18 Jan 2025',
      riskCategory: 'Medium',
      remarks: 'Additional salary documents requested. Customer cooperation good.',
      timeline: [
        { stage: 'Draft', date: '15 Jan 2025', status: 'completed', icon: FileCheck },
        { stage: 'Submitted', date: '15 Jan 2025', status: 'completed', icon: CheckCircle },
        { stage: 'Under Review', date: '16 Jan 2025', status: 'active', icon: Clock },
        { stage: 'Approved', date: 'Pending', status: 'pending', icon: Shield }
      ]
    },
    { 
      id: 'APP-2302',
      leadName: 'Priya Sharma',
      leadId: 'LD-5522',
      productType: 'Personal Loan',
      requestedAmount: '₹5,00,000',
      currentStatus: 'Submitted',
      assignedUnderwriter: 'Rajesh Mehta',
      lastUpdated: '17 Jan 2025',
      riskCategory: 'Low',
      remarks: 'All documents verified. Ready for underwriting review.',
      timeline: [
        { stage: 'Draft', date: '16 Jan 2025', status: 'completed', icon: FileCheck },
        { stage: 'Submitted', date: '16 Jan 2025', status: 'active', icon: CheckCircle },
        { stage: 'Under Review', date: 'Pending', status: 'pending', icon: Clock },
        { stage: 'Approved', date: 'Pending', status: 'pending', icon: Shield }
      ]
    },
    { 
      id: 'APP-2304',
      leadName: 'Sneha Patel',
      leadId: 'LD-5524',
      productType: 'Business Loan',
      requestedAmount: '₹25,00,000',
      currentStatus: 'Approved',
      assignedUnderwriter: 'Vikram Singh',
      lastUpdated: '17 Jan 2025',
      riskCategory: 'Low',
      remarks: 'Application approved. Proceeding to disbursement stage.',
      timeline: [
        { stage: 'Draft', date: '14 Jan 2025', status: 'completed', icon: FileCheck },
        { stage: 'Submitted', date: '14 Jan 2025', status: 'completed', icon: CheckCircle },
        { stage: 'Under Review', date: '15 Jan 2025', status: 'completed', icon: Clock },
        { stage: 'Approved', date: '17 Jan 2025', status: 'completed', icon: Shield }
      ]
    },
    { 
      id: 'APP-2305',
      leadName: 'Arjun Desai',
      leadId: 'LD-5525',
      productType: 'Car Loan',
      requestedAmount: '₹12,00,000',
      currentStatus: 'Rejected',
      assignedUnderwriter: 'Priya Iyer',
      lastUpdated: '16 Jan 2025',
      riskCategory: 'High',
      remarks: 'Credit score below threshold. Insufficient income documentation.',
      timeline: [
        { stage: 'Draft', date: '13 Jan 2025', status: 'completed', icon: FileCheck },
        { stage: 'Submitted', date: '13 Jan 2025', status: 'completed', icon: CheckCircle },
        { stage: 'Under Review', date: '14 Jan 2025', status: 'completed', icon: Clock },
        { stage: 'Rejected', date: '16 Jan 2025', status: 'rejected', icon: XCircle }
      ]
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

  const getRiskColor = (risk) => {
    const colors = {
      'Low': 'bg-emerald-100 text-emerald-700',
      'Medium': 'bg-amber-100 text-amber-700',
      'High': 'bg-red-100 text-red-700'
    };
    return colors[risk] || 'bg-gray-100 text-gray-700';
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setShowDetails(true);
  };

  if (showDetails && selectedApp) {
    const getStatusBgColor = (status) => {
      if (status === 'Approved') return 'bg-emerald-50 border-emerald-200';
      if (status === 'Rejected') return 'bg-red-50 border-red-200';
      if (status === 'Under Review') return 'bg-amber-50 border-amber-200';
      return 'bg-indigo-50 border-indigo-200';
    };

    const getStatusTextColor = (status) => {
      if (status === 'Approved') return 'text-emerald-600';
      if (status === 'Rejected') return 'text-red-600';
      if (status === 'Under Review') return 'text-amber-600';
      return 'text-indigo-600';
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDetails(false)} 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Application Status</h3>
              <p className="text-[9px] text-slate-500 font-mono">{selectedApp.id}</p>
            </div>
          </div>
          <Clock className="w-4 h-4 text-slate-600" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center pb-6 border-b border-gray-50">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-100">
              <span className="text-3xl font-black text-white">{selectedApp.leadName.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 mt-2">{selectedApp.leadName}</h2>
            <p className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase">
              {selectedApp.productType} • {selectedApp.requestedAmount}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-600 uppercase">Status Timeline</p>
            <div className="relative">
              {selectedApp.timeline.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 pb-6 last:pb-0 relative">
                    {idx < selectedApp.timeline.length - 1 && (
                      <div className="absolute left-5 top-10 w-0.5 h-full bg-gray-200" />
                    )}
                    
                    <div className={`relative z-10 p-2 rounded-lg ${
                      item.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                      item.status === 'active' ? 'bg-indigo-100 text-indigo-600' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">{item.stage}</p>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                      {item.status === 'active' && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                          <span className="text-xs text-indigo-600 font-bold">In Progress</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`rounded-xl p-4 border-2 ${getStatusBgColor(selectedApp.currentStatus)}`}>
            <p className={`text-[10px] font-black uppercase mb-2 ${getStatusTextColor(selectedApp.currentStatus)}`}>
              Current Status
            </p>
            <p className="text-lg font-black text-gray-900 mb-3">{selectedApp.currentStatus}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Risk Category</p>
                <span className={`inline-block text-[9px] font-black px-2 py-1 rounded-full mt-1 ${getRiskColor(selectedApp.riskCategory)}`}>
                  {selectedApp.riskCategory}
                </span>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Last Updated</p>
                <p className="text-xs font-bold text-gray-900 mt-1">{selectedApp.lastUpdated}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Assigned Underwriter
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-black text-white">{selectedApp.assignedUnderwriter.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedApp.assignedUnderwriter}</p>
                <p className="text-xs text-gray-500">Underwriting Team</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Remarks & Notes
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">{selectedApp.remarks}</p>
            </div>
          </div>

          {selectedApp.currentStatus === 'Under Review' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">Action Required</p>
                <p className="text-xs text-amber-700 mt-1">Additional documents may be needed. Underwriter will contact applicant.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Application Status Tracking</h3>
        <Clock className="w-4 h-4 text-slate-600" />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {applications.map((app) => (
          <div 
            key={app.id} 
            onClick={() => onSelect(app)} 
            className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-indigo-50 ${selectedId === app.id ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{app.leadName}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{app.id} • {app.productType}</p>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${getStatusColor(app.currentStatus)}`}>
                {app.currentStatus}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {app.timeline.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'completed' ? 'bg-emerald-500' :
                    item.status === 'active' ? 'bg-indigo-500 animate-pulse' :
                    item.status === 'rejected' ? 'bg-red-500' :
                    'bg-gray-300'
                  }`} />
                  {idx < app.timeline.length - 1 && (
                    <div className={`w-8 h-0.5 ${
                      item.status === 'completed' ? 'bg-emerald-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Amount</p>
                <p className="text-xs font-bold text-indigo-600">{app.requestedAmount}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Risk</p>
                <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full ${getRiskColor(app.riskCategory)}`}>
                  {app.riskCategory}
                </span>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Updated</p>
                <p className="text-[10px] font-bold text-gray-900">{app.lastUpdated}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <User className="w-3 h-3" />
                <span>{app.assignedUnderwriter}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(app);
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Eye className="w-3 h-3" /> View Timeline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStatus;