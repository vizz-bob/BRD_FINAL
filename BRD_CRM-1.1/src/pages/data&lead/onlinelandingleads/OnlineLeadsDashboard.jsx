// OnlineLeadsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Globe, MousePointerClick, Zap, BarChart3,
  UserPlus, RefreshCw, Database, Link as LinkIcon
} from 'lucide-react';
import { OnlineLeadService } from '../../../services/dataAndLeads.service';
import OnlineUploadData from './OnlineUploadData';
import OnlineAllocateData from './OnlineAllocateData';
import OnlineReallocateData from './OnlineReallocateData';
import OnlineAllData from './OnlineAllData';

const OnlineLeadsDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('upload');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const tabs = [
    { id: 'upload',     label: 'Upload Data',       icon: LinkIcon,   path: 'upload' },
    { id: 'allocate',   label: 'Allocate Data',      icon: UserPlus,   path: 'allocate' },
    { id: 'reallocate', label: 'Reallocate Data',    icon: RefreshCw,  path: 'reallocate' },
    { id: 'all',        label: 'All Online Leads',   icon: Database,   path: 'all' }
  ];

  useEffect(() => {
    const last = location.pathname.split('/').pop();
    const valid = tabs.map(t => t.path);
    if (valid.includes(last)) setActiveTab(last);
  }, [location.pathname]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await OnlineLeadService.stats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const statCards = [
    {
      label: 'Total Online Leads',
      value: statsLoading ? '…' : (stats?.total_online_leads ?? 'N/A'),
      icon: Globe,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      sub: 'via API/Webhooks/File'
    },
    {
      label: 'Avg. Conversion Rate',
      value: statsLoading ? '…' : (stats ? `${stats.conversion_rate}%` : 'N/A'),
      icon: Zap,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      sub: 'HOT leads / total'
    },
    {
      label: 'Top Source',
      value: statsLoading ? '…' : (stats?.top_source ?? 'N/A'),
      icon: MousePointerClick,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      sub: statsLoading ? '' : (stats ? `${stats.top_source_count} leads` : '')
    },
    {
      label: 'Active This Month',
      value: statsLoading ? '…' : (stats?.active_this_month ?? 'N/A'),
      icon: BarChart3,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      sub: 'leads created this month'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Globe className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Online & Landing Page Leads</h1>
                <p className="text-sm text-gray-500">
                  Manage high-intent prospects captured through digital marketing channels
                </p>
              </div>
            </div>
            <button
              onClick={fetchStats}
              className="flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-600">{stat.sub}</p>
                    </div>
                    <div className={`p-4 ${stat.bgColor} rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.path;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.path)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
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
        {activeTab === 'upload'     && <OnlineUploadData onLeadCreated={fetchStats} />}
        {activeTab === 'allocate'   && <OnlineAllocateData />}
        {activeTab === 'reallocate' && <OnlineReallocateData />}
        {activeTab === 'all'        && <OnlineAllData />}
      </div>
    </div>
  );
};

export default OnlineLeadsDashboard;
