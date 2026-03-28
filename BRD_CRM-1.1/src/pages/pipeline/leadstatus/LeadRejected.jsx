import React, { useState, useEffect } from 'react';
import {
  Ban, User, Calendar, MessageSquare,
  ArrowLeft, Eye, FileText, AlertCircle, Shield
} from 'lucide-react';
import AddRejectedLeadModal from './AddRejectedLeadModal';
import { leadRejectedService } from '../../../services/pipelineService';

const LeadRejected = ({ onSelect, selectedId }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const initialRejectedLeads = [];


  const [rejectedLeads, setRejectedLeads] = useState(initialRejectedLeads);
  const [open, setOpen] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatEnum = (value) => {
    if (!value) return "";
    return value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const mapRejectedApplication = (item) => {
    return {
      id: `LD-${String(item.lead_id).padStart(4, "0")}`,
      name: item.name,
      phone: item.phone,
      email: item.email,
      product: formatEnum(item.product_type),
      reasonForRejection: formatEnum(item.reason_for_rejection),
      rejectionStage: formatEnum(item.rejection_stage),
      rejectedBy: formatEnum(item.rejected_by),
      rejectionDate: formatDate(item.rejection_date),
      creditScore: item.credit_score,
      requiredScore: item.required_score,
      notes: item.notes,
      applicationId: `APP-${String(item.application_id).padStart(4, "0")}`
    };
  };

  const fetchLeads = async () => {
    try {
      const res = await leadRejectedService.list()
      setRejectedLeads(res.data.map(mapRejectedApplication))
    }
    catch {
      console.log("failed to fetch exp. leads")
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  // Update selected lead when selectedId changes
  useEffect(() => {
    if (selectedId) {
      const lead = rejectedLeads.find(l => l.id === selectedId);
      if (lead) {
        setSelectedLead(lead);
        setShowDetails(false); // Reset to list view
      }
    } else {
      setSelectedLead(null);
      setShowDetails(false);
    }
  }, [selectedId]);

  const getRejectionReasonColor = (reason) => {
    const colors = {
      'Eligibility Criteria Not Met': 'bg-red-100 text-red-700',
      'Documents Missing': 'bg-orange-100 text-orange-700',
      'Policy Conflict': 'bg-indigo-100 text-indigo-700',
      'Debt-to-Income Ratio High': 'bg-amber-100 text-amber-700',
      'Age Eligibility': 'bg-gray-100 text-gray-700'
    };
    return colors[reason] || 'bg-gray-100 text-gray-700';
  };

  const getRejectionStageColor = (stage) => {
    const colors = {
      'Pre-screening': 'bg-blue-100 text-blue-700',
      'After Application': 'bg-indigo-100 text-indigo-700',
      'Underwriting': 'bg-indigo-100 text-indigo-700'
    };
    return colors[stage] || 'bg-gray-100 text-gray-700';
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    // Don't clear selectedLead to maintain selection in list
  };

  if (showDetails && selectedLead) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToList}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Rejected Lead Details</h3>
              <p className="text-[9px] text-slate-500 font-mono">{selectedLead.id}</p>
            </div>
          </div>
          <Ban className="w-4 h-4 text-indigo-600" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer Info Card */}
          <div className="text-center pb-6 border-b border-gray-50">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-100">
              <span className="text-3xl font-black text-white">{selectedLead.name.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 mt-2">{selectedLead.name}</h2>
            <p className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase">
              {selectedLead.product} • {selectedLead.id}
            </p>
          </div>

          {/* Rejection Summary */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-indigo-600 uppercase mb-3 flex items-center gap-2">
              <Ban className="w-4 h-4" /> Rejection Information
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-900">Rejection Reason:</span>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${getRejectionReasonColor(selectedLead.reasonForRejection)}`}>
                  {selectedLead.reasonForRejection}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-900">Rejection Stage:</span>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${getRejectionStageColor(selectedLead.rejectionStage)}`}>
                  {selectedLead.rejectionStage}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-900">Rejection Date:</span>
                <span className="text-sm font-bold text-gray-900">{selectedLead.rejectionDate}</span>
              </div>
            </div>
          </div>

          {/* Credit Score Information */}
          {selectedLead.creditScore > 0 && (
            <div className={`rounded-xl p-4 border-2 ${selectedLead.creditScore >= selectedLead.requiredScore
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
              }`}>
              <p className="text-[10px] font-black uppercase mb-3 ${
                selectedLead.creditScore >= selectedLead.requiredScore 
                  ? 'text-emerald-600' 
                  : 'text-red-600'
              }">Credit Score Analysis</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Applicant Score</p>
                  <p className={`text-3xl font-black ${selectedLead.creditScore >= selectedLead.requiredScore
                    ? 'text-emerald-700'
                    : 'text-red-700'
                    }`}>{selectedLead.creditScore}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Required Score</p>
                  <p className="text-3xl font-black text-gray-700">{selectedLead.requiredScore}</p>
                </div>
              </div>
              {selectedLead.creditScore < selectedLead.requiredScore && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-bold">Below minimum threshold by {selectedLead.requiredScore - selectedLead.creditScore} points</span>
                </div>
              )}
            </div>
          )}

          {/* Application Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-blue-600 uppercase mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Application Reference
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700 uppercase font-bold">Application ID</p>
                <p className="text-sm font-black text-gray-900 mt-1 font-mono">{selectedLead.applicationId}</p>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Eye className="w-3 h-3" /> View
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-3">Contact Information</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase font-bold">Phone</span>
                <span className="text-sm font-bold text-gray-900">{selectedLead.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase font-bold">Email</span>
                <span className="text-sm font-bold text-gray-900">{selectedLead.email}</span>
              </div>
            </div>
          </div>

          {/* Rejected By Information */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Rejected By
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-black text-white">{selectedLead.rejectedBy.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedLead.rejectedBy}</p>
                <p className="text-xs text-gray-500">Underwriting / QA Team</p>
              </div>
            </div>
          </div>

          {/* Rejection Notes */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Rejection Notes
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">{selectedLead.notes}</p>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900">Audit Trail Recorded</p>
              <p className="text-xs text-amber-700 mt-1">Rejection logged for compliance and reporting purposes.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rejected Leads - Eligibility/Policy</h3>

        <div className='flex space-x-4'>
          <button onClick={() => setOpen(true)} className='bg-indigo-600 text-white p-2 rounded-md '>+ Add Lead</button>

          <AddRejectedLeadModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onAdd={(lead) => setRejectedLeads((prev) => [...prev, lead])}
          />


          <Ban className="w-4 h-4 text-indigo-600" />
        </div>

      </div>

      <div className="flex-1 overflow-y-auto">
        {rejectedLeads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelect(lead)}
            className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-indigo-50 ${selectedId === lead.id ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{lead.name}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{lead.id} • {lead.product}</p>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${getRejectionReasonColor(lead.reasonForRejection)}`}>
                {lead.reasonForRejection}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Rejection Stage</p>
                <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full mt-1 ${getRejectionStageColor(lead.rejectionStage)}`}>
                  {lead.rejectionStage}
                </span>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Rejected By</p>
                <p className="text-xs font-bold text-gray-900">{lead.rejectedBy?.split('-')[0].trim()}</p>
              </div>
              {lead.creditScore > 0 && (
                <>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Credit Score</p>
                    <p className={`text-sm font-black ${lead.creditScore >= lead.requiredScore ? 'text-emerald-600' : 'text-red-600'}`}>
                      {lead.creditScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Required</p>
                    <p className="text-sm font-black text-gray-700">{lead.requiredScore}</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Rejected: {lead.rejectionDate}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(lead);
                }}
                className="text-xs font-bold rounded-md p-2 bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1"
              >
                <Eye className="w-3 h-3" /> Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadRejected;