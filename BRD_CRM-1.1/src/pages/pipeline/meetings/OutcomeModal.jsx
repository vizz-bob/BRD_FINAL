// OutcomeModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

const OutcomeModal = ({ meeting, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    status: 'Completed',
    outcome: 'Positive',
    notes: '',
    meeting: meeting.id,
    nextAction: 'follow-up'
  });

  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'Completed', label: 'Completed', icon: CheckCircle, color: 'green' },
    { value: 'No-show', label: 'No-show', icon: XCircle, color: 'red' },
    { value: 'Cancelled', label: 'Cancelled', icon: AlertCircle, color: 'gray' }
  ];

  const outcomeOptions = [
    { value: 'Positive', label: 'Positive - Lead Interested', description: 'Lead shows strong interest and is ready to proceed' },
    { value: 'Neutral', label: 'Neutral - Needs Follow-up', description: 'Lead needs more time or information' },
    { value: 'Negative', label: 'Negative - Not Interested', description: 'Lead is not interested or does not qualify' }
  ];

  const nextActionOptions = [
    { value: 'move-to-deals', label: 'Move to Deals Stage' },
    { value: 'follow-up', label: 'Schedule Follow-up' },
    { value: 'document-collection', label: 'Collect Documents' },
    { value: 'reschedule', label: 'Reschedule Meeting' },
    { value: 'none', label: 'No Action Required' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.notes.trim()) {
      newErrors.notes = 'Meeting summary is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Log Meeting Outcome</h2>
              <p className="text-sm text-gray-500">Meeting ID: {meeting.id} • {meeting.leadName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Meeting Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Meeting Status *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {statusOptions.map(option => {
                const Icon = option.icon;
                const isSelected = formData.status === option.value;
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('status', option.value)}
                    className={`p-4 border-2 rounded-xl transition flex items-center gap-3 ${
                      isSelected
                        ? `border-${option.color}-600 bg-${option.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? `text-${option.color}-600` : 'text-gray-400'}`} />
                    <span className={`font-medium ${isSelected ? `text-${option.color}-900` : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outcome (only if Completed) */}
          {formData.status === 'Completed' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Meeting Outcome *
              </label>
              <div className="space-y-2">
                {outcomeOptions.map(option => {
                  const isSelected = formData.outcome === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('outcome', option.value)}
                      className={`w-full p-4 border-2 rounded-xl transition text-left ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                            {option.label}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Meeting Summary / Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Meeting Summary & Notes *
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={6}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                errors.notes ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder={`Document what was discussed in the meeting:
• Key points covered
• Lead's concerns or questions
• Documents discussed or required
• Next steps agreed upon
• Any commitments made`}
            />
            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
            <p className="text-xs text-gray-500 mt-2">
              <FileText className="w-3 h-3 inline mr-1" />
              Detailed notes help in follow-ups and tracking lead progress
            </p>
          </div>

          {/* Next Action (only if Completed with Positive/Neutral outcome) */}
          {formData.status === 'Completed' && (formData.outcome === 'Positive' || formData.outcome === 'Neutral') && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Next Action
              </label>
              <select
                value={formData.nextAction}
                onChange={(e) => handleChange('nextAction', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {nextActionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Info Box based on selections */}
          <div className={`p-4 rounded-xl border ${
            formData.status === 'Completed' && formData.outcome === 'Positive'
              ? 'bg-green-50 border-green-200'
              : formData.status === 'No-show'
              ? 'bg-red-50 border-red-200'
              : 'bg-indigo-50 border-indigo-200'
          }`}>
            <p className="text-sm font-medium text-gray-900 mb-1">What happens next?</p>
            <p className="text-sm text-gray-700">
              {formData.status === 'Completed' && formData.outcome === 'Positive' && (
                <>✓ Lead will be marked as ready for Deals stage. You can move them immediately after logging this outcome.</>
              )}
              {formData.status === 'Completed' && formData.outcome === 'Neutral' && (
                <>→ A follow-up task will be created to re-engage with this lead.</>
              )}
              {formData.status === 'Completed' && formData.outcome === 'Negative' && (
                <>✗ Lead will be marked as not interested. Consider moving to archived leads.</>
              )}
              {formData.status === 'No-show' && (
                <>⚠ You'll be prompted to reschedule this meeting or mark the lead for follow-up.</>
              )}
              {formData.status === 'Cancelled' && (
                <>ℹ Meeting will be marked as cancelled. No further action required unless you reschedule.</>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Save Outcome
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutcomeModal;