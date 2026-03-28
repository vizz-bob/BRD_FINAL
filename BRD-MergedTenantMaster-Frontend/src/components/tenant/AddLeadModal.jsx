import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddLeadModal({ isOpen, onClose, onLeadAdded }) {
  const [lead, setLead] = useState({
    name: "",
    mobile: "",
    email: "",
    leadSource: "Campaign",
    campaignName: "",
    leadStatus: "Raw",
    assignedTo: "",
    followUpDate: "",
    consentObtained: false,
    leadQuality: "Medium",
    product: "",
  });

  const update = (key, value) => setLead((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adding lead:", lead);
    if (onLeadAdded) onLeadAdded(lead);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fade-in max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-slate-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800">Add New Lead</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1 hidden sm:block">
              Create and manage a new lead entry
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition flex-shrink-0">
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-6 sm:space-y-8">

          {/* SECTION 1: Contact Information */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Lead Name
                </label>
                <input
                  value={lead.name}
                  onChange={(e) => update("name", e.target.value)}
                  type="text"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Mobile Number
                </label>
                <input
                  value={lead.mobile}
                  onChange={(e) => update("mobile", e.target.value)}
                  type="tel"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="e.g. +91 98765 43210"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Email
                </label>
                <input
                  value={lead.email}
                  onChange={(e) => update("email", e.target.value)}
                  type="email"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="e.g. john@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Lead Source & Campaign */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Lead Source & Campaign
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Lead Source
                </label>
                <select
                  value={lead.leadSource}
                  onChange={(e) => update("leadSource", e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm"
                >
                  <option>Campaign</option>
                  <option>Third Party</option>
                  <option>Internal</option>
                  <option>Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Campaign Name (link)
                </label>
                <input
                  value={lead.campaignName}
                  onChange={(e) => update("campaignName", e.target.value)}
                  type="text"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="Select or link to campaign"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Lead Status & Quality */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Lead Status & Quality
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Lead Status
                </label>
                <select
                  value={lead.leadStatus}
                  onChange={(e) => update("leadStatus", e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm"
                >
                  <option>Raw</option>
                  <option>Hot</option>
                  <option>Deal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Lead Quality
                </label>
                <select
                  value={lead.leadQuality}
                  onChange={(e) => update("leadQuality", e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: Assignment & Follow-up */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Assignment & Follow-up
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Assigned User / Team
                </label>
                <input
                  value={lead.assignedTo}
                  onChange={(e) => update("assignedTo", e.target.value)}
                  type="text"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="e.g. Sales Team A or user id"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Follow-up Date
                </label>
                <input
                  value={lead.followUpDate}
                  onChange={(e) => update("followUpDate", e.target.value)}
                  type="date"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: Consent & Product */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Consent & Product
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Product Selection
                </label>
                <select
                  value={lead.product}
                  onChange={(e) => update("product", e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm"
                >
                  <option value="">-- Select Product --</option>
                  <option>Personal Loan</option>
                  <option>Home Loan</option>
                  <option>Credit Card</option>
                  <option>Savings Account</option>
                </select>
              </div>

              <div className="flex items-center sm:items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lead.consentObtained}
                    onChange={(e) => update("consentObtained", e.target.checked)}
                    className="w-5 h-5 rounded flex-shrink-0"
                  />
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    Consent Obtained
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-sm"
            >
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
