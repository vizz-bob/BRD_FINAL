import { useState } from "react";
import { 
  MegaphoneIcon, EnvelopeIcon, DevicePhoneMobileIcon, ChatBubbleLeftRightIcon, 
  PlusIcon, PlayIcon, PauseIcon, ChartBarIcon 
} from "@heroicons/react/24/outline";

const MOCK_CAMPAIGNS = [
  { id: 1, name: "Diwali Personal Loan Blast", type: "SMS", status: "Active", sent: 12500, clicked: 3200, conversion: "4.5%" },
  { id: 2, name: "KYC Reminder Sequence", type: "EMAIL", status: "Paused", sent: 4500, clicked: 1200, conversion: "12.0%" },
  { id: 3, name: "WhatsApp Welcome Series", type: "WHATSAPP", status: "Active", sent: 890, clicked: 750, conversion: "35.2%" },
];

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = [
    { label: "Total Reach", value: "1.2M", icon: MegaphoneIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Avg. Open Rate", value: "24.8%", icon: EnvelopeIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Conversions", value: "3,402", icon: ChartBarIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto min-h-screen bg-slate-50">

      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-start md:items-end gap-4 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Campaign Manager</h1>
          <p className="text-slate-500 font-medium mt-2">Orchestrate your omnichannel marketing strategies.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-5 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 whitespace-nowrap text-sm"
        >
          <PlusIcon className="w-5 h-5" /> New Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5">
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
            </div>
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign List */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-slate-100 p-2 gap-1">
          {['ALL', 'SMS', 'EMAIL', 'WHATSAPP'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-8 py-2.5 md:py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="bg-slate-50/50 text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-4 md:px-8 py-5">Campaign Name</th>
                <th className="px-4 md:px-8 py-5">Channel</th>
                <th className="px-4 md:px-8 py-5">Status</th>
                <th className="px-4 md:px-8 py-5">Sent</th>
                <th className="px-4 md:px-8 py-5">Engaged</th>
                <th className="px-4 md:px-8 py-5">Conversion</th>
                <th className="px-4 md:px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CAMPAIGNS.filter(c => activeTab === 'ALL' || c.type === activeTab).map((campaign) => (
                <tr key={campaign.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 md:px-8 py-5 md:py-6">
                    <div className="font-bold text-slate-800">{campaign.name}</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">ID: CMP-{campaign.id}009</div>
                  </td>
                  <td className="px-4 md:px-8 py-5 md:py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wide whitespace-nowrap
                      ${campaign.type === 'SMS' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                      ${campaign.type === 'EMAIL' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                      ${campaign.type === 'WHATSAPP' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                    `}>
                      {campaign.type === 'SMS' && <DevicePhoneMobileIcon className="w-3 h-3" />}
                      {campaign.type === 'EMAIL' && <EnvelopeIcon className="w-3 h-3" />}
                      {campaign.type === 'WHATSAPP' && <ChatBubbleLeftRightIcon className="w-3 h-3" />}
                      {campaign.type}
                    </span>
                  </td>
                  <td className="px-4 md:px-8 py-5 md:py-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${campaign.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{campaign.status}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-5 md:py-6 font-mono text-slate-600 font-bold whitespace-nowrap">{campaign.sent.toLocaleString()}</td>
                  <td className="px-4 md:px-8 py-5 md:py-6 font-mono text-slate-600 font-bold whitespace-nowrap">{campaign.clicked.toLocaleString()}</td>
                  <td className="px-4 md:px-8 py-5 md:py-6">
                    <div className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg inline-block whitespace-nowrap">
                      {campaign.conversion}
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-5 md:py-6 text-right">
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition">
                      {campaign.status === 'Active' ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 animate-fade-in">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6">Start New Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Campaign Name</label>
                <input type="text" className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g. Summer Promo" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Channel</label>
                <div className="grid grid-cols-3 gap-3">
                  {['SMS', 'Email', 'WhatsApp'].map(c => (
                    <button key={c} className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 focus:border-blue-600 focus:text-blue-600 focus:bg-blue-50">{c}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3 mt-8">
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
              <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold">Create Draft</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
