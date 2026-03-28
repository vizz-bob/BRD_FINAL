import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Star, Phone, Mail, Calendar, User,
  CheckCircle, XCircle, Users, TrendingUp, AlertCircle,
  Award, UserCheck, RefreshCw
} from 'lucide-react';
import { InternalLeadService } from '../../../services/dataAndLeads.service';

const InternalAllData = () => {
  const [leads,        setLeads]        = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading,      setLoading]      = useState(true);

  const [filters, setFilters] = useState({
    search: '', status: '', source: '', quality: ''
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status)  params.status  = filters.status;
      if (filters.source)  params.source  = filters.source;
      if (filters.quality) params.quality = filters.quality;

      const res = await InternalLeadService.list({ page_size: 1000, ...params });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Client-side search filter
  useEffect(() => {
    if (!filters.search.trim()) {
      setFiltered(leads);
      return;
    }
    const q = filters.search.toLowerCase();
    setFiltered(leads.filter(l =>
      l.contact_name?.toLowerCase().includes(q) ||
      l.contact_phone?.includes(q) ||
      l.contact_email?.toLowerCase().includes(q) ||
      String(l.id).includes(q) ||
      l.internal_lead_id?.toLowerCase().includes(q)
    ));
    setSelectedLead(null);
  }, [filters.search, leads]);

  // Re-fetch when dropdown filters change
  useEffect(() => { fetchLeads(); }, [filters.status, filters.source, filters.quality]);

  const statusColor = (s) => ({
    RAW:       'bg-gray-100 text-gray-700',
    QUALIFIED: 'bg-indigo-100 text-indigo-700',
    HOT:       'bg-orange-100 text-orange-700',
  }[s] || 'bg-gray-100 text-gray-700');

  const qualityColor = (q) => ({
    HIGH:   'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    LOW:    'bg-red-100 text-red-700',
  }[q] || 'bg-gray-100 text-gray-700');

  const qualityStars = (q) => ({ HIGH: 3, MEDIUM: 2, LOW: 1 }[q] || 0);

  const clearFilters = () => setFilters({ search: '', status: '', source: '', quality: '' });
  const hasFilters = filters.search || filters.status || filters.source || filters.quality;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-300px)]">

      {/* LEFT: Filters */}
      <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          <button onClick={fetchLeads} className="text-indigo-600 hover:text-indigo-700">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="text" value={filters.search}
                onChange={e => setFilters(f => ({...f, search: e.target.value}))}
                placeholder="Name, phone, ID…"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          {[
            {
              label: 'Lead Status', key: 'status',
              options: [{ v: 'RAW', l: 'Raw' }, { v: 'QUALIFIED', l: 'Qualified' }, { v: 'HOT', l: 'Hot' }]
            },
            {
              label: 'Internal Source', key: 'source',
              options: [
                { v: 'Employee Referral', l: 'Employee Referral' },
                { v: 'Internal Inquiry',  l: 'Internal Inquiry'  },
                { v: 'Internal Campaign', l: 'Internal Campaign' },
              ]
            },
            {
              label: 'Lead Quality', key: 'quality',
              options: [{ v: 'HIGH', l: 'High' }, { v: 'MEDIUM', l: 'Medium' }, { v: 'LOW', l: 'Low' }]
            },
          ].map(({ label, key, options }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <select value={filters[key]} onChange={e => setFilters(f => ({...f, [key]: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All</option>
                {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}

          {hasFilters && (
            <button onClick={clearFilters} className="w-full py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* MIDDLE: Lead list */}
      <div className="lg:col-span-5 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center text-sm font-medium text-gray-700">
          <span>{loading ? 'Loading…' : `${filtered.length} leads`}</span>
          <Users className="w-4 h-4 text-gray-400" />
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {loading ? (
            <div className="p-10 text-center text-gray-400 text-sm">Loading internal leads…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              No leads match your filters.
            </div>
          ) : filtered.map(lead => (
            <button key={lead.id} onClick={() => setSelectedLead(lead)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-l-4 ${
                selectedLead?.id === lead.id ? 'bg-indigo-50 border-l-indigo-600' : 'border-l-transparent'
              }`}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-medium text-sm text-gray-900">{lead.contact_name}</p>
                  <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> {lead.internal_source}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(lead.lead_status)}`}>
                  {lead.lead_status}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < qualityStars(lead.lead_quality) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
                <span className="text-xs text-gray-500 ml-1">{lead.lead_quality || '—'}</span>
              </div>
              <p className="text-xs text-gray-400">{lead.product} • #{lead.id}</p>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Detail panel */}
      <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
        {!selectedLead ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Users className="w-16 h-16 text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">Select a lead to view details</p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="text-center pb-4 border-b">
              <div className="relative w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-3xl font-black text-white">{selectedLead.contact_name?.charAt(0)}</span>
                {selectedLead.consent_obtained && (
                  <div className="absolute -right-1 -top-1 bg-green-500 border-2 border-white rounded-full p-0.5">
                    <UserCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{selectedLead.contact_name}</h2>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(selectedLead.lead_status)}`}>
                  {selectedLead.lead_status}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${qualityColor(selectedLead.lead_quality)}`}>
                  {selectedLead.lead_quality} Quality
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  selectedLead.consent_obtained ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {selectedLead.consent_obtained ? '✓ Consent' : '✗ No Consent'}
                </span>
              </div>
            </div>

            {/* Source box */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <p className="text-xs font-medium text-indigo-700 mb-1">Internal Source</p>
              <p className="text-sm font-semibold text-gray-900">{selectedLead.internal_source}</p>
              {selectedLead.campaign_name && (
                <p className="text-xs text-gray-500 mt-1">Campaign: {selectedLead.campaign_name}</p>
              )}
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" /> {selectedLead.contact_phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" /> {selectedLead.contact_email}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm border-t pt-4">
              {[
                ['Product', selectedLead.product],
                ['Internal Lead ID', selectedLead.internal_lead_id],
                ['Assigned To', selectedLead.assigned_to_name || (selectedLead.assigned_to ? `User #${selectedLead.assigned_to}` : '—')],
                ['Upload Method', selectedLead.Upload_method],
                ['Created', selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleDateString() : '—'],
                ['Follow-up', selectedLead.follow_up_date ? new Date(selectedLead.follow_up_date).toLocaleString() : '—'],
                ['Tags', selectedLead.tags || '—'],
              ].map(([label, value]) => value && value !== '—' ? (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-medium text-right max-w-[60%]">{value}</span>
                </div>
              ) : null)}
            </div>

            {/* Notes */}
            {selectedLead.notes && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Notes</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-400">
                  {selectedLead.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t">
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4" /> Verify & Qualify
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 flex items-center justify-center gap-1 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" /> Mark Hot
                </button>
                <button className="py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center justify-center gap-1 text-sm font-medium">
                  <Calendar className="w-4 h-4" /> Callback
                </button>
              </div>
              <button className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm">
                <XCircle className="w-4 h-4" /> Mark as Dead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalAllData;
