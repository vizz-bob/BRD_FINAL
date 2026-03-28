import React, { useState, useEffect } from 'react';
import {
  Clock, User, Calendar, MessageSquare,
  ArrowLeft, Eye, RefreshCw, AlertTriangle, Bell
} from 'lucide-react';
import AddExpiredLeadModal from './AddExpiredLeadModal';
import { leadExpiredService } from '../../../services/pipelineService';

const LeadExpired = ({ onSelect, selectedId }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const initialExpiredLeads = [];

  const [expiredLeads, setExpiredLeads] = useState(initialExpiredLeads);
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

  const formatProduct = (value) => {
    return value
      ?.toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatAgent = (agent) => {
    return agent?.replace("_", " ");
  };

  const mapExpiredLead = (lead) => {
    return {
      id: `LD-${String(lead.lead_id).padStart(4, "0")}`,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      product: formatProduct(lead.product_type),
      validityExpiryDate: formatDate(lead.validity_expiry_date),
      expiryReason: formatProduct(lead.expiry_reason),
      agentName: formatAgent(lead.assigned_agent),
      systemExpiryFlag: lead.system_auto_expired,
      daysExpired: lead.days_expired,
      offerDetails: lead.offer_details,
      lastContactDate: formatDate(lead.last_contact_date)
    };
  };
  const fetchLeads = async () => {
    try {
      const res = await leadExpiredService.list()
      setExpiredLeads(res.data.map(mapExpiredLead))
    }
    catch {
      console.log("failed to fetch exp. leads")
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])


  const addExpired = async (formData) => {
    try {
      const payload = {
        lead_id: formData.id,                     
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        product_type: formData.product,           
        validity_expiry_date: formData.validityExpiryDate,
        expiry_reason: formData.expiryReason,
        assigned_agent: formData.agentName,       
        days_expired: Number(formData.daysExpired),
        system_expiry_flag: formData.systemExpiryFlag,
        offer_details: formData.offerDetails,
        last_contact_date: formData.lastContactDate,
      };

      const newLead = await leadExpiredService.create(payload);
      fetchLeads()
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Update selected lead when selectedId changes
  useEffect(() => {
    if (selectedId) {
      const lead = expiredLeads.find(l => l.id === selectedId);
      if (lead) {
        setSelectedLead(lead);
        setShowDetails(false); // Reset to list view
      }
    } else {
      setSelectedLead(null);
      setShowDetails(false);
    }
  }, [selectedId]);

  const getExpiryReasonColor = (reason) => {
    const colors = {
      'Time-bound Offer': 'bg-indigo-100 text-indigo-700',
      'Offer Validity Expired': 'bg-orange-100 text-orange-700',
      'Budget Lapse': 'bg-red-100 text-red-700',
      'Seasonal Campaign Ended': 'bg-purple-100 text-purple-700',
      'Academic Year Deadline': 'bg-blue-100 text-blue-700'
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
              <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Expired Lead Details</h3>
              <p className="text-[9px] text-slate-500 font-mono">{selectedLead.id}</p>
            </div>
          </div>
          <Clock className="w-4 h-4 text-indigo-600" />
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

          {/* Expiry Summary */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-indigo-600 uppercase mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Expiry Information
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-900">Expiry Reason:</span>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${getExpiryReasonColor(selectedLead.expiryReason)}`}>
                  {selectedLead.expiryReason}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-900">Validity Expired On:</span>
                <span className="text-sm font-bold text-gray-900">{selectedLead.validityExpiryDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-900">Days Since Expiry:</span>
                <span className="text-lg font-black text-indigo-700">{selectedLead.daysExpired} days</span>
              </div>
            </div>
          </div>

          {/* System Flag Alert */}
          {selectedLead.systemExpiryFlag && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-900">Auto-Expired by System</p>
                <p className="text-xs text-blue-700 mt-1">This lead was automatically marked as expired based on configured rules.</p>
              </div>
            </div>
          )}

          {/* Offer Details */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-purple-600 uppercase mb-2">Offer Details</p>
            <p className="text-sm text-purple-900">{selectedLead.offerDetails}</p>
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

          {/* Activity Information */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-3">Last Activity</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Last Contact</p>
                <p className="text-sm font-bold text-gray-900">{selectedLead.lastContactDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Assigned Agent</p>
                <p className="text-sm font-bold text-gray-900">{selectedLead.agentName}</p>
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

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button className="py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-95">
              <RefreshCw className="w-4 h-4" /> Renew Offer
            </button>
            <button className="py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
              <Bell className="w-4 h-4" /> Re-engage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expired Leads - Time-bound Offers</h3>


        <div className='flex space-x-4'>
          <button onClick={() => setOpen(true)} className='bg-indigo-600 text-white p-2 rounded-md '>+ Add Lead</button>

          <AddExpiredLeadModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onAdd={addExpired}
          />


          <Clock className="w-4 h-4 text-indigo-600" />
        </div>

      </div>

      <div className="flex-1 overflow-y-auto">
        {expiredLeads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelect(lead)}
            className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-indigo-50 ${selectedId === lead.id ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-2">
                {lead.systemExpiryFlag && <Bell className="w-4 h-4 text-blue-600 mt-0.5" />}
                <div>
                  <p className="text-sm font-bold text-gray-900">{lead.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{lead.id} • {lead.product}</p>
                </div>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${getExpiryReasonColor(lead.expiryReason)}`}>
                {lead.expiryReason}
              </span>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 mb-3">
              <p className="text-xs text-indigo-900 italic">{lead.offerDetails}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Expired On</p>
                <p className="text-xs font-bold text-gray-900">{lead.validityExpiryDate}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Days Expired</p>
                <p className="text-xs font-bold text-indigo-600">{lead.daysExpired} days</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Last Contact: {lead.lastContactDate}</span>
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

export default LeadExpired;