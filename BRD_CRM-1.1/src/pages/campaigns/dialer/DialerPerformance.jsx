import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Phone, PhoneCall, PhoneIncoming, Users, Calendar, Filter, Clock } from 'lucide-react';

const DialerPerformance = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  // Overview Stats
  const overviewStats = [
    { label: 'Total Calls', value: '24,156', change: '+12.5%', trend: 'up', icon: Phone, color: 'indigo' },
    { label: 'Connected', value: '23,842', change: '+11.8%', trend: 'up', icon: PhoneIncoming, color: 'green' },
    { label: 'Answer Rate', value: '24.5%', change: '+2.3%', trend: 'up', icon: PhoneCall, color: 'purple' },
    { label: 'Avg Talk Time', value: '4m 12s', change: '-15s', trend: 'down', icon: Clock, color: 'orange' },
  ];

  const campaignPerformance = [
    { name: 'Home Loan Q1', total: 5200, connected: 1456, talkTime: 423, converted: 89 },
    { name: 'Personal Loan', total: 4800, connected: 1248, talkTime: 387, converted: 72 },
    { name: 'Credit Card Promo', total: 6100, connected: 1647, talkTime: 512, converted: 103 },
    { name: 'Refinance Offer', total: 3900, connected: 1053, talkTime: 298, converted: 58 },
    { name: 'Educational Loan', total: 4156, connected: 1438, talkTime: 445, converted: 94 },
  ];

  const timeSeriesData = [
    { date: 'Mon', total: 3420, connected: 856, talkTime: 267 },
    { date: 'Tue', total: 3680, connected: 912, talkTime: 289 },
    { date: 'Wed', total: 3240, connected: 798, talkTime: 245 },
    { date: 'Thu', total: 4120, connected: 1043, talkTime: 321 },
    { date: 'Fri', total: 3890, connected: 967, talkTime: 298 },
    { date: 'Sat', total: 2650, connected: 623, talkTime: 178 },
    { date: 'Sun', total: 2156, connected: 543, talkTime: 156 },
  ];

  const callOutcomeBreakdown = [
    { name: 'Connected', value: 42, color: '#10B981' },
    { name: 'No Answer', value: 38, color: '#3B82F6' },
    { name: 'Busy/Failed', value: 20, color: '#F59E0B' },
  ];

  const callFunnel = [
    { stage: 'Total Dialed', value: 24156, percentage: 100 },
    { stage: 'Connected', value: 23842, percentage: 98.7 },
    { stage: 'Spoke with Lead', value: 5918, percentage: 24.5 },
    { stage: 'Qualified', value: 1980, percentage: 8.2 },
    { stage: 'Converted', value: 416, percentage: 1.7 },
  ];

  const topAgentTeams = [
    { team: 'Team Alpha - Mortgage Specialists', answerRate: 34.2, avgTalk: 12.5 },
    { team: 'Team Beta - Loan Processing', answerRate: 31.8, avgTalk: 11.2 },
    { team: 'External Agency - Outbound', answerRate: 28.9, avgTalk: 9.8 },
    { team: 'Internal Sales - Tier 1', answerRate: 26.5, avgTalk: 8.9 },
    { team: 'Retention Specialists', answerRate: 24.1, avgTalk: 7.6 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dialer Performance Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time outbound call analytics and agent metrics</p>
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
            </select>
            
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Dialer Campaigns</option>
              <option value="mortgage">Mortgage Campaigns</option>
              <option value="auto">Auto Loan Campaigns</option>
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

      {/* Call Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Call Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} name="Total Dials" />
            <Line type="monotone" dataKey="connected" stroke="#10B981" strokeWidth={2} name="Connected" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign Comparison & Outcome Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Conversion Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="total" fill="#3B82F6" name="Total Calls" />
              <Bar dataKey="connected" fill="#10B981" name="Connected" />
              <Bar dataKey="converted" fill="#8B5CF6" name="Converted" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Outcome Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={callOutcomeBreakdown}
                cx="50%" cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                dataKey="value"
              >
                {callOutcomeBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {callOutcomeBreakdown.map((outcome, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: outcome.color }}></div>
                  <span className="text-sm text-gray-600">{outcome.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{outcome.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call Funnel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Engagement Funnel</h2>
        <div className="space-y-3">
          {callFunnel.map((stage, idx) => (
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

      {/* Agent Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Agent Teams</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Team</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topAgentTeams.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.team}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{item.answerRate}%</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{item.avgTalk}%</td>
                  <td className="px-4 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(item.answerRate / 40) * 100}%` }}
                      ></div>
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

export default DialerPerformance;