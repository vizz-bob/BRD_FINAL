import React, { useState } from 'react';
import { 
  XMarkIcon, PhoneIcon, ChatBubbleLeftRightIcon, 
  CalendarDaysIcon, ClockIcon,
  DocumentCheckIcon
} from "@heroicons/react/24/outline";

export default function LeadProfileDrawer({ lead, isOpen, onClose, onConvert }) {
  const [activeTab, setActiveTab] = useState("TIMELINE");

  if (!isOpen || !lead) return null;

  return (
    /* Full-screen on mobile, right-panel on sm+ */
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-900/20 backdrop-blur-sm">
      <div className="w-full sm:max-w-md bg-white h-full shadow-2xl animate-slide-in-right flex flex-col">

        {/* HEADER */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-white p-1"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4 mt-1 sm:mt-2 pr-8">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
              {lead.name ? lead.name.charAt(0) : "U"}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold truncate">{lead.name}</h2>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm mt-0.5">
                <PhoneIcon className="h-3 w-3 flex-shrink-0" />
                <span>{lead.mobile}</span>
              </div>
              <div className="mt-1.5 flex gap-2 flex-wrap">
                <span className="bg-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  {lead.status}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  High Intent
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 border-b border-slate-200 flex-shrink-0">
          <button className="flex flex-col items-center justify-center py-3 sm:py-4 hover:bg-slate-50 transition border-r border-slate-100">
            <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mb-1" />
            <span className="text-[10px] font-bold uppercase text-slate-500">Call</span>
          </button>
          <button className="flex flex-col items-center justify-center py-3 sm:py-4 hover:bg-slate-50 transition border-r border-slate-100">
            <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mb-1" />
            <span className="text-[10px] font-bold uppercase text-slate-500">WhatsApp</span>
          </button>
          <button className="flex flex-col items-center justify-center py-3 sm:py-4 hover:bg-slate-50 transition">
            <CalendarDaysIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mb-1" />
            <span className="text-[10px] font-bold uppercase text-slate-500">Meeting</span>
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-200 flex-shrink-0">
          {['TIMELINE', 'TASKS', 'NOTES'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition ${
                activeTab === tab
                  ? 'border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {activeTab === 'TIMELINE' && (
            <div className="space-y-5 sm:space-y-6">
              <div className="relative pl-5 sm:pl-6 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-500 ring-4 ring-white" />
                <div className="text-xs text-slate-400 font-bold mb-1">Today, 10:30 AM</div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <p className="text-sm font-medium text-slate-800">Interested in Personal Loan</p>
                  <p className="text-xs text-slate-500 mt-1">Customer asked for ROI details. Sent brochure via WhatsApp.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TASKS' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200">
                <input type="checkbox" className="mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-slate-800">Follow up on Documents</div>
                  <div className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" /> Due Today
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'NOTES' && (
            <div className="text-center py-10 text-slate-400 text-sm">No notes yet.</div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex-shrink-0">
          <button
            onClick={() => onConvert(lead)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 sm:py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition active:scale-95 text-sm"
          >
            <DocumentCheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Convert to Deal
          </button>
        </div>
      </div>
    </div>
  );
}