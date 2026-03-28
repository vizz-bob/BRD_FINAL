import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, MessageSquare, MousePointer, CheckCheck, Users, Calendar, Filter } from 'lucide-react';

const SMSPerformance = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  // Sample data
  const overviewStats = [
    { label: 'Total SMS Sent', value: '24,156', change: '+12.5%', trend: 'up', icon: MessageSquare, color: 'indigo' },
    { label: 'Delivered', value: '23,842', change: '+11.8%', trend: 'up', icon: Users, color: 'green' },
    { label: 'Delivery Rate', value: '98.7%', change: '+0.3%', trend: 'up', icon: CheckCheck, color: 'purple' },
    { label: 'Click Rate', value: '8.2%', change: '-0.5%', trend: 'down', icon: MousePointer, color: 'orange' },
  ];

  const campaignPerformance = [
    { name: 'SMS Home Loan', sent: 5200, opened: 1456, clicked: 423, converted: 89 },
    { name: 'SMS Personal', sent: 4800, opened: 1248, clicked: 387, converted: 72 },
    { name: 'Credit Promo', sent: 6100, opened: 1647, clicked: 512, converted: 103 },
    { name: 'Refinance SMS', sent: 3900, opened: 1053, clicked: 298, converted: 58 },
    { name: 'Education SMS', sent: 4156, opened: 1438, clicked: 445, converted: 94 },
  ];

  const timeSeriesData = [
    { date: 'Mon', sent: 3420, opened: 856, clicked: 267 },
    { date: 'Tue', sent: 3680, opened: 912, clicked: 289 },
    { date: 'Wed', sent: 3240, opened: 798, clicked: 245 },
    { date: 'Thu', sent: 4120, opened: 1043, clicked: 321 },
    { date: 'Fri', sent: 3890, opened: 967, clicked: 298 },
    { date: 'Sat', sent: 2650, opened: 623, clicked: 178 },
    { date: 'Sun', sent: 2156, opened: 543, clicked: 156 },
  ];

  const deviceBreakdown = [
    { name: 'iPhone', value: 55, color: '#3B82F6' },
    { name: 'Android', value: 40, color: '#10B981' },
    { name: 'Other', value: 5, color: '#F59E0B' },
  ];

  const engagementFunnel = [
    { stage: 'Sent', value: 24156, percentage: 100 },
    { stage: 'Delivered', value: 23842, percentage: 98.7 },
    { stage: 'Read/Received', value: 5918, percentage: 24.5 },
    { stage: 'Clicked', value: 1980, percentage: 8.2 },
    { stage: 'Converted', value: 416, percentage: 1.7 },
  ];

  const topPerformingMessages = [
    { body: 'Hi {{name}}, your pre-approved loan is ready!', openRate: 34.2, clickRate: 12.5 },
    { body: 'Update: Your loan application status has changed.', openRate: 31.8, clickRate: 11.2 },
    { body: 'Lower your EMI today. Check your new rate here.', openRate: 28.9, clickRate: 9.8 },
    { body: 'Flash Sale: 0% Processing fee for 48 hours!', openRate: 26.5, clickRate: 8.9 },
    { body: 'Finish your application for instant approval.', openRate: 24.1, clickRate: 7.6 },
  ];

  return (
    <div className="space-y-6">
        {/* Header with Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SMS Campaign Performance</h1>
              <p className="text-sm text-gray-500 mt-1">Real-time SMS analytics and delivery metrics</p>
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
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All SMS Campaigns</option>
                <option value="home">Home Loan SMS</option>
                <option value="personal">Personal Loan SMS</option>
                <option value="credit">Credit Card SMS</option>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SMS Engagement Trend</h2>
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
              <Line type="monotone" dataKey="opened" stroke="#10B981" strokeWidth={2} name="Delivered/Read" />
              <Line type="monotone" dataKey="clicked" stroke="#F59E0B" strokeWidth={2} name="Clicked" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign Performance & Device Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SMS Campaign Comparison</h2>
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
                <Bar dataKey="opened" fill="#10B981" name="Delivered" />
                <Bar dataKey="clicked" fill="#F59E0B" name="Clicked" />
                <Bar dataKey="converted" fill="#8B5CF6" name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">OS Breakdown</h2>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SMS Engagement Funnel</h2>
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

        {/* Top Performing SMS Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Message Content</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message Body</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPerformingMessages.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">{item.body}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.openRate}%</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.clickRate}%</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(item.openRate / 40) * 100}%` }}
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

export default SMSPerformance;