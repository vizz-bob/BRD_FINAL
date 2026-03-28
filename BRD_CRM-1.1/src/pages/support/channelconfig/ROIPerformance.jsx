import React, { useEffect } from 'react';
import {
  TrendingUp,
  IndianRupee,
  BarChart3,
  AlertCircle,
  ArrowUpRight,
  Target,
  Zap
} from 'lucide-react';
import { getChannelAnalytics } from '../../../services/roiService';

const ROIPerformance = () => {
  const [perfData, setPerfData] = React.useState([]);
  const formatSpend = (amount) => {
    const num = Number(amount);

    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${Math.round(num / 1000)}K`;
    return `₹${num}`;
  };

  const getStatus = (roi) => {
    if (roi < 0) return "Critical";
    if (roi < 20) return "Stable";
    if (roi < 50) return "High ROI";
    return "Excellent";
  };

  const transformData = (data) => {
    return data.map(item => ({
      channel: item.channel, // assuming backend sends string
      leads: item.total_leads,
      cpl: `₹${Math.round(item.cpl)}`,
      spend: formatSpend(item.total_cost),
      conv: `${Math.round(item.conversion_rate)}%`,
      status: getStatus(item.roi)
    }));
  };
  const fetchInitialData = async () => {
    try {
      const res = await getChannelAnalytics();

      if (res?.data) {
        const transformed = transformData(res.data);
        setPerfData(transformed);
      }

    } catch (error) {
      console.error("Error fetching channel performance data:", error);
    }
  };
  useEffect(() => {
    fetchInitialData();
  }, [])
  return (
    <div className="p-4 sm:p-8 space-y-8">
      {/* 1. Performance Diagnostics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Avg. Conversion Rate</p>
          <p className="text-2xl font-bold text-indigo-900 mt-1">18.4%</p>
          <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold mt-2">
            <TrendingUp size={12} /> +2.5% vs Prev Month
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Total ROI</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">164.2%</p>
          <div className="w-full h-1 bg-gray-100 rounded-full mt-3">
            <div className="w-3/4 h-full bg-indigo-600 rounded-full" />
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Marketing Budget</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹2.75L</p>
          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase italic">"Spend Plan Alignment"</p>
        </div>

        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Performance Gaps</p>
          <p className="text-2xl font-bold text-red-900 mt-1">02</p>
          <p className="text-[10px] text-red-600 font-bold mt-2 uppercase">Requires Intervention</p>
        </div>
      </div>

      {/* 2. ROI Heatmap Table (Point 2) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-600" /> Channel Heatmap Diagnostic
          </h3>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Source Audit: Q1 2026
          </span>
        </div>



        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Lead Density</th>
                  <th className="px-6 py-4">CPL</th>
                  <th className="px-6 py-4">Conv. Rate</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {perfData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.channel}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{item.leads}</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full hidden sm:block">
                          <div className={`h-full rounded-full bg-indigo-500`} style={{ width: `${(item.leads / 1000) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-indigo-600">{item.cpl}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-gray-400" />
                        <span className="font-bold text-gray-900">{item.conv}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.status === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                        item.status === 'Excellent' ? 'bg-green-50 text-green-700 border-green-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Operational Logic Feed (Point 4) */}
      <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={120} /></div>
        <div className="relative z-10 space-y-4">
          <h4 className="text-sm font-bold uppercase flex items-center gap-2">
            <Zap size={16} className="text-indigo-400" /> Strategic Alignment Feed
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Corrective Action Trigger</p>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Analysis reveals <strong>IndiaMart</strong> is underperforming despite high density. Triggering <strong>Objection Handling</strong> training module for the assigned sales team.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/10">
                View Predictive Revenue
              </button>
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/50 flex items-center gap-2">
                Apply Budget Shift <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIPerformance;