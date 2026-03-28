import React, { useState, useEffect } from 'react';
import {
  Skull, User, Calendar, MessageSquare,
  ArrowLeft, Eye, Trash2, ShieldAlert, AlertTriangle,
  XCircle
} from 'lucide-react';
import AddDeadLeadModal from './AddDeadLeadModal';
import leadService from '../../../services/leadService';

const LeadDead = ({ onSelect, selectedId }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deadLeads, setDeadLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchDeadLeads();
  }, []);

  const fetchDeadLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getDeadLeads();
      const formatted = data.map(lead => ({
        ...lead,
        id: lead.lead_id,
        reasonForDead: lead.reason_for_dead.replace(/_/g, ' ').title || lead.reason_for_dead,
        dateMarkedDead: new Date(lead.date_marked_dead).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        verifiedBy: lead.verified_by.replace(/_/g, ' '),
        dataSource: lead.data_source.replace(/_/g, ' '),
        fraudFlag: lead.mark_as_fraud
      }));
      setDeadLeads(formatted);
    } catch (error) {
      console.error("Error fetching dead leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update selected lead when selectedId changes
  useEffect(() => {
    if (selectedId) {
      const lead = deadLeads.find(l => l.id === selectedId);
      if (lead) {
        setSelectedLead(lead);
        setShowDetails(false); // Reset to list view
      }
    } else {
      setSelectedLead(null);
      setShowDetails(false);
    }
  }, [selectedId, deadLeads]);

  const getReasonColor = (reason) => {
    const colors = {
      'Invalid Data': 'bg-gray-100 text-gray-700',
      'Fraud Detected': 'bg-red-100 text-red-700',
      'Fraud': 'bg-red-100 text-red-700',
      'Non-verifiable': 'bg-amber-100 text-amber-700',
      'Missing Critical Data': 'bg-orange-100 text-orange-700'
    };
    return colors[reason] || 'bg-gray-100 text-gray-700';
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
              <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Dead Lead Details</h3>
              <p className="text-[9px] text-slate-500 font-mono">{selectedLead.id}</p>
            </div>
          </div>
          <XCircle className="w-4 h-4 text-indigo-600" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Lead Info Card */}
          <div className="text-center pb-6 border-b border-gray-50">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-gray-100">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mt-2">{selectedLead.name}</h2>
            <p className="text-[11px] font-bold text-gray-600 tracking-widest uppercase">
              {selectedLead.product} • {selectedLead.id}
            </p>
          </div>

          {/* Dead Lead Summary */}
          <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-3">Dead Lead Summary</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Reason:</span>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${getReasonColor(selectedLead.reasonForDead)}`}>
                  {selectedLead.reasonForDead}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Date Marked Dead:</span>
                <span className="text-sm font-bold text-gray-900">{selectedLead.dateMarkedDead}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Data Source:</span>
                <span className="text-sm font-bold text-gray-900">{selectedLead.dataSource}</span>
              </div>
            </div>
          </div>

          {/* Fraud Alert */}
          {selectedLead.fraudFlag && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-black text-red-900 uppercase">Fraud Detected</p>
                <p className="text-xs text-red-700 mt-1">This lead has been flagged for fraudulent activity. Do not pursue.</p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-3">Contact Information</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase font-bold">Phone</span>
                <span className="text-sm font-bold text-gray-900">{selectedLead.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase font-bold">Email</span>
                <span className="text-sm font-bold text-gray-900">{selectedLead.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Verification Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-blue-600 uppercase mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Verified By
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-black text-white">{selectedLead.verifiedBy.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedLead.verifiedBy}</p>
                <p className="text-xs text-gray-500">Quality Assurance / Security</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Notes & Explanation
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">{selectedLead.notes}</p>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-95">
            <Trash2 className="w-4 h-4" /> Permanently Delete Lead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dead Leads - Invalid/Fraud</h3>


        <div className='flex space-x-4'>
          <button onClick={() => setOpen(true)} className='bg-indigo-600 text-white p-2 rounded-md '>+ Add Lead</button>

          <AddDeadLeadModal
            isOpen={open}
            onClose={() => setOpen(false)}
            fetchDeadLeads={fetchDeadLeads}
          />


          <XCircle className="w-4 h-4 text-gray-600" />
        </div>

      </div>

      <div className="flex-1 overflow-y-auto">
        {deadLeads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelect(lead)}
            className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-indigo-50 ${selectedId === lead.id ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-2">
                {lead.fraudFlag && <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5" />}
                <div>
                  <p className="text-sm font-bold text-gray-900">{lead.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{lead.id} • {lead.product}</p>
                </div>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${getReasonColor(lead.reasonForDead)}`}>
                {lead.reasonForDead}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Data Source</p>
                <p className="text-xs font-bold text-gray-900">{lead.dataSource}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Verified By</p>
                <p className="text-xs font-bold text-gray-900">{lead.verifiedBy.split('-')[0].trim()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Marked: {lead.dateMarkedDead}</span>
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

export default LeadDead;