import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Phone, PhoneCall, PhoneForwarded, Users, Calendar, Filter, Mic, Clock, Volume2 } from 'lucide-react';

const VoicePerformance = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  // Answer Rate, Keypad
  const overviewStats = [
    { label: 'Total Calls', value: '18,240', change: '+14.2%', trend: 'up', icon: Phone, color: 'indigo' },
    { label: 'Answered', value: '12,456', change: '+10.5%', trend: 'up', icon: PhoneCall, color: 'green' },
    { label: 'Answer Rate', value: '68.3%', change: '+5.1%', trend: 'up', icon: PhoneForwarded, color: 'purple' },
    { label: 'Keypad Responses', value: '12.4%', change: '-0.8%', trend: 'down', icon: Mic, color: 'orange' },
  ];

  const campaignPerformance = [
    { name: 'Home Loan Q1', calls: 5200, answered: 3850, keypad: 423, converted: 89 },
    { name: 'Personal Loan', calls: 4800, answered: 3248, keypad: 387, converted: 72 },
    { name: 'Credit Card Promo', calls: 6100, answered: 4647, keypad: 512, converted: 103 },
    { name: 'Refinance Offer', calls: 3900, answered: 2853, keypad: 298, converted: 58 },
    { name: 'Educational Loan', calls: 4156, answered: 3438, keypad: 445, converted: 94 },
  ];

  const timeSeriesData = [
    { date: 'Mon', calls: 2420, answered: 1656, keypad: 267 },
    { date: 'Tue', calls: 2680, answered: 1912, keypad: 289 },
    { date: 'Wed', calls: 2240, answered: 1598, keypad: 245 },
    { date: 'Thu', calls: 3120, answered: 2043, keypad: 321 },
    { date: 'Fri', calls: 2890, answered: 1967, keypad: 298 },
    { date: 'Sat', calls: 1650, answered: 1123, keypad: 178 },
    { date: 'Sun', calls: 1156, answered: 843, keypad: 156 },
  ];

  const callDurationBreakdown = [
    { name: '< 15s', value: 15, color: '#EF4444' }, // Short/Dropped
    { name: '15s - 45s', value: 45, color: '#3B82F6' }, // Engaged
    { name: '45s+', value: 40, color: '#10B981' }, // High Interest
  ];

  const engagementFunnel = [
    { stage: 'Calls Dialed', value: 18240, percentage: 100 },
    { stage: 'Connected', value: 14842, percentage: 81.3 },
    { stage: 'Answered', value: 12456, percentage: 68.3 },
    { stage: 'Keypad (IVR)', value: 2260, percentage: 12.4 },
    { stage: 'Converted', value: 310, percentage: 1.7 },
  ];

  const topPerformingAudio = [
    { script: 'Professional Male - Loan Promo', answerRate: 74.2, keypadRate: 15.5 },
    { script: 'Urgent Reminder - AI Female', answerRate: 71.8, keypadRate: 12.2 },
    { script: 'Personalized Greeting Script', answerRate: 68.9, keypadRate: 10.8 },
    { script: 'Short 15s Flash Sale', answerRate: 64.5, keypadRate: 9.2 },
    { script: 'Standard Corporate Recording', answerRate: 59.1, keypadRate: 7.6 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Voice Performance</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time call analytics and IVR engagement</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
            <select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Voice Broadcasts</option>
              <option value="home">Home Loan</option>
              <option value="personal">Personal Loan</option>
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

      {/* Call Engagement Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Answer Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} name="Calls Dialed" />
            <Line type="monotone" dataKey="answered" stroke="#10B981" strokeWidth={2} name="Answered" />
            <Line type="monotone" dataKey="keypad" stroke="#F59E0B" strokeWidth={2} name="Keypad Responses" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign Comparison & Duration Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Broadcast Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="calls" fill="#3B82F6" name="Total Calls" />
              <Bar dataKey="answered" fill="#10B981" name="Answered" />
              <Bar dataKey="keypad" fill="#F59E0B" name="Keypad" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Duration</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={callDurationBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {callDurationBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {callDurationBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Engagement Funnel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Funnel</h2>
        <div className="space-y-4">
          {engagementFunnel.map((stage, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                <span className="text-sm text-gray-500">{stage.value.toLocaleString()} ({stage.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-indigo-600 h-3 rounded-full transition-all duration-700" style={{ width: `${stage.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Audio Scripts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Audio Content</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audio Script / Recording</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answer Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keypad Response</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strength</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topPerformingAudio.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-500" /> {item.script}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{item.answerRate}%</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{item.keypadRate}%</td>
                  <td className="px-4 py-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${item.answerRate}%` }} />
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

export default VoicePerformance;