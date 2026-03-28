import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FunnelIcon, 
  PhoneIcon, 
  UserPlusIcon, 
  CalendarDaysIcon,
  MegaphoneIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

import { dashboardApi } from "../../../services/dashboardService";

export default function SalesDashboardView() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    newLeads: { current: 0, target: 10 },
    calls: { current: 0, target: 50 },
    revenue: { current: 0, target: 100000 },
    conversionRate: 0,
    hotLeads: [],
    activeCampaign: null
  });

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.fetchSalesStats();
      if (res.data) setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch sales stats, utilizing defaults", error);
      setStats({
        newLeads: { current: 0, target: 10 },
        calls: { current: 0, target: 40 },
        revenue: { current: 0, target: 500000 },
        conversionRate: 0,
        hotLeads: [],
        activeCampaign: null
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100) + '%';
  };

  const formatCurrency = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString()}`;
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Sales & Growth Workspace</h1>
          <p className="text-sm text-gray-500">Track leads, daily targets, and campaign performance.</p>
        </div>
        <button 
          onClick={() => navigate('/leads')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <UserPlusIcon className="w-4 h-4" /> Add New Lead
        </button>
      </div>

      {/* 1. DYNAMIC PERSONAL TARGETS & KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">

        {/* Metric 1: New Leads */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">New Leads</span>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded shrink-0">Today</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">
            {stats.newLeads.current}
            <span className="text-sm font-medium text-gray-400"> / {stats.newLeads.target}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: getProgress(stats.newLeads.current, stats.newLeads.target) }}></div>
          </div>
        </div>

        {/* Metric 2: Calls Made */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Calls Made</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded shrink-0">Today</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">
            {stats.calls.current}
            <span className="text-sm font-medium text-gray-400"> / {stats.calls.target}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: getProgress(stats.calls.current, stats.calls.target) }}></div>
          </div>
        </div>

        {/* Metric 3: Revenue */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-2 gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Revenue</span>
            <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded shrink-0">Month</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-gray-800">
            {formatCurrency(stats.revenue.current)}
            <span className="text-sm font-medium text-gray-400"> / {formatCurrency(stats.revenue.target)}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: getProgress(stats.revenue.current, stats.revenue.target) }}></div>
          </div>
        </div>

        {/* Metric 4: Conversion Rate */}
        <div className="bg-indigo-600 p-4 rounded-xl border border-indigo-700 shadow-sm text-white flex flex-col justify-center items-center relative overflow-hidden col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <ArrowTrendingUpIcon className="w-16 h-16" />
          </div>
          <FunnelIcon className="w-8 h-8 opacity-80 mb-1 relative z-10" />
          <div className="text-3xl font-black relative z-10">{stats.conversionRate}%</div>
          <div className="text-xs font-medium opacity-70 uppercase tracking-widest relative z-10">Conversion Rate</div>
        </div>
      </div>

      {/* 2. HOT LEADS + CAMPAIGN PULSE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* Hot Leads Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
            <h3 className="font-bold text-gray-700 text-sm md:text-base">Hot Leads (Action Required)</h3>
            <button onClick={() => navigate('/leads')} className="text-xs font-bold text-indigo-600 hover:underline whitespace-nowrap">View All Pipeline</button>
          </div>
          <div className="divide-y divide-gray-50 flex-1">
            {stats.hotLeads && stats.hotLeads.length > 0 ? (
              stats.hotLeads.map((lead, i) => (
                <div key={lead.id || i} className="p-4 hover:bg-gray-50 transition flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 shrink-0">
                      {lead.name ? lead.name.charAt(0) : 'L'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{lead.name}</h4>
                      <p className="text-xs text-gray-500 truncate">Interested in {lead.type} • <span className="font-semibold text-gray-700">₹{lead.amount}</span></p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 text-xs font-bold transition-colors whitespace-nowrap">
                      <PhoneIcon className="w-3.5 h-3.5" /> Call
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 text-xs font-bold transition-colors whitespace-nowrap">
                      <CalendarDaysIcon className="w-3.5 h-3.5" /> Meeting
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">No hot leads assigned today.</div>
            )}
          </div>
        </div>

        {/* Campaign Pulse */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MegaphoneIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <h3 className="font-bold text-gray-700">Campaign Pulse</h3>
          </div>

          <div className="space-y-4 flex-1">
            {stats.activeCampaign ? (
              <div
                className="border border-indigo-100 bg-indigo-50/30 rounded-lg p-3 hover:shadow-sm transition cursor-pointer"
                onClick={() => navigate('/campaigns')}
              >
                <div className="flex justify-between items-center mb-1 gap-2">
                  <span className="font-bold text-gray-800 text-sm truncate">{stats.activeCampaign.name}</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200 font-bold shrink-0">ACTIVE</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">SMS Campaign • {stats.activeCampaign.sent} Sent</p>
                <div className="flex gap-3 text-xs font-semibold">
                  <span className="text-indigo-600">{stats.activeCampaign.clicks} Clicks</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-emerald-600">{stats.activeCampaign.leads} Leads</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 text-xs py-4">No active campaigns</div>
            )}
          </div>

          <button
            onClick={() => navigate('/campaigns')}
            className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
          >
            Manage All Campaigns
          </button>
        </div>
      </div>

    </div>
  );
}
