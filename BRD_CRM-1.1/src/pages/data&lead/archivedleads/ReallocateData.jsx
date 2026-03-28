import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw, Search, Filter, ArrowRight,
  AlertCircle, User, CheckCircle, Loader2,
} from 'lucide-react';
import { ArchivedLeadService } from "../../../services/dataAndLeads.service";


const ReallocateData = () => {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState('');
  const [filterByUser, setFilterByUser] = useState('');
  const [reason, setReason] = useState('');

  const [allocatedLeads, setAllocatedLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reallocating, setReallocating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(filterByUser && { assigned_to: filterByUser }),
      };
      const res = await ArchivedLeadService.list(params);
      const data = res.data;
      const results = Array.isArray(data) ? data : data.results || [];
      // Only show leads that have been allocated
      setAllocatedLeads(results.filter((l) => l.allocated_to !== null && l.allocated_to !== undefined));
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterByUser]);


  useEffect(() => {
    const t = setTimeout(fetchLeads, 400);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  const handleSelectAll = () => {
    setSelectedLeads(
      selectedLeads.length === allocatedLeads.length ? [] : allocatedLeads.map((l) => l.id)
    );
  };

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleReallocate = async () => {
    if (!selectedLeads.length) { alert('Please select at least one lead'); return; }
    if (!newUser) { alert('Please select a new user'); return; }
    if (!reason.trim()) { alert('Please enter a reason for reallocation'); return; }

    setReallocating(true);
    setError('');
    setSuccessMsg('');
    try {
      await Promise.all(
        selectedLeads.map((id) =>
          ArchivedLeadService.reallocate(id, {
            user_id: isNaN(Number(newUser)) ? newUser : Number(newUser),
            reason,
          })
        )
      );
      setSuccessMsg(`${selectedLeads.length} lead(s) reallocated successfully.`);
      setSelectedLeads([]);
      setNewUser('');
      setReason('');
      fetchLeads();
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Reallocation failed.');
    } finally {
      setReallocating(false);
    }
  };

  const getUserLabel = (u) => {
    if (!u) return '—';
    if (typeof u === 'object') {
      if (u.label) return u.label;
      if (u.username) return u.username;
      if (u.first_name) return `${u.first_name} ${u.last_name}`.trim();
      return `User ${u.id}`;
    }
    return String(u);
  };

  const staticUsers = [{ id: 1, label: 'sakshijagtap' }];
  const newUserLabel = staticUsers.find((u) => String(u.id) === String(newUser));

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-purple-900 mb-1">Reallocation Management</h3>
            <p className="text-xs text-purple-700">
              Transfer ownership of allocated archived leads between agents. Useful for workload
              balancing or when agents change territories.
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reallocation Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reallocate To</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select New User</option>
                <option value="1">sakshijagtap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Territory change"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleReallocate}
              disabled={!selectedLeads.length || !newUser || reallocating}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {reallocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>Reallocate Selected ({selectedLeads.length})</span>
            </button>
          </div>
        </div>

        {selectedLeads.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                {selectedLeads.length} lead(s) selected
              </span>
            </div>
            {newUser && (
              <div className="flex items-center space-x-2 text-sm text-purple-700">
                <span>→</span>
                <span className="font-semibold">
                  {newUserLabel ? getUserLabel(newUserLabel) : newUser}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterByUser}
              onChange={(e) => setFilterByUser(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Filter by Current User</option>
              <option value="1">sakshijagtap</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allocatedLeads.length > 0 && selectedLeads.length === allocatedLeads.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300"
                    />
                  </th>
                  {['Lead ID', 'Name', 'Contact', 'Current User', 'Product', 'Archived Date', 'Reason'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allocatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                        className="w-4 h-4 text-purple-600 rounded border-gray-300"
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
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          {getUserLabel(lead.allocated_to)}
                        </span>
                        {selectedLeads.includes(lead.id) && newUser && (
                          <>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              {newUserLabel ? getUserLabel(newUserLabel) : newUser}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {typeof lead.product === 'object' ? lead.product?.name : lead.product || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {lead.archived_at ? lead.archived_at.split('T')[0] : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {lead.archived_reason || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && allocatedLeads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No allocated leads found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReallocateData;
