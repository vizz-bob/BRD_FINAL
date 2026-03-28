import React, { useEffect, useState } from 'react';
import {
  Search, Download, Eye, Calendar, Phone, Mic, TrendingUp,
  CheckCircle, XCircle, Clock, PhoneCall, Volume2
} from 'lucide-react';
import { voiceCampaignService } from '../../../services/campaignService';

const VoiceHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapStatus = (status) => {
    const map = {
      draft: 'Draft',
      active: 'In Progress',
      scheduled: 'In Progress',
      in_progress: 'In Progress',
      completed: 'Completed',
    };
    return map[status] || 'Draft';
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const res = await voiceCampaignService.getAll();
        const mapped = res.data.map((c) => ({
          id: c.id,
          title: c.campaign_title,
          product: (c.product || '').replace(/_/g, ' ').toUpperCase(),
          status: mapStatus(c.status),
          targetAudience: Array.isArray(c.target_audience)
            ? c.target_audience
            : c.target_audience
            ? c.target_audience.split(',').map((s) => s.trim())
            : [],
          audioScript: c.audio_file ? c.audio_file.split('/').pop() : 'TTS Audio',
          sentDate: c.created_at,
          // Not in model — all null → N/A
          totalCalls: null,
          answered: null,
          keypadResponses: null,
          converted: null,
          answerRate: null,
          keypadRate: null,
          avgDuration: 'N/A',
          callerId: 'N/A',
        }));
        setCampaigns(mapped);
      } catch (err) {
        console.error('Voice History API error', err);
        setError('Failed to load campaigns.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(campaign.id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || campaign.status === statusFilter;
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const daysAgo = Math.floor(
        (Date.now() - new Date(campaign.sentDate)) / (1000 * 60 * 60 * 24)
      );
      if (dateFilter === '7days') matchesDate = daysAgo <= 7;
      if (dateFilter === '30days') matchesDate = daysAgo <= 30;
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const config = {
      Completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'In Progress': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: Clock },
      Failed: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      Draft: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock },
    };
    const c = config[status] || config['Draft'];
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </span>
    );
  };

  const na = <span className="text-gray-400 text-sm">N/A</span>;

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading campaigns...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Broadcast History</h1>
            <p className="text-sm text-gray-500 mt-1">View and analyze past voice campaigns</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search broadcasts..."
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
            <option value="Draft">Draft</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg"><Phone className="w-5 h-5 text-indigo-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Total Campaigns</p>
              <p className="text-xl font-bold text-gray-900">{filteredCampaigns.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg"><PhoneCall className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Total Answered</p>
              <p className="text-xl font-bold text-gray-400">N/A</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Mic className="w-5 h-5 text-purple-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Avg Keypad Rate</p>
              <p className="text-xl font-bold text-gray-400">N/A</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg"><TrendingUp className="w-5 h-5 text-orange-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Total Conversions</p>
              <p className="text-xl font-bold text-gray-400">N/A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Broadcast', 'Date', 'Calls', 'Answer Rate', 'Keypad', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCampaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  No campaigns found.
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{c.title}</p>
                    <p className="text-xs text-gray-500">#{c.id} • {c.product}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {c.sentDate ? new Date(c.sentDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{na}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{na}</td>
                  <td className="px-6 py-4 text-sm">{na}</td>
                  <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedCampaign(c)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCampaign.title}</h2>
                <p className="text-sm text-gray-500">#{selectedCampaign.id}</p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Campaign Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Product</p>
                  <p className="text-sm font-medium">{selectedCampaign.product}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedCampaign.status)}</div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Audio Script</p>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-500" />
                    {selectedCampaign.audioScript}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Caller ID</p>
                  <p className="text-sm font-medium">{selectedCampaign.callerId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Avg Call Duration</p>
                  <p className="text-sm font-medium">{selectedCampaign.avgDuration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Date Created</p>
                  <p className="text-sm font-medium">
                    {selectedCampaign.sentDate
                      ? new Date(selectedCampaign.sentDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Call Funnel — all N/A */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Call Funnel</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Total Dials', 'Answered', 'Keypad (IVR)', 'Conv. Rate'].map((label) => (
                    <div key={label} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600">{label}</p>
                      <p className="text-xl font-bold text-gray-400">N/A</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Segments */}
              {selectedCampaign.targetAudience?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Target Segments</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.targetAudience.map((audience, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full capitalize"
                      >
                        {audience.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceHistory;
