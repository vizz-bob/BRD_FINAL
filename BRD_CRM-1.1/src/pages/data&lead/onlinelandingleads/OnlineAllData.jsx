// OnlineAllData.jsx
import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Star, Phone, Mail, Calendar,
  CheckCircle, XCircle, Globe, TrendingUp, AlertCircle,
  MousePointer2, ShieldCheck, RefreshCw
} from 'lucide-react';
import { OnlineLeadService } from '../../../services/dataAndLeads.service';

const OnlineAllData = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', source: '', quality: '' });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status)  params.status  = filters.status;
      if (filters.quality) params.quality = filters.quality;
      if (filters.source)  params.source  = filters.source;
      params.page_size = 1000;
      const res = await OnlineLeadService.list(params);
      setLeads(res.data?.results ?? res.data ?? []);
    } catch (err) {
      console.error('Failed to load leads', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [filters.status, filters.quality, filters.source]);

  const filteredLeads = leads.filter(l => {
    if (!filters.search) return true;
    const s = filters.search.toLowerCase();
    return l.contact_name?.toLowerCase().includes(s) ||
           l.contact_phone?.includes(s) ||
           String(l.id).includes(s) ||
           l.online_lead_id?.toLowerCase().includes(s);
  });

  const getStatusColor = (s) => {
    const m = { RAW: 'bg-gray-100 text-gray-700', QUALIFIED: 'bg-indigo-100 text-indigo-700', HOT: 'bg-orange-100 text-orange-700' };
    return m[s] || 'bg-gray-100 text-gray-700';
  };

  const getQualityStars = (q) => ({ HIGH: 3, MEDIUM: 2, LOW: 1 }[q] || 0);
  const getQualityColor = (q) => {
    const m = { HIGH: 'bg-green-100 text-green-700', MEDIUM: 'bg-indigo-100 text-indigo-700', LOW: 'bg-red-100 text-red-700' };
    return m[q] || 'bg-gray-100 text-gray-700';
  };

  const clearFilters = () => {
    setFilters({ search: '', status: '', source: '', quality: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-300px)]">

      {/* LEFT: Filters */}
      <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          <button onClick={fetchLeads} className="text-xs text-indigo-600 flex items-center gap-1 hover:underline">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Lead</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="text" value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                placeholder="Name, phone, ID…"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lead Status</label>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none">
              <option value="">All Status</option>
              <option value="RAW">Raw</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="HOT">Hot</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marketing Channel</label>
            <select value={filters.source} onChange={e => setFilters({ ...filters, source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none">
              <option value="">All Channels</option>
              <option value="Google">Google Ads</option>
              <option value="Facebook">Facebook Ads</option>
              <option value="Instagram">Instagram</option>
              <option value="Website">Website</option>
              <option value="Direct">Direct</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Traffic Quality</label>
            <select value={filters.quality} onChange={e => setFilters({ ...filters, quality: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none">
              <option value="">All Quality</option>
              <option value="HIGH">High Intent</option>
              <option value="MEDIUM">Medium Intent</option>
              <option value="LOW">Low Intent</option>
            </select>
          </div>

          <button onClick={clearFilters} className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            Clear All Filters
          </button>
        </div>
      </div>

      {/* MIDDLE: Lead List */}
      <div className="lg:col-span-5 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-700">{filteredLeads.length} Online Leads</p>
          <Globe className="w-4 h-4 text-gray-400" />
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-full p-8 text-gray-400 text-sm">Loading…</div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No online leads found</p>
            </div>
          ) : filteredLeads.map(lead => {
            const isSelected = selectedLead?.id === lead.id;
            return (
              <button key={lead.id} onClick={() => setSelectedLead(lead)}
                className={`w-full p-4 text-left transition-all border-l-4 border-b border-gray-100 outline-none ${isSelected ? 'bg-indigo-50 border-l-indigo-600' : 'bg-white border-l-transparent hover:bg-gray-50'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className={`font-medium text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{lead.contact_name}</p>
                    <p className="text-xs text-indigo-600 font-medium flex items-center">
                      <MousePointer2 className="w-3 h-3 mr-1" />{lead.online_source}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.lead_status)}`}>
                    {lead.lead_status}
                  </span>
                </div>
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < getQualityStars(lead.lead_quality) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">Intent Score</span>
                </div>
                <p className="text-xs text-gray-600 truncate">{lead.product} • {lead.campaign_name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Detail */}
      <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
        {!selectedLead ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Globe className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-gray-500 text-sm">Select a lead to inspect</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center mb-6 pb-4 border-b border-gray-200">
              <div className="relative w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-4xl font-black text-white">{selectedLead.contact_name?.charAt(0)}</span>
                {selectedLead.consent_obtained && (
                  <div className="absolute -right-1 -top-1 bg-green-500 border-2 border-white rounded-full p-0.5">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{selectedLead.contact_name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(selectedLead.lead_status)}`}>
                  {selectedLead.lead_status}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getQualityColor(selectedLead.lead_quality)}`}>
                  {selectedLead.lead_quality} Quality
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${selectedLead.consent_obtained ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedLead.consent_obtained ? 'Consent ✓' : 'No Consent'}
                </span>
              </div>
            </div>

            {selectedLead.lead_form_url && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-5">
                <p className="text-xs font-medium text-indigo-700 mb-1">Landing Page</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{selectedLead.lead_form_url}</p>
              </div>
            )}

            <div className="space-y-3 mb-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{selectedLead.contact_phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 truncate">{selectedLead.contact_email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-5 pb-5 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Source:</span>
                <span className="font-medium">{selectedLead.online_source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Campaign:</span>
                <span className="font-medium truncate ml-4">{selectedLead.campaign_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Product:</span>
                <span className="font-medium">{selectedLead.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="font-medium">{selectedLead.created_at?.slice(0, 10)}</span>
              </div>
              {selectedLead.tags && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tags:</span>
                  <span className="font-medium">{selectedLead.tags}</span>
                </div>
              )}
            </div>

            {selectedLead.notes && (
              <div className="mb-5">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Notes</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-400">
                  {selectedLead.notes}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Verify & Qualify</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Hot Lead</span>
                </button>
                <button className="py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Callback</span>
                </button>
              </div>
              <button className="w-full py-2 border border-red-600 bg-red-600 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center space-x-2 text-sm">
                <XCircle className="w-4 h-4" />
                <span>Mark as Dead</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineAllData;