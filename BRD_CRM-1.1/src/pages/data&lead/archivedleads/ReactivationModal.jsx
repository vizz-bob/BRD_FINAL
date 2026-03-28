import React, { useState } from 'react';
import { X, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';

/**
 * ReactivationModal
 * Props:
 *   lead      – the ArchivedLead object (normalised shape from AllData)
 *   onClose   – () => void
 *   onConfirm – (notes: string) => Promise<void>  (caller handles the API call)
 */
const ReactivationModal = ({ lead, onClose, onConfirm }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!notes.trim()) {
      alert('Please provide a reason / notes for reactivation.');
      return;
    }
    setLoading(true);
    try {
      await onConfirm(notes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-green-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5" />
            <h2 className="text-lg font-bold">Reactivate Lead</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Reactivating this lead will restore it to the active pipeline. This action requires
              manager-level permission and will be logged for compliance.
            </p>
          </div>

          {/* Lead Info */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Lead ID:</span>
              <span className="font-medium text-gray-900">{lead.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium text-gray-900">{lead.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Archive Reason:</span>
              <span className="font-medium text-gray-900">{lead.reason}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Archived On:</span>
              <span className="font-medium text-gray-900">{lead.archivedDate}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reactivation Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Reason for reactivation, follow-up plan, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Confirm Reactivation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReactivationModal;
