import React from 'react';
import { Calendar, Clock, Zap, Info, TrendingUp, CheckCircle } from 'lucide-react';

const StepThree = ({ formData, setFormData, errors }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTracking = (field) => {
    handleChange(field, !formData[field]);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      {/* Timing Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          When to Send <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleChange('timing', 'now')}
            className={`p-4 border-2 rounded-lg transition-all ${
              formData.timing === 'now'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Send Now</p>
                <p className="text-xs text-gray-500">Launch immediately after review</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleChange('timing', 'schedule')}
            className={`p-4 border-2 rounded-lg transition-all ${
              formData.timing === 'schedule'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Schedule</p>
                <p className="text-xs text-gray-500">Choose specific date and time</p>
              </div>
            </div>
          </button>
        </div>
        {errors.timing && (
          <p className="text-red-500 text-sm mt-2">{errors.timing}</p>
        )}
      </div>

      {/* Schedule Date & Time (Only if 'schedule' is selected) */}
      {formData.timing === 'schedule' && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Date & Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              value={formData.scheduleDateTime || ''}
              onChange={(e) => handleChange('scheduleDateTime', e.target.value)}
              min={getCurrentDateTime()}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.scheduleDateTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.scheduleDateTime && (
            <p className="text-red-500 text-sm mt-1">{errors.scheduleDateTime}</p>
          )}
        </div>
      )}

      {/* Frequency Selection - REQUIRED FOR VALIDATION */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frequency <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.frequency || ''}
          onChange={(e) => handleChange('frequency', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.frequency ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select frequency...</option>
          <option value="once">One-time Broadcast</option>
          <option value="daily">Daily Updates</option>
          <option value="weekly">Weekly Summary</option>
          <option value="monthly">Monthly Newsletter</option>
        </select>
        {errors.frequency && (
          <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>
        )}
      </div>

      {/* WhatsApp Specific Tracking Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">WhatsApp Analytics</h3>
        </div>

        <div className="space-y-4">
          {/* Read Receipt Tracking */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Enable Read Receipts Tracking</p>
              <p className="text-xs text-gray-500 mt-1">
                Track when recipients see your message (Blue Ticks)
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleTracking('trackingEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.trackingEnabled ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.trackingEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Button Click Tracking */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Track Interactive Buttons</p>
              <p className="text-xs text-gray-500 mt-1">
                Monitor clicks on "Quick Reply" or "Call to Action" buttons
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleTracking('clickTracking')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.clickTracking ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.clickTracking ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Benefits Summary */}
        {(formData.trackingEnabled || formData.clickTracking) && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">✨ WhatsApp Performance Insights:</p>
            <ul className="space-y-1 text-xs text-green-800">
              {formData.trackingEnabled && <li>• Read rate and message engagement analytics</li>}
              {formData.clickTracking && <li>• Button response rates and link CTR</li>}
              <li>• Automated follow-up for non-readers</li>
            </ul>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Broadcast Status</h3>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            Ready to Queue
          </span>
          <span className="text-xs text-gray-500">
            → Messages will be sent via WhatsApp Business API
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepThree;