import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, MessageCircle, MousePointer, Eye, Users, Calendar, Filter, Smartphone } from 'lucide-react';

const WhatsAppPerformance = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  // Sample data
  const overviewStats = [
    { label: 'Total Sent', value: '42,156', change: '+15.2%', trend: 'up', icon: MessageCircle, color: 'indigo' },
    { label: 'Delivered', value: '41,842', change: '+14.8%', trend: 'up', icon: Users, color: 'green' },
    { label: 'Read Rate', value: '84.5%', change: '+5.3%', trend: 'up', icon: Eye, color: 'purple' },
    { label: 'CTR', value: '18.2%', change: '+1.5%', trend: 'up', icon: MousePointer, color: 'orange' },
  ];

  const campaignPerformance = [
    { name: 'Home Loan Q1', sent: 5200, read: 4456, clicked: 823, converted: 189 },
    { name: 'Personal Loan', sent: 4800, read: 3948, clicked: 787, converted: 172 },
    { name: 'Credit Card Promo', sent: 6100, read: 5147, clicked: 1012, converted: 203 },
    { name: 'Refinance Offer', sent: 3900, read: 3253, clicked: 598, converted: 158 },
    { name: 'Educational Loan', sent: 4156, read: 3638, clicked: 745, converted: 194 },
  ];

  const timeSeriesData = [
    { date: 'Mon', sent: 3420, read: 2856, clicked: 567 },
    { date: 'Tue', sent: 3680, read: 3112, clicked: 589 },
    { date: 'Wed', sent: 3240, read: 2798, clicked: 545 },
    { date: 'Thu', sent: 4120, read: 3643, clicked: 721 },
    { date: 'Fri', sent: 3890, read: 3267, clicked: 698 },
    { date: 'Sat', sent: 2650, read: 2123, clicked: 478 },
    { date: 'Sun', sent: 2156, read: 1843, clicked: 356 },
  ];

  const deviceBreakdown = [
    { name: 'Android', value: 65, color: '#10B981' },
    { name: 'iOS', value: 25, color: '#3B82F6' },
    { name: 'Web/Desktop', value: 10, color: '#F59E0B' },
  ];

  const engagementFunnel = [
    { stage: 'Sent', value: 42156, percentage: 100 },
    { stage: 'Delivered', value: 41842, percentage: 99.2 },
    { stage: 'Read', value: 35621, percentage: 84.5 },
    { stage: 'Clicked', value: 7672, percentage: 18.2 },
    { stage: 'Converted', value: 916, percentage: 2.1 },
  ];

  const topPerformingTemplates = [
    { template: 'Quick Approval Home Loan', readRate: 92.2, clickRate: 24.5 },
    { template: 'EMI Reminder - Action Required', readRate: 88.8, clickRate: 21.2 },
    { template: 'Personal Loan Flash Sale', readRate: 85.9, clickRate: 19.8 },
    { template: 'Welcome Message - New User', readRate: 82.5, clickRate: 16.9 },
    { template: 'Credit Card Limit Increase', readRate: 79.1, clickRate: 14.6 },
  ];

  return (
    <div className="space-y-6">
        {/* Header with Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WhatsApp Performance</h1>
              <p className="text-sm text-gray-500 mt-1">Real-time WhatsApp broadcast analytics and engagement</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="24hours">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
              
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Broadcasts</option>
                <option value="home">Home Loan Broadcasts</option>
                <option value="personal">Personal Loan Broadcasts</option>
                <option value="credit">Credit Card Broadcasts</option>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Broadcast Engagement Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={2} name="Sent" />
              <Line type="monotone" dataKey="read" stroke="#10B981" strokeWidth={2} name="Read" />
              <Line type="monotone" dataKey="clicked" stroke="#F59E0B" strokeWidth={2} name="Clicked" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign Performance & Platform Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Broadcast Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="sent" fill="#3B82F6" name="Sent" />
                <Bar dataKey="read" fill="#10B981" name="Read" />
                <Bar dataKey="clicked" fill="#F59E0B" name="Clicked" />
                <Bar dataKey="converted" fill="#8B5CF6" name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {deviceBreakdown.map((device, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }}></div>
                    <span className="text-sm text-gray-600">{device.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{device.value}%</span>
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

        {/* Top Performing Message Templates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Message Templates</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Read Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate (CTR)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPerformingTemplates.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">{item.template}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.readRate}%</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.clickRate}%</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{ width: `${(item.readRate / 100) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{idx + 1}</span>
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

export default WhatsAppPerformance;