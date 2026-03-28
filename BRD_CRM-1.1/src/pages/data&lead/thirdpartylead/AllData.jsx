// AllData.jsx - 3-Panel Quality Inspection Station (API-integrated)
import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Star, Phone, Mail, Calendar,
  User, CheckCircle, XCircle, Clock, TrendingUp, AlertCircle, RefreshCw
} from 'lucide-react';
import { ThirdPartyLeadService } from '../../../services/dataAndLeads.service';

// ─── constants ────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  RAW:       'bg-gray-100 text-gray-700',
  QUALIFIED: 'bg-indigo-100 text-indigo-700',
  HOT:       'bg-orange-100 text-orange-700',
  DEAD:      'bg-red-100 text-red-700',
  Converted: 'bg-green-100 text-green-700',
};

const QUALITY_STARS = { HIGH: 3, MEDIUM: 2, LOW: 1 };

// Map backend field names → display labels
const normalise = (lead) => ({
  id:            lead.id,
  displayId:     `TPL-${String(lead.id).padStart(3, '0')}`,
  name:          lead.contact_name,
  phone:         lead.contact_phone,
  email:         lead.contact_email,
  vendor:        lead.third_party_source,
  product:       lead.product,
  status:        lead.lead_status,          // RAW | QUALIFIED | HOT
  quality:       lead.lead_quality,         // HIGH | MEDIUM | LOW
  assignedTo:    lead.assigned_to ?? null,
  thirdPartyId:  lead.third_party_lead_id,
  consent:       lead.consent_obtained,
  createdDate:   lead.created_at?.slice(0, 10),
  followUpDate:  lead.follow_up_date?.slice(0, 10) ?? null,
  notes:         lead.notes,
  campaignName:  lead.campaign_name,
  tags:          lead.tags,
});

// ─── component ────────────────────────────────────────────────────────────────

const AllData = ({ onStatusChange }) => {
  const [leads, setLeads]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: '', status: 'all', vendor: 'all', quality: 'all',
  });

  // ── fetch ──────────────────────────────────────────────────────────────────

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ThirdPartyLeadService.list();
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results ?? [];
      setLeads(data.map(normalise));
    } catch (err) {
      console.error(err);
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // ── status update ──────────────────────────────────────────────────────────

  const updateStatus = async (newStatus) => {
    if (!selectedLead) return;
    setActionLoading(true);
    try {
      await ThirdPartyLeadService.updateStatus(selectedLead.id, {
        lead_status: newStatus,
      });
      // Refresh list and update selected
      const res   = await ThirdPartyLeadService.list();
      const data  = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      const normd = data.map(normalise);
      setLeads(normd);
      setSelectedLead(normd.find((l) => l.id === selectedLead.id) ?? null);
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error(err);
      alert(err.response?.data ? JSON.stringify(err.response.data) : 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── derived vendors list ───────────────────────────────────────────────────

  const vendors = [...new Set(leads.map((l) => l.vendor).filter(Boolean))];

  // ── client-side filtering ─────────────────────────────────────────────────

  const filteredLeads = leads.filter((lead) => {
    const q = filters.search.toLowerCase();
    const matchSearch =
      !q ||
      lead.name?.toLowerCase().includes(q) ||
      lead.phone?.includes(filters.search) ||
      lead.displayId?.toLowerCase().includes(q);
    const matchStatus  = filters.status  === 'all' || lead.status  === filters.status;
    const matchVendor  = filters.vendor  === 'all' || lead.vendor  === filters.vendor;
    const matchQuality = filters.quality === 'all' || lead.quality?.toLowerCase() === filters.quality;
    return matchSearch && matchStatus && matchVendor && matchQuality;
  });

  // ── helpers ────────────────────────────────────────────────────────────────

  const getStatusColor = (s) => STATUS_COLORS[s] || 'bg-gray-100 text-gray-700';
  const getQualityStars = (q) => QUALITY_STARS[q?.toUpperCase()] ?? 0;

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-300px)]">

      {/* ── LEFT: Filters ── */}
      <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          <button
            onClick={fetchLeads}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors"
            title="Refresh leads"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Name, phone, ID…"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lead Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="RAW">Raw</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="HOT">Hot</option>
            </select>
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Source</label>
            <select
              value={filters.vendor}
              onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Vendors</option>
              {vendors.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lead Quality</label>
            <select
              value={filters.quality}
              onChange={(e) => setFilters({ ...filters, quality: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Quality</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button
            onClick={() => setFilters({ search: '', status: 'all', vendor: 'all', quality: 'all' })}
            className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* ── MIDDLE: Lead List ── */}
      <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            {loading ? 'Loading…' : `${filteredLeads.length} leads found`}
          </p>
        </div>

        <div className="overflow-y-auto flex-1">
          {loading && (
            <div className="flex items-center justify-center h-full p-8">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
              <p className="text-red-600 text-sm mb-3">{error}</p>
              <button
                onClick={fetchLeads}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-gray-500">No leads match your filters</p>
            </div>
          )}

          {!loading && !error && (
            <div className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedLead?.id === lead.id
                      ? 'bg-indigo-50 border-l-4 border-indigo-600'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.vendor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < getQualityStars(lead.quality)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1 capitalize">
                      {lead.quality?.toLowerCase()} Quality
                    </span>
                  </div>

                  <p className="text-xs text-gray-600">{lead.product}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Detail Workbench ── */}
      <div className="lg:col-span-5 bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
        {!selectedLead ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <User className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-1">Select a lead from the list</p>
            <p className="text-sm text-gray-400">to view details and take action</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedLead.name}</h2>
                <p className="text-sm text-gray-500">ID: {selectedLead.displayId}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
                {selectedLead.status}
              </span>
            </div>

            {/* Quality */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Lead Quality</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < getQualityStars(selectedLead.quality)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className={`text-lg font-bold ${
                  selectedLead.quality === 'HIGH'   ? 'text-green-600' :
                  selectedLead.quality === 'MEDIUM' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {selectedLead.quality}
                </span>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900">Contact Information</h3>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-gray-700">{selectedLead.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-gray-700">{selectedLead.email}</span>
              </div>
              {selectedLead.assignedTo && (
                <div className="flex items-center space-x-3 text-sm">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700">
                    Assigned to: <strong>User #{selectedLead.assignedTo}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
              {[
                ['Vendor',          selectedLead.vendor],
                ['Product',         selectedLead.product],
                ['Campaign',        selectedLead.campaignName],
                ['Third Party ID',  selectedLead.thirdPartyId],
                ['Created',         selectedLead.createdDate],
                ['Follow-up',       selectedLead.followUpDate ?? '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%] truncate">{value}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-gray-500">Consent:</span>
                <span className={`font-medium ${selectedLead.consent ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedLead.consent ? 'Obtained ✓' : 'Not Obtained ✗'}
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedLead.notes && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedLead.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => updateStatus('QUALIFIED')}
                disabled={actionLoading || selectedLead.status === 'QUALIFIED'}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark as Qualified</span>
              </button>

              <button
                onClick={() => updateStatus('HOT')}
                disabled={actionLoading || selectedLead.status === 'HOT'}
                className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Mark as Hot</span>
              </button>

              <button
                onClick={() => updateStatus('RAW')}
                disabled={actionLoading || selectedLead.status === 'RAW'}
                className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Clock className="w-4 h-4" />
                <span>Mark as Raw</span>
              </button>

              {actionLoading && (
                <div className="flex justify-center py-2">
                  <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllData;
