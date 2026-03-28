import React, { useState, useEffect } from 'react';
import {
  XCircle, User, Calendar, MessageSquare,
  ArrowLeft, Eye, Archive, RefreshCw, AlertTriangle,
  AlertCircle
} from 'lucide-react';
import AddLostLeadModal from './AddLostLeadModal';
import leadService from '../../../services/leadService';

const LeadLost = ({ onSelect, selectedId }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [lostLeads, setLostLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchLostLeads();
  }, []);

  const fetchLostLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getLostLeads();
      const formatted = data.map(lead => ({
        ...lead,
        id: lead.lead_id,
        daysInactive: lead.days_inactive,
        reasonForLoss: lead.reason_for_loss.replace(/_/g, ' ').title || lead.reason_for_loss,
        dateMarkedLost: new Date(lead.date_marked_lost).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        agentName: lead.agent_name.replace(/_/g, ' '),
        lastActivity: new Date(lead.last_activity).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        lostValue: lead.lostValueDisplay || `₹${lead.lost_value}`
      }));
      setLostLeads(formatted);
    } catch (error) {
      console.error("Error fetching lost leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update selected lead when selectedId changes
  useEffect(() => {
    if (selectedId) {
      const lead = lostLeads.find(l => l.id === selectedId);
      if (lead) {
        setSelectedLead(lead);
        setShowDetails(false); // Reset to list view
      }
    } else {
      setSelectedLead(null);
      setShowDetails(false);
    }
  }, [selectedId, lostLeads]);

  const getReasonColor = (reason) => {
    const colors = {
      'Competitor': 'bg-red-100 text-red-700',
      'No Response': 'bg-gray-100 text-gray-700',
      'High Interest Rate': 'bg-orange-100 text-orange-700',
      'Changed Requirements': 'bg-blue-100 text-blue-700',
      'Budget Constraints': 'bg-amber-100 text-amber-700'
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
              <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Lead Lost Details</h3>
              <p className="text-[9px] text-slate-500 font-mono">{selectedLead.id}</p>
            </div>
          </div>
          <AlertCircle className="w-4 h-4 text-indigo-600" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer Info Card */}
          <div className="text-center pb-6 border-b border-gray-50">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-red-100">
              <span className="text-3xl font-black text-white">{selectedLead.name.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 mt-2">{selectedLead.name}</h2>
            <p className="text-[11px] font-bold text-red-600 tracking-widest uppercase">
              {selectedLead.product} • {selectedLead.id}
            </p>
          </div>

          {/* Loss Summary */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-red-600 uppercase mb-3">Loss Summary</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-900">Reason for Loss:</span>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${getReasonColor(selectedLead.reasonForLoss)}`}>
                  {selectedLead.reasonForLoss}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-900">Lost Value:</span>
                <span className="text-lg font-black text-red-700">{selectedLead.lostValue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-900">Date Marked Lost:</span>
                <span className="text-sm font-bold text-gray-900">{selectedLead.dateMarkedLost}</span>
              </div>
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

          {/* Activity Timeline */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-amber-600 uppercase mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Inactivity Alert
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-amber-700 uppercase font-bold">Days Inactive</p>
                <p className="text-2xl font-black text-amber-900">{selectedLead.daysInactive}</p>
              </div>
              <div>
                <p className="text-xs text-amber-700 uppercase font-bold">Last Activity</p>
                <p className="text-sm font-bold text-amber-900">{selectedLead.lastActivity}</p>
              </div>
            </div>
          </div>

          {/* Agent Information */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Assigned Agent
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-black text-white">{selectedLead.agentName.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedLead.agentName}</p>
                <p className="text-xs text-gray-500">Sales Team</p>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Remarks & Notes
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">{selectedLead.remarks}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button className="py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95">
              <RefreshCw className="w-4 h-4" /> Reactivate
            </button>
            <button className="py-3 bg-gray-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-700 transition-all active:scale-95">
              <Archive className="w-4 h-4" /> Archive
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lead Lost - Unconverted Leads</h3>

        <div className='flex space-x-4'>
          <button onClick={() => setOpen(true)} className='bg-indigo-600 text-white p-2 rounded-md '>+ Add Lead</button>

          <AddLostLeadModal
            isOpen={open}
            fetchLostLeads={fetchLostLeads}
            onClose={() => setOpen(false)}
            onAdd={(lead) => setLostLeads((prev) => [...prev, lead])}
          />


          <AlertCircle className="w-4 h-4 text-indigo-600" />
        </div>

      </div>

      <div className="flex-1 overflow-y-auto">
        {lostLeads.map((lead) => (
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
              <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${getReasonColor(lead.reasonForLoss)}`}>
                {lead.reasonForLoss}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Lost Value</p>
                <p className="text-sm font-black text-red-600">{lead.lostValue}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Days Inactive</p>
                <p className="text-sm font-bold text-amber-600">{lead.daysInactive} days</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Marked Lost</p>
                <p className="text-xs font-bold text-gray-900">{lead.dateMarkedLost}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Agent</p>
                <p className="text-xs font-bold text-gray-900">{lead.agentName}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Last Activity: {lead.lastActivity}</span>
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

export default LeadLost;