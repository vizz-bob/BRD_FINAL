import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function AddLead() {
  const navigate = useNavigate();
  const [lead, setLead] = useState({
    name: "", mobile: "", email: "", leadSource: "Campaign",
    campaignName: "", leadStatus: "Raw", assignedTo: "",
    followUpDate: "", consentObtained: false, leadQuality: "Medium", product: "",
  });

  const update = (key, value) => setLead((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adding lead:", lead);
    navigate("/leads");
  };

  const inputClass = "w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20";
  const labelClass = "block text-xs font-bold text-slate-600 uppercase mb-2";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="md:pl-64 pt-16">
        <main className="p-4 md:p-8">
          {/* HEADER */}
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <button onClick={() => navigate("/leads")} className="p-2 hover:bg-slate-200 rounded-lg shrink-0">
              <ArrowLeftIcon className="h-5 w-5 md:h-6 md:w-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900">Add New Lead</h1>
              <p className="text-sm text-slate-500 mt-1">Create and manage a new lead entry</p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-8 space-y-6 md:space-y-8">

              {/* Contact Information */}
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className={labelClass}>Lead Name</label>
                    <input value={lead.name} onChange={(e) => update("name", e.target.value)} type="text" className={inputClass} placeholder="e.g. John Doe" required />
                    <p className="text-[11px] text-slate-400 mt-1">In Document: ✅</p>
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Number</label>
                    <input value={lead.mobile} onChange={(e) => update("mobile", e.target.value)} type="tel" className={inputClass} placeholder="e.g. +91 98765 43210" required />
                    <p className="text-[11px] text-slate-400 mt-1">In Document: ✅</p>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Email</label>
                    <input value={lead.email} onChange={(e) => update("email", e.target.value)} type="email" className={inputClass} placeholder="e.g. john@example.com" required />
                    <p className="text-[11px] text-slate-400 mt-1">In Document: ✅</p>
                  </div>
                </div>
              </div>

              {/* Lead Source & Campaign */}
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">Lead Source & Campaign</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className={labelClass}>Lead Source</label>
                    <select value={lead.leadSource} onChange={(e) => update("leadSource", e.target.value)} className={inputClass}>
                      <option>Campaign</option>
                      <option>Third Party</option>
                      <option>Internal</option>
                      <option>Direct</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">In Document: ✅</p>
                  </div>
                  <div>
                    <label className={labelClass}>Campaign Name (link)</label>
                    <input value={lead.campaignName} onChange={(e) => update("campaignName", e.target.value)} type="text" className={inputClass} placeholder="Select or link to campaign" />
                    <p className="text-[11px] text-slate-400 mt-1">In Document: ✅</p>
                  </div>
                </div>
              </div>

              {/* Lead Status & Quality */}
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">Lead Status & Quality</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className={labelClass}>Lead Status</label>
                    <select value={lead.leadStatus} onChange={(e) => update("leadStatus", e.target.value)} className={inputClass}>
                      <option>Raw</option>
                      <option>Hot</option>
                      <option>Deal</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">In Document: Raw → Hot → Deal ✅</p>
                  </div>
                  <div>
                    <label className={labelClass}>Lead Quality</label>
                    <select value={lead.leadQuality} onChange={(e) => update("leadQuality", e.target.value)} className={inputClass}>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">In Document: ✅</p>
                  </div>
                </div>
              </div>

              {/* Assignment & Follow-up */}
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">Assignment & Follow-up</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className={labelClass}>Assigned User / Team</label>
                    <input value={lead.assignedTo} onChange={(e) => update("assignedTo", e.target.value)} type="text" className={inputClass} placeholder="e.g. Sales Team A" />
                    <p className="text-[11px] text-slate-400 mt-1">In Document: ✅</p>
                  </div>
                  <div>
                    <label className={labelClass}>Follow-up Date</label>
                    <input value={lead.followUpDate} onChange={(e) => update("followUpDate", e.target.value)} type="date" className={inputClass} />
                    <p className="text-[11px] text-slate-400 mt-1">In Document: ✅</p>
                  </div>
                </div>
              </div>

              {/* Consent & Product */}
              <div>
                <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">Consent & Product</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className={labelClass}>Product Selection</label>
                    <select value={lead.product} onChange={(e) => update("product", e.target.value)} className={inputClass}>
                      <option value="">-- Select Product --</option>
                      <option>Personal Loan</option>
                      <option>Home Loan</option>
                      <option>Credit Card</option>
                      <option>Savings Account</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-3 text-sm">
                      <input type="checkbox" checked={lead.consentObtained} onChange={(e) => update("consentObtained", e.target.checked)} className="w-5 h-5 rounded" />
                      <span className="text-xs font-bold text-slate-600 uppercase">Consent Obtained</span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-3">In Document: ✅</p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => navigate("/leads")} className="px-6 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                  Create Lead
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}