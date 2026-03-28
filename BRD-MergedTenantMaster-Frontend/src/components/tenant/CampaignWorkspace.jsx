import React from 'react';
import { 
  EllipsisHorizontalIcon, ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function CampaignWorkspace({ channel, data = [] }) {
  
  const filteredData = channel === 'OVERVIEW' 
    ? data 
    : data.filter(c => c.type === channel || c.channel === channel);

  const totalReach = filteredData.reduce((acc, curr) => acc + (Number(curr.sent) || 0), 0);
  const totalConversions = filteredData.reduce((acc, curr) => acc + (Number(curr.converted) || 0), 0);
  const avgROI = filteredData.length > 0 
    ? (filteredData.reduce((acc, curr) => acc + parseFloat(curr.roi || 0), 0) / filteredData.length).toFixed(1)
    : "0";

  const stats = [
    { label: "Total Reach", value: totalReach > 1000 ? `${(totalReach/1000).toFixed(1)}K` : totalReach, trend: "Live", color: "text-blue-600" },
    { label: "Channel Focus", value: channel === 'OVERVIEW' ? "All" : channel, trend: "Active", color: "text-blue-600" },
    { label: "Conversions", value: totalConversions.toLocaleString(), trend: "Real-time", color: "text-emerald-600" },
    { label: "Avg ROI", value: `${avgROI}x`, trend: "Dynamic", color: "text-orange-600" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider leading-tight">{stat.label}</div>
            <div className="flex items-end justify-between mt-2 gap-1">
              <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">{stat.value}</div>
              <div className={`text-[10px] font-black uppercase ${stat.color} bg-slate-50 px-1.5 sm:px-2 py-1 rounded-lg tracking-tighter flex-shrink-0`}>{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CAMPAIGN TABLE — scrollable on mobile */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-700 text-xs sm:text-sm uppercase tracking-wide">
            {channel === 'OVERVIEW' ? 'Global' : channel} Campaigns
          </h3>
          <button className="text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Horizontal scroll wrapper for small screens */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[540px]">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Campaign Name</th>
                {channel === 'OVERVIEW' && <th className="px-4 sm:px-6 py-3 sm:py-4">Channel</th>}
                <th className="px-4 sm:px-6 py-3 sm:py-4">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Reach</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Conversion</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 sm:p-12 text-center text-slate-400 font-medium italic text-sm">
                    No active campaigns found in this category.
                  </td>
                </tr>
              ) : (
                filteredData.map((camp) => (
                  <tr key={camp.id} className="hover:bg-blue-50/30 transition group">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="font-bold text-slate-800 text-sm">{camp.name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">ID: {camp.id}</div>
                    </td>
                    {channel === 'OVERVIEW' && (
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 uppercase">
                          {camp.type || camp.channel}
                        </span>
                      </td>
                    )}
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        camp.status === 'Active' || camp.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="font-bold text-slate-700">{(Number(camp.sent) || 0).toLocaleString()}</div>
                      <div className="text-xs text-slate-400 font-medium">Delivered: {camp.delivered || '0%'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="font-bold text-emerald-600">{camp.converted || 0}</div>
                      <div className="text-xs text-slate-400 font-medium">ROI: {camp.roi || '0'}x</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <button className="text-slate-300 hover:text-blue-600 transition-colors">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
