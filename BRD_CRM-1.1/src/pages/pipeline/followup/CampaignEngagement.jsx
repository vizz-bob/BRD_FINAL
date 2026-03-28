import React from 'react';
import { 
  Zap, 
  Send, 
  Eye, 
  MousePointer2, 
  FileText, 
  MessageSquare, 
  BarChart3,
  PhoneForwarded
} from 'lucide-react';

const CampaignEngagement = () => {
  const campaigns = [
    {
      id: "CMP-01",
      leadName: "Siddharth Malhotra",
      channel: "WhatsApp",
      action: "PDF Downloaded",
      content: "Loan_Offer_Q1.pdf",
      time: "12 mins ago",
      score: "+15"
    },
    {
      id: "CMP-02",
      leadName: "Ananya Pandey",
      channel: "Email",
      action: "Link Clicked",
      content: "ROI_Calculator_v2",
      time: "45 mins ago",
      score: "+10"
    },
    {
      id: "CMP-03",
      leadName: "Varun Dhawan",
      channel: "Voice Broadcast",
      action: "Call Completed",
      content: "Reminder_Audio_Auto",
      time: "2 hours ago",
      score: "+5"
    }
  ];

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 bg-white rounded-xl sm:rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <Zap size={24} className="text-indigo-200" />
            <BarChart3 size={20} className="text-indigo-300" />
          </div>
          <p className="text-xs font-medium text-indigo-100 uppercase">Total Nurture Reach</p>
          <p className="text-xl sm:text-2xl font-bold mt-1">12,402</p>
          <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full">
            <div className="h-1.5 w-3/4 bg-white rounded-full" />
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <MessageSquare className="text-green-600" size={20} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase">WhatsApp API</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">84%</p>
          <p className="text-[10px] text-green-600 font-bold mt-1">Delivery Success Rate</p>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <PhoneForwarded className="text-purple-600" size={20} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase">Voice Broadcast</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">1.2k</p>
          <p className="text-[10px] text-purple-600 font-bold mt-1">Minutes Processed Today</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <Send className="text-indigo-600" size={20} />
          Live Nurturing Feed
        </h3>

        <div className="divide-y divide-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
          {campaigns.map((lead) => (
            <div key={lead.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`p-2.5 sm:p-3 rounded-xl flex-shrink-0 ${
                  lead.channel === 'WhatsApp' ? 'bg-green-50' : 
                  lead.channel === 'Email' ? 'bg-purple-50' : 'bg-indigo-50'
                }`}>
                  {lead.channel === 'WhatsApp' && <MessageSquare size={18} className="text-green-600 sm:w-5 sm:h-5" />}
                  {lead.channel === 'Email' && <BarChart3 size={18} className="text-purple-600 sm:w-5 sm:h-5" />}
                  {lead.channel === 'Voice Broadcast' && <PhoneForwarded size={18} className="text-indigo-600 sm:w-5 sm:h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{lead.leadName}</h4>
                  <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{lead.channel}</span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[10px] font-bold text-indigo-600">{lead.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8">
                <div className="text-left sm:text-right">
                  <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-gray-700 mb-0.5 sm:mb-1">
                    {lead.action === 'PDF Downloaded' ? <FileText size={14} /> : <MousePointer2 size={14} />}
                    {lead.action}
                  </div>
                  <p className="text-[10px] text-gray-400">{lead.content}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 px-2.5 py-1 rounded-full border border-green-100 flex-shrink-0">
                    <p className="text-[10px] sm:text-xs font-bold text-green-700">{lead.score} pts</p>
                  </div>

                  <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all border border-transparent hover:border-gray-100 flex-shrink-0">
                    <Eye size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-xl gap-3 text-center sm:text-left">
        <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
          Campaign API Nodes: Connected & Operational
        </div>
        <button className="text-[10px] font-bold text-indigo-600 hover:underline">View Campaign Reports</button>
      </div>
    </div>
  );
};

export default CampaignEngagement;