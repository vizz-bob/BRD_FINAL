import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Search, AlertCircle, User, Loader2 } from 'lucide-react';
import { ArchivedLeadService } from "../../../services/dataAndLeads.service";


const AllocateData = () => {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const [archivedLeads, setArchivedLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allocating, setAllocating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const products = ['Personal Loan', 'Home Loan', 'Car Loan', 'Business Loan'];

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ArchivedLeadService.list({ search: searchTerm });
      const data = res.data;
      const results = Array.isArray(data) ? data : data.results || [];
      // Only show leads not yet allocated
      setArchivedLeads(results.filter((l) => !l.allocated_to));
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);


  useEffect(() => {
    const t = setTimeout(fetchLeads, 400);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  const handleSelectAll = () => {
    setSelectedLeads(
      selectedLeads.length === archivedLeads.length ? [] : archivedLeads.map((l) => l.id)
    );
  };

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAllocate = async () => {
    if (!selectedLeads.length) { alert('Please select at least one lead'); return; }
    if (!selectedUser) { alert('Please select a user to allocate'); return; }

    setAllocating(true);
    setError('');
    setSuccessMsg('');
    try {
      await ArchivedLeadService.allocate({
        lead_ids: selectedLeads,
        user_id: isNaN(Number(selectedUser)) ? selectedUser : Number(selectedUser),
      });
      setSuccessMsg(`${selectedLeads.length} lead(s) allocated successfully.`);
      setSelectedLeads([]);
      setSelectedUser('');
      setSelectedProduct('');
      fetchLeads();
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Allocation failed.');
    } finally {
      setAllocating(false);
    }
  };

  const staticUsers = [{ id: 1, label: 'sakshijagtap' }];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-1">Allocation for Re-marketing</h3>
            <p className="text-xs text-amber-700">
              Select archived leads to allocate for reactivation campaigns. Requires manager
              approval for leads marked as "Fraud" or "Invalid Data".
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">{successMsg}</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Allocation Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign To User</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select User</option>
                <option value="1">sakshijagtap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Product</option>
              {products.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAllocate}
              disabled={!selectedLeads.length || allocating}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {allocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>Allocate Selected ({selectedLeads.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={archivedLeads.length > 0 && selectedLeads.length === archivedLeads.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                    />
                  </th>
                  {['Lead ID', 'Name', 'Contact', 'Archived Date', 'Reason', 'Days Archived'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {archivedLeads.map((lead) => {
                  const daysArchived = lead.archived_at
                    ? Math.floor((Date.now() - new Date(lead.archived_at)) / 86400000)
                    : 0;
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                          className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {lead.contact_name || lead.customer_name || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>{lead.phone || '—'}</div>
                        <div className="text-xs text-gray-500">{lead.email || '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {lead.archived_at ? lead.archived_at.split('T')[0] : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {lead.archived_reason || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{daysArchived} days</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && archivedLeads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No unallocated archived leads found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocateData;
