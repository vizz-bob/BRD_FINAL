import React, { useState, useEffect } from 'react';
import { 
  Search, Download, Eye, Calendar, Phone, Clock, 
  TrendingUp, CheckCircle, XCircle, PhoneCall,
  PhoneMissed, PhoneOff, AlertCircle
} from 'lucide-react';
import { dialerCampaignService } from '../../../services/campaignService';

const DialerHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedCall, setSelectedCall] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await dialerCampaignService.getAll();
        setCampaigns(res.data);
      } catch (err) {
        setError('Failed to load campaigns.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Normalize backend data — fill missing fields with N/A sentinel
  const normalize = (c) => ({
    id: c.id,
    campaignName: c.campaign_title,
    product: c.product,
    launchDate: c.created_at,
    status: c.status.charAt(0).toUpperCase() + c.status.slice(1), // "draft" → "Draft"
    targetAudience: Array.isArray(c.target_audience)
  ? c.target_audience
  : c.target_audience
  ? c.target_audience.split(',').map(s => s.trim())
  : [],
    dialer_type: c.dialer_type,
    timing: c.timing,
    // Fields not in model — N/A
    totalCalls: null,
    connected: null,
    noAnswer: null,
    busy: null,
    connectRate: null,
    avgDuration: null,
    conversions: null,
    conversionRate: null,
    agentCount: null,
  });

  const normalizedCampaigns = campaigns.map(normalize);

  // Filters
  const filteredCampaigns = normalizedCampaigns.filter(campaign => {
    const matchesSearch =
      campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(campaign.id).includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' ||
      campaign.status.toLowerCase() === statusFilter.toLowerCase();

    let matchesDate = true;
    if (dateFilter !== 'all' && campaign.launchDate) {
      const campaignDate = new Date(campaign.launchDate);
      const daysAgo = Math.floor((Date.now() - campaignDate) / (1000 * 60 * 60 * 24));
      if (dateFilter === '7days') matchesDate = daysAgo <= 7;
      else if (dateFilter === '30days') matchesDate = daysAgo <= 30;
      else if (dateFilter === '90days') matchesDate = daysAgo <= 90;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const na = <span className="text-gray-400 text-sm">N/A</span>;

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Draft':     { bg: 'bg-gray-100',   text: 'text-gray-800',   icon: Clock },
      'Scheduled': { bg: 'bg-blue-100',   text: 'text-blue-800',   icon: Calendar },
      'Active':    { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: Clock },
      'Completed': { bg: 'bg-green-100',  text: 'text-green-800',  icon: CheckCircle },
      'Paused':    { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      'Failed':    { bg: 'bg-red-100',    text: 'text-red-800',    icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig['Draft'];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Loading campaigns...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dialer Campaign History</h1>
            <p className="text-sm text-gray-500 mt-1">View and analyze past dialer campaigns</p>
          </div>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Campaigns', value: filteredCampaigns.length, icon: Phone, color: 'indigo' },
          { label: 'Total Calls', value: 'N/A', icon: PhoneCall, color: 'green' },
          { label: 'Avg Connect Rate', value: 'N/A', icon: TrendingUp, color: 'purple' },
          { label: 'Total Conversions', value: 'N/A', icon: CheckCircle, color: 'orange' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-${color}-100 rounded-lg`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Campaign', 'Date', 'Dialer Type', 'Total Calls', 'Connect Rate', 'Avg Duration', 'Conversions', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400">No campaigns found.</td>
                </tr>
              ) : filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{campaign.campaignName}</p>
                    <p className="text-xs text-gray-500">#{campaign.id} • {campaign.product}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{campaign.launchDate ? new Date(campaign.launchDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {campaign.dialer_type || na}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{na}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{na}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{na}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{na}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(campaign.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedCall(campaign)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCall.campaignName}</h2>
                <p className="text-sm text-gray-500 mt-1">#{selectedCall.id} • {selectedCall.product}</p>
              </div>
              <button onClick={() => setSelectedCall(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Overview */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Campaign Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Launch Date', value: selectedCall.launchDate ? new Date(selectedCall.launchDate).toLocaleDateString() : 'N/A' },
                    { label: 'Dialer Type', value: selectedCall.dialer_type || 'N/A' },
                    { label: 'Timing', value: selectedCall.timing || 'N/A' },
                    { label: 'Status', value: getStatusBadge(selectedCall.status) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-500">{label}</p>
                      <div className="text-sm font-medium text-gray-900 mt-1">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call Performance — all N/A */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Call Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Total Calls', 'Connected', 'No Answer', 'Conversions'].map(label => (
                    <div key={label} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="text-2xl font-bold text-gray-400">N/A</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              {selectedCall.targetAudience?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Target Audience</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCall.targetAudience.map((audience, idx) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full capitalize">
                        {audience.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Call Logs */}
              <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-400">
                Call logs not available — no call log model exists yet.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialerHistory;
