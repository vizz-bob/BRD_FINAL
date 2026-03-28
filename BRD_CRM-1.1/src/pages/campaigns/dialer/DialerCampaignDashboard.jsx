import React, { useState, useEffect } from 'react';
import { 
  Phone, BarChart3, History, Plus, 
  TrendingUp, Users, PhoneOutgoing, 
  CheckCircle, AlertCircle 
} from 'lucide-react';

import DialerPerformance from './DialerPerformance';
import DialerHistory from './DialerHistory';
import CampaignWrapper from './CampaignWrapper';
import { dialerCampaignService } from '../../../services/campaignService';

const DialerCampaignDashboard = () => {
  const [activeTab, setActiveTab] = useState('launch');
  const [activeCampaignCount, setActiveCampaignCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await dialerCampaignService.getAll();
        const active = res.data.filter((c) =>
          ['draft', 'active', 'scheduled', 'in_progress'].includes(c.status)
        ).length;
        setActiveCampaignCount(active);
      } catch (err) {
        console.error('Failed to fetch dialer campaign count', err);
      }
    };
    fetchCount();
  }, []);

  const stats = [
    {
      label: 'Active Campaigns',
      value: activeCampaignCount !== null ? activeCampaignCount : 'N/A',
      icon: PhoneOutgoing,
      color: 'indigo',
    },
    { label: 'Total Calls',       value: 'N/A', icon: Phone,       color: 'green'  },
    { label: 'Avg Connect Rate',  value: 'N/A', icon: TrendingUp,  color: 'purple' },
    { label: 'Engaged Leads',     value: 'N/A', icon: Users,       color: 'orange' },
  ];

  const tabs = [
    { id: 'launch',      label: 'Launch Campaign', icon: Plus      },
    { id: 'performance', label: 'Performance',     icon: BarChart3 },
    { id: 'history',     label: 'Dialer History',  icon: History   },
  ];

  const colorMap = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    green:  { bg: 'bg-green-100',  text: 'text-green-600'  },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Phone className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dialer Campaigns</h1>
              <p className="text-sm text-gray-500">Automate, track, and optimize your outbound calling</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              const colors = colorMap[stat.color];
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className={`text-2xl font-bold ${stat.value === 'N/A' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium transition-all duration-200 ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {activeTab === 'launch' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CampaignWrapper />
          </div>
        )}
        {activeTab === 'performance' && (
          <div className="animate-in fade-in duration-500 bg-white rounded-xl shadow-sm border p-6">
            <DialerPerformance />
          </div>
        )}
        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-500 bg-white rounded-xl shadow-sm border p-6">
            <DialerHistory />
          </div>
        )}
      </main>
    </div>
  );
};

export default DialerCampaignDashboard;
