import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Archive,
  Loader2,
} from 'lucide-react';
import LeadDetailModal from './LeadDetailModal';
import ReactivationModal from './ReactivationModal';
import { ArchivedLeadService } from "../../../services/dataAndLeads.service";

const AllData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReactivationModal, setShowReactivationModal] = useState(false);
  const [leadToReactivate, setLeadToReactivate] = useState(null);

  const [archivedLeads, setArchivedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const archiveReasons = ['no_response', 'invalid', 'duplicate', 'not_interested'];
  const reasonLabels = {
    no_response: 'No Response',
    invalid: 'Invalid Lead',
    duplicate: 'Duplicate',
    not_interested: 'Not Interested',
  };

  const buildDateParams = () => {
    const now = new Date();
    if (dateRange === '30days') {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return { start_date: d.toISOString().split('T')[0], end_date: now.toISOString().split('T')[0] };
    }
    if (dateRange === '90days') {
      const d = new Date(now);
      d.setDate(d.getDate() - 90);
      return { start_date: d.toISOString().split('T')[0], end_date: now.toISOString().split('T')[0] };
    }
    if (dateRange === '180days') {
      const d = new Date(now);
      d.setDate(d.getDate() - 180);
      return { start_date: d.toISOString().split('T')[0], end_date: now.toISOString().split('T')[0] };
    }
    return {};
  };

  const normalise = (lead) => ({
    id: lead.id,
    _rawId: lead.id,
    name: lead.contact_name || lead.customer_name || '—',
    phone: lead.phone || '—',
    email: lead.email || '—',
    archivedDate: lead.archived_at ? lead.archived_at.split('T')[0] : '—',
    reason: reasonLabels[lead.archived_reason] || lead.archived_reason || '—',
    finalDisposition: lead.archived_notes || '—',
    leadAge: lead.lead_age || 0,
    archivedBy: lead.archived_by_name || (typeof lead.archived_by === 'object' ? lead.archived_by?.username : lead.archived_by) || '—',
    lastActivity: lead.last_activity || '—',
    source: lead.source || '—',
    product: lead.product_name || (typeof lead.product === 'object' ? lead.product?.name : lead.product) || '—',
    reactivationStatus: lead.is_reactivated || false,
    complianceFlag: lead.compliance_flag || 'Compliant',
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(selectedReason && { archive_reason: selectedReason }),
        ...buildDateParams(),
      };
      const res = await ArchivedLeadService.list(params);
      const data = res.data;
      const results = Array.isArray(data) ? data : data.results || [];
      setArchivedLeads(results.map(normalise));
      setTotalCount(Array.isArray(data) ? results.length : data.count || results.length);
    } catch (err) {
      console.error('Failed to fetch archived leads:', err);
      setError('Failed to load archived leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedReason, dateRange]);

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 400);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const handleViewDetails = async (lead) => {
    try {
      const res = await ArchivedLeadService.retrieve(lead._rawId);
      setSelectedLead(normalise(res.data));
    } catch {
      setSelectedLead(lead);
    }
    setShowDetailModal(true);
  };

  const handleReactivate = (lead) => {
    setLeadToReactivate(lead);
    setShowReactivationModal(true);
  };

  const handleReactivateConfirm = async () => {
    try {
      await ArchivedLeadService.reactivate(leadToReactivate._rawId);
      setShowReactivationModal(false);
      setLeadToReactivate(null);
      fetchLeads();
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Reactivation failed. You may not have the required permission.';
      alert(msg);
    }
  };

  const handleExport = async () => {
    try {
      const res = await ArchivedLeadService.export();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'archived_leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-900 mb-1">
              Complete Archive &amp; Audit Trail
            </h3>
            <p className="text-xs text-green-700">
              All archived leads are retained for 1 year minimum for regulatory compliance.
              Records are read-only and changes require manager authorization.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Reasons</option>
              {archiveReasons.map((r) => (
                <option key={r} value={r}>{reasonLabels[r]}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="180days">Last 6 Months</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{archivedLeads.length}</span> of{' '}
            <span className="font-semibold">{totalCount}</span> archived leads
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Lead ID', 'Name', 'Contact', 'Archived Date', 'Reason', 'Days Archived', 'Compliance', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {archivedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{lead.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>{lead.phone}</div>
                      <div className="text-xs text-gray-500">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>{lead.archivedDate}</div>
                      <div className="text-xs text-gray-500">by {lead.archivedBy}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        lead.reason === 'Invalid Lead' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {lead.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{lead.leadAge} days</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {lead.complianceFlag === 'Compliant' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Compliant
                        </span>
                      )}
                      {lead.complianceFlag === 'Flagged' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Flagged
                        </span>
                      )}
                      {lead.complianceFlag === 'Critical' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Critical
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(lead)}
                          className="p-1 text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {lead.complianceFlag !== 'Critical' && !lead.reactivationStatus && (
                          <button
                            onClick={() => handleReactivate(lead)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Reactivate Lead"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        {lead.reactivationStatus && (
                          <span className="text-xs text-green-600 font-medium">Reactivated</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && archivedLeads.length === 0 && (
          <div className="text-center py-12">
            <Archive className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No archived leads found matching your filters</p>
          </div>
        )}
      </div>

      {showDetailModal && selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => { setShowDetailModal(false); setSelectedLead(null); }}
        />
      )}
      {showReactivationModal && leadToReactivate && (
        <ReactivationModal
          lead={leadToReactivate}
          onClose={() => { setShowReactivationModal(false); setLeadToReactivate(null); }}
          onConfirm={handleReactivateConfirm}
        />
      )}
    </div>
  );
};

export default AllData;
