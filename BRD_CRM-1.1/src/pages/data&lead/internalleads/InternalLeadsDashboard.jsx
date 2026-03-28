import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, UserCheck, Award, TrendingUp, UserPlus, RefreshCw, Database, Upload as UploadIcon } from 'lucide-react';
import InternalUploadData from './InternalUploadData';
import InternalAllocateData from './InternalAllocateData';
import InternalReallocateData from './InternalReallocateData';
import InternalAllData from './InternalAllData';
import { InternalLeadService } from '../../../services/dataAndLeads.service';

const InternalLeadsDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('upload');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const tabs = [
    { id: 'upload',     label: 'Upload Data',          icon: UploadIcon },
    { id: 'allocate',   label: 'Allocate Data',        icon: UserPlus   },
    { id: 'reallocate', label: 'Reallocate Data',      icon: RefreshCw  },
    { id: 'all',        label: 'All Internal Leads',   icon: Database   },
  ];

  useEffect(() => {
    const last = location.pathname.split('/').pop();
    if (tabs.some(t => t.id === last)) setActiveTab(last);
  }, [location.pathname]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await InternalLeadService.stats();
      setStats(res.data);
    } catch (err) {
      console.error('Stats fetch failed:', err);
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const val = (v) => (statsLoading ? '…' : v !== undefined && v !== null ? v : 'N/A');

  const statCards = [
    {
      label: 'Total Internal Leads',
      value: val(stats?.total_internal_leads),
      sub: 'Employee referrals',
      icon: Users,
      bg: 'bg-indigo-100', text: 'text-indigo-600',
    },
    {
      label: 'Avg. Conversion Rate',
      value: stats ? `${val(stats?.conversion_rate)}%` : 'N/A',
      sub: 'Based on HOT leads',
      icon: TrendingUp,
      bg: 'bg-green-100', text: 'text-green-600',
    },
    {
      label: 'Top Referrer',
      value: val(stats?.top_referrer),
      sub: stats?.top_referrer_count ? `${stats.top_referrer_count} referrals` : '',
      icon: Award,
      bg: 'bg-purple-100', text: 'text-purple-600',
    },
    {
      label: 'Active This Month',
      value: val(stats?.active_this_month),
      sub: 'Created this month',
      icon: UserCheck,
      bg: 'bg-orange-100', text: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Internal Referral Leads</h1>
                <p className="text-sm text-gray-500">Manage leads from employee referrals and internal sources</p>
              </div>
            </div>
            <button
              onClick={fetchStats}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Stats
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className="text-xl font-bold text-gray-900 mb-1">{s.value}</p>
                      <p className="text-xs text-gray-500">{s.sub}</p>
                    </div>
                    <div className={`p-3 ${s.bg} rounded-lg`}>
                      <Icon className={`w-6 h-6 ${s.text}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive ? 'border-indigo-600 text-indigo-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === 'upload'     && <InternalUploadData onLeadCreated={fetchStats} />}
        {activeTab === 'allocate'   && <InternalAllocateData />}
        {activeTab === 'reallocate' && <InternalReallocateData />}
        {activeTab === 'all'        && <InternalAllData />}
      </div>
    </div>
  );
};

export default InternalLeadsDashboard;
