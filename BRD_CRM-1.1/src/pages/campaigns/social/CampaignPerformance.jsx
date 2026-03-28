import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Eye, ThumbsUp, Share2, MessageCircle, MousePointer, Users } from 'lucide-react';

const SocialMediaPerformance = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  // Overview Stats
  const overviewStats = [
    { label: 'Total Posts', value: '48', change: '+8', trend: 'up', icon: Share2, color: 'indigo' },
    { label: 'Total Impressions', value: '142K', change: '+12.5%', trend: 'up', icon: Eye, color: 'green' },
    { label: 'Engagement Rate', value: '5.8%', change: '+0.8%', trend: 'up', icon: ThumbsUp, color: 'purple' },
    { label: 'Click Rate', value: '3.2%', change: '-0.3%', trend: 'down', icon: MousePointer, color: 'orange' },
  ];

  // Campaign Performance Data
  const campaignPerformance = [
    { name: 'Summer Loan Sale', impressions: 45200, likes: 1230, shares: 89, clicks: 342 },
    { name: 'Home Loan Offer', impressions: 28900, likes: 890, shares: 45, clicks: 198 },
    { name: 'Quick Personal Loan', impressions: 67800, likes: 2100, shares: 156, clicks: 589 },
    { name: 'Credit Card Launch', impressions: 38400, likes: 1450, shares: 78, clicks: 267 },
    { name: 'Business Loan Promo', impressions: 29700, likes: 980, shares: 62, clicks: 223 },
  ];

  // Time Series Data
  const timeSeriesData = [
    { date: 'Mon', impressions: 18200, likes: 456, shares: 34, clicks: 145 },
    { date: 'Tue', impressions: 21300, likes: 589, shares: 42, clicks: 178 },
    { date: 'Wed', impressions: 19800, likes: 512, shares: 38, clicks: 156 },
    { date: 'Thu', impressions: 24100, likes: 645, shares: 51, clicks: 201 },
    { date: 'Fri', impressions: 22700, likes: 598, shares: 45, clicks: 189 },
    { date: 'Sat', impressions: 16400, likes: 423, shares: 28, clicks: 134 },
    { date: 'Sun', impressions: 19700, likes: 478, shares: 35, clicks: 156 },
  ];

  // Platform Breakdown
  const platformBreakdown = [
    { name: 'Facebook', value: 35, color: '#1877F2' },
    { name: 'Instagram', value: 28, color: '#E4405F' },
    { name: 'LinkedIn', value: 22, color: '#0A66C2' },
    { name: 'Twitter', value: 15, color: '#1DA1F2' },
  ];

  // Engagement Funnel
  const engagementFunnel = [
    { stage: 'Impressions', value: 142000, percentage: 100 },
    { stage: 'Profile Visits', value: 12400, percentage: 8.7 },
    { stage: 'Engagements', value: 8236, percentage: 5.8 },
    { stage: 'Link Clicks', value: 4544, percentage: 3.2 },
    { stage: 'Conversions', value: 234, percentage: 0.16 },
  ];

  // Top Performing Posts
  const topPerformingPosts = [
    { post: 'Special Pre-Approved Loan Offer - Apply Now!', platform: 'Facebook', impressions: 15200, engagement: 8.9, clicks: 456 },
    { post: 'Get Your Dream Home - Limited Time Home Loan', platform: 'Instagram', impressions: 12800, engagement: 7.8, clicks: 389 },
    { post: 'Business Growth Made Easy - Quick Approvals', platform: 'LinkedIn', impressions: 9600, engagement: 6.5, clicks: 312 },
    { post: 'Zero Processing Fee on Personal Loans Today', platform: 'Facebook', impressions: 11400, engagement: 7.2, clicks: 367 },
    { post: 'Join 10K+ Happy Customers - Apply Now', platform: 'Instagram', impressions: 13100, engagement: 8.1, clicks: 423 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaign Performance</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time social media analytics and engagement metrics</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Platforms</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="font-medium">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Engagement Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
            />
            <Legend />
            <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} name="Impressions" />
            <Line type="monotone" dataKey="likes" stroke="#10B981" strokeWidth={2} name="Likes" />
            <Line type="monotone" dataKey="shares" stroke="#8B5CF6" strokeWidth={2} name="Shares" />
            <Line type="monotone" dataKey="clicks" stroke="#F59E0B" strokeWidth={2} name="Clicks" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign Performance & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Performance Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="impressions" fill="#3B82F6" name="Impressions" />
              <Bar dataKey="likes" fill="#10B981" name="Likes" />
              <Bar dataKey="shares" fill="#8B5CF6" name="Shares" />
              <Bar dataKey="clicks" fill="#F59E0B" name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Breakdown Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {platformBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {platformBreakdown.map((platform, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }}></div>
                  <span className="text-sm text-gray-600">{platform.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{platform.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Funnel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Funnel</h2>
        <div className="space-y-3">
          {engagementFunnel.map((stage, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                <span className="text-sm text-gray-500">{stage.value.toLocaleString()} ({stage.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stage.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Content</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPerformingPosts.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900">{item.post}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                      {item.platform}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.impressions.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.engagement}%</td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.clicks}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(item.engagement / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">#{idx + 1}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPerformance;

