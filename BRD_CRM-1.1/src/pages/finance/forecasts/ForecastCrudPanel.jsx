// ForecastCrudPanel.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ForecastService } from '../../../services/financeService';

const EMPTY_FORM = {
  name: '',
  forecast_type: 'SALES',
  period: 'MONTHLY',
  start_date: '',
  end_date: '',
  target_revenue: '',
};

const ForecastCrudPanel = ({ onDataChange }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await ForecastService.getAll();
      setRecords(res.data);
    } catch {
      setError('Failed to load forecasts.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditRecord(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (rec) => {
    setEditRecord(rec);
    setForm({
      name: rec.name,
      forecast_type: rec.forecast_type,
      period: rec.period,
      start_date: rec.start_date,
      end_date: rec.end_date,
      target_revenue: rec.target_revenue,
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.start_date || !form.end_date || !form.target_revenue) {
      setError('All fields are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editRecord) {
        await ForecastService.update(editRecord.id, form);
      } else {
        await ForecastService.create(form);
      }
      setShowModal(false);
      await fetchRecords();
      if (onDataChange) onDataChange();
    } catch (err) {
      const detail = err?.response?.data;
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail) || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ForecastService.delete(id);
      setDeleteId(null);
      await fetchRecords();
      if (onDataChange) onDataChange();
    } catch {
      setError('Delete failed.');
    }
  };

  const typeLabel = (t) => ({ SALES: 'Sales', REVENUE: 'Revenue' }[t] || t);
  const periodLabel = (p) => ({ WEEKLY: 'Weekly', MONTHLY: 'Monthly', quarterly: 'Quarterly' }[p] || p);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Manage Forecasts</h3>
          <p className="text-xs text-gray-500 mt-0.5">Create, edit or remove forecast records</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          New Forecast
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="text-sm">No forecasts yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Type', 'Period', 'Start', 'End', 'Target Revenue', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-medium text-gray-900">{rec.name}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      rec.forecast_type === 'SALES'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-green-100 text-green-700'
                    }`}>{typeLabel(rec.forecast_type)}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{periodLabel(rec.period)}</td>
                  <td className="px-5 py-3 text-gray-600">{rec.start_date}</td>
                  <td className="px-5 py-3 text-gray-600">{rec.end_date}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    ₹{Number(rec.target_revenue).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(rec)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {deleteId === rec.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                            title="Confirm delete"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(rec.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error banner (outside modal) */}
      {error && !showModal && (
        <div className="mx-6 mb-4 flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h4 className="font-semibold text-gray-900">
                {editRecord ? 'Edit Forecast' : 'New Forecast'}
              </h4>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {error && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Q1 Sales Forecast"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {/* Type + Period row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={form.forecast_type}
                    onChange={(e) => setForm({ ...form, forecast_type: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="SALES">Sales Forecast</option>
                    <option value="REVENUE">Revenue Forecast</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                  <select
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              {/* Start + End Date row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              {/* Target Revenue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Revenue (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.target_revenue}
                  onChange={(e) => setForm({ ...form, target_revenue: e.target.value })}
                  placeholder="e.g. 5000000"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editRecord ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastCrudPanel;
