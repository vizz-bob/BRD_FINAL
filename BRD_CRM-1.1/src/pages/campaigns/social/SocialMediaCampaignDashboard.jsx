import React, { useState, useEffect } from 'react';
import { 
  Megaphone, TrendingUp, History, Share2, 
  Eye, MousePointer, Users, ThumbsUp, MessageCircle
} from 'lucide-react';
import LaunchCampaign from './LaunchCampaign';
import CampaignPerformance from './CampaignPerformance';
import PastCampaigns from './PastCampaigns';
import { socialMediaCampaignService } from '../../../services/campaignService';

const SocialMediaCampaignDashboard = () => {
  const [activeTab, setActiveTab] = useState('launch');
  const [activeCampaignCount, setActiveCampaignCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await socialMediaCampaignService.getAll();
        const active = res.data.filter((c) =>
          ['draft', 'active', 'scheduled', 'in_progress'].includes(c.status)
        ).length;
        setActiveCampaignCount(active);
      } catch (err) {
        console.error('Failed to fetch social media campaign count', err);
      }
    };
    fetchCount();
  }, []);

  const tabs = [
    { id: 'launch',      label: 'Launch Campaign',      icon: Megaphone  },
    { id: 'performance', label: 'Campaign Performance', icon: TrendingUp },
    { id: 'past',        label: 'Past Campaigns',       icon: History    },
  ];

  const stats = [
    {
      label:     'Active Campaigns',
      value:     activeCampaignCount !== null ? activeCampaignCount : 'N/A',
      icon:      Share2,
      bgColor:   'bg-indigo-100',
      textColor: 'text-indigo-600',
    },
    {
      label:     'Total Impressions',
      value:     'N/A',
      icon:      Eye,
      bgColor:   'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      label:     'Engagement Rate',
      value:     'N/A',
      icon:      ThumbsUp,
      bgColor:   'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      label:     'Click-Through Rate',
      value:     'N/A',
      icon:      MousePointer,
      bgColor:   'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      label:     'Leads Generated',
      value:     'N/A',
      icon:      Users,
      bgColor:   'bg-pink-100',
      textColor: 'text-pink-600',
    },
    {
      label:     'Total Comments',
      value:     'N/A',
      icon:      MessageCircle,
      bgColor:   'bg-indigo-100',
      textColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Share2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Social Media Campaigns</h1>
              <p className="text-sm text-gray-500">
                Promote offers and brand presence across social platforms
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold mb-1 ${stat.value === 'N/A' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                      <Icon className={`w-5 h-5 ${stat.textColor}`} />
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
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
        {activeTab === 'launch'      && <LaunchCampaign />}
        {activeTab === 'performance' && <CampaignPerformance />}
        {activeTab === 'past'        && <PastCampaigns />}
      </div>
    </div>
  );
};

export default SocialMediaCampaignDashboard;