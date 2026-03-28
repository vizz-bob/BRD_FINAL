import React from 'react';
import { Calendar, Zap, BarChart } from 'lucide-react';

const StepThree = ({ formData, setFormData, errors }) => {
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      {/* Timing Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleChange('timing', 'now')}
          className={`p-4 border rounded-xl flex items-center space-x-4 ${formData.timing === 'now' ? 'bg-indigo-100 border-indigo-500' : 'border-gray-200'}`}
        >
          <Zap className={`w-6 h-6 ${formData.timing === 'now' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <div className="text-left">
            <p className="font-semibold text-gray-900">Send Immediately</p>
            <p className="text-xs text-gray-500">Messages will be queued now</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => handleChange('timing', 'schedule')}
          className={`p-4 border rounded-xl flex items-center space-x-4 ${formData.timing === 'schedule' ? 'bg-indigo-100 border-indigo-500' : 'border-gray-200'}`}
        >
          <Calendar className={`w-6 h-6 ${formData.timing === 'schedule' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <div className="text-left">
            <p className="font-semibold text-gray-900">Schedule for Later</p>
            <p className="text-xs text-gray-500">Pick a specific date and time</p>
          </div>
        </button>
      </div>

      {/* DateTime Picker */}
      {formData.timing === 'schedule' && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date & Time</label>
          <input
            type="datetime-local"
            value={formData.scheduleDateTime || ''}
onChange={(e) => handleChange('scheduleDateTime', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
          />
          {errors.timing && <p className="text-red-500 text-xs mt-1">{errors.timing}</p>}
        </div>
      )}

      {/* Tracking Info */}
      <div className="bg-green-50 p-4 border border-green-200 rounded-lg">
        <p className="text-sm font-medium text-green-900 mb-2 flex items-center">
          <BarChart className="w-4 h-4 mr-2" /> Tracking Enabled
        </p>
        <ul className="text-xs text-green-800 space-y-1">
          <li>• Link click-through rate (CTR)</li>
          <li>• Delivery receipts status</li>
          <li>• Conversion tracking via UTMs</li>
        </ul>
      </div>
    </div>
  );
};

export default StepThree;
