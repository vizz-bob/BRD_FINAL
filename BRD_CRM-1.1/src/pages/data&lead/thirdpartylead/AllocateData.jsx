// AllocateData.jsx – Allocate unassigned third-party leads (API-integrated)
import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, CheckSquare, Square, RefreshCw, AlertCircle } from 'lucide-react';
import { ThirdPartyLeadService } from '../../../services/dataAndLeads.service';
import axiosInstance from '../../../utils/axiosInstance';

// ─── helpers ──────────────────────────────────────────────────────────────────

const normalise = (lead) => ({
  id:      lead.id,
  name:    lead.contact_name,
  vendor:  lead.third_party_source,
  product: lead.product,
  quality: lead.lead_quality,   // HIGH | MEDIUM | LOW
});

const qualityStyle = (q = '') => {
  switch (q.toUpperCase()) {
    case 'HIGH':   return 'bg-green-100 text-green-700';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
    case 'LOW':    return 'bg-red-100 text-red-700';
    default:       return 'bg-gray-100 text-gray-600';
  }
};

// ─── component ────────────────────────────────────────────────────────────────

const AllocateData = ({ onAllocateSuccess }) => {
  const [leads, setLeads]           = useState([]);
  const [agents, setAgents]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [selectedLeads, setSelectedLeads] = useState([]);
  const [assignTo, setAssignTo]           = useState('');   // user id (string)
  const [product, setProduct]             = useState('');

  const products = [
    'Home Loan', 'Personal Loan', 'Car Loan', 'Business Loan', 'Credit Card',
  ];

  // ── fetch unassigned leads & agent list ────────────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Unassigned third-party leads
      const leadsRes = await ThirdPartyLeadService.unassigned();
      const raw = Array.isArray(leadsRes.data)
        ? leadsRes.data
        : leadsRes.data?.results ?? [];
      setLeads(raw.map(normalise));

      // Fetch users from Django auth – adjust endpoint if you have a /users/ route
      // Falls back to a static list if the endpoint isn't available
      try {
        const usersRes = await axiosInstance.get('/data_lead/users/');
        const usersRaw = Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data?.results ?? [];
        setAgents(usersRaw.map((u) => ({
          id:       u.id,
          username: u.username ?? u.first_name ?? `User ${u.id}`,
        })));
      } catch {
     
        setAgents([
          { id: 1, username: 'Agent 1' },
          { id: 2, username: 'Agent 2' },
          { id: 3, username: 'Agent 3' },
          { id: 4, username: 'Agent 4' },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── toggle lead selection ──────────────────────────────────────────────────

  const toggleLead = (id) =>
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelectedLeads(
      selectedLeads.length === leads.length ? [] : leads.map((l) => l.id)
    );

  // ── submit allocation ──────────────────────────────────────────────────────

  const handleAllocate = async () => {
    if (!selectedLeads.length || !assignTo) return;
    setSubmitting(true);
    try {
      await ThirdPartyLeadService.allocate({
        lead_ids: selectedLeads,
        user_id:  parseInt(assignTo, 10),
      });
      alert(`✅ ${selectedLeads.length} lead(s) allocated successfully!`);
      // Remove allocated leads from the local list
      setLeads((prev) => prev.filter((l) => !selectedLeads.includes(l.id)));
      setSelectedLeads([]);
      setAssignTo('');
      setProduct('');
      if (onAllocateSuccess) onAllocateSuccess();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : 'Failed to allocate leads. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Allocate Unassigned Leads
          </h2>
          <button
            onClick={fetchData}
            className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Assign To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select agent</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.username}</option>
              ))}
            </select>
          </div>

          {/* Product (optional filter / info) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Product
            </label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Products</option>
              {products.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Select-all row */}
        {!loading && !error && leads.length > 0 && (
          <div className="flex items-center justify-between mb-2 px-1">
            <button
              onClick={toggleAll}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              {selectedLeads.length === leads.length ? 'Deselect all' : 'Select all'}
            </button>
            <span className="text-xs text-gray-500">
              {leads.length} unassigned lead{leads.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Lead list */}
        {!loading && !error && (
          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-1">
            {leads.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No unassigned leads available
              </div>
            ) : (
              leads
                .filter((l) => !product || l.product === product)
                .map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => toggleLead(lead.id)}
                    className={`w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedLeads.includes(lead.id)
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {selectedLeads.includes(lead.id) ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400 shrink-0" />
                      )}
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500">
                          {lead.vendor} • {lead.product}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${qualityStyle(lead.quality)}`}>
                      {lead.quality?.toLowerCase()}
                    </span>
                  </button>
                ))
            )}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleAllocate}
          disabled={!selectedLeads.length || !assignTo || submitting}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
        >
          {submitting ? (
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>Allocate {selectedLeads.length} Lead(s)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AllocateData;
