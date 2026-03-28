import React, { useState } from 'react';
import {
  ArrowLeft, Edit3, Save, Phone, Mail,
  CheckCircle, ShieldAlert, Clock,
  Trash2, FileText, User, Tag, ArrowRight
} from 'lucide-react';
import leadService from '../../../services/leadService';

const RawLeadDetailsView = ({ lead, moveToQualified, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [remarks, setRemarks] = useState(lead?.notes || "");

  const mapToQualified = (lead) => {
    console.log("Mapping lead to qualified format:", lead);
    return {              
      id: lead.id,
      lead_id: lead.id,
      name: lead.contactName,
      phone: lead.phone,
      email: lead.email,
      city: lead.city,
      interestArea: (lead.interestArea || "").replace("_", "-"),
      lastContact: lead.updated_at?.split("T")[0] || null,
      eligibilityStatus: "under-review",
      documentsCollected: [],
    };
  };

  const handleMarkDead = async () => {
    if (window.confirm("Are you sure you want to mark this lead as Dead?")) {
      try {
        await leadService.markRawLeadDead(lead.id);
        onBack();
      } catch (error) {
        console.error("Error marking dead:", error);
      }
    }
  };

  if (!lead) return (
    <div className="h-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center p-8 text-center text-gray-400">
      Select a lead to process qualification
    </div>
  );

  return (
    <aside className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <button onClick={onBack} className="lg:hidden p-2 text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Lead Processor</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${isEditing ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
        >
          {isEditing ? 'Save Changes' : 'Edit Lead'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile Card */}
        <div className="text-center pb-6 border-b border-gray-50">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-indigo-100 relative">
            <User className="w-8 h-8 text-indigo-600" />
            {lead.isDuplicate && <ShieldAlert className="absolute -top-1 -right-1 w-5 h-5 text-orange-500 fill-white" />}
          </div>
          <h2 className="text-lg font-bold text-gray-900">{lead.contactName}</h2>
          <p className="text-[10px] font-bold text-indigo-600 bg-gray-200 px-2 py-0.5 rounded-full inline-block mt-1">STAGE 1: RAW</p>
        </div>

        {/* Contact Metadata */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="mobile-number" className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Mobile Number</label>
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              {isEditing ? (
                <input id="mobile-number" name="phone" className="bg-transparent text-sm w-full outline-none font-semibold" defaultValue={lead.phone} />
              ) : (
                <span className="text-sm font-semibold text-gray-800">{lead.phone}</span>
              )}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Lead Source</label>
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-800">{lead.vendorSource}</span>
            </div>
          </div>
        </div>

        {/* Remarks/Notes Section */}
        <div>
          <label htmlFor="raw-remarks" className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Agent Remarks</label>
          <textarea
            id="raw-remarks"
            name="remarks"
            className="w-full p-3 bg-indigo-50/30 border border-indigo-100 rounded-lg text-xs italic min-h-[80px] outline-none focus:ring-1 focus:ring-indigo-200"
            placeholder="Add initial contact notes here..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* TIMELINE WIDGET */}
        <div className="pt-4">
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-4">Lifecycle Timeline</label>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white" />
              <p className="text-xs font-bold text-gray-900">Entered Raw Stage</p>
              <p className="text-[10px] text-gray-500">{lead.lastActivity} via API Ingestion</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white" />
              <p className="text-xs font-bold text-gray-400 italic">Waiting for Qualification...</p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-6 space-y-3 border-t border-gray-50">
          <button
            onClick={() => moveToQualified(mapToQualified(lead))}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            <CheckCircle className="w-4 h-4" /> Move to Qualified <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleMarkDead}
            className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest border border-gray-200 hover:bg-red-500 flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Mark Lead Dead
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RawLeadDetailsView;