import React from 'react';
import { Calendar, Clock, RefreshCcw, Bell, Zap, Info } from 'lucide-react';

const StepThree = ({ formData, setFormData, errors }) => {
  const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Scheduling <span className="text-red-500">*</span></label>
          <div className="flex gap-4">
            <button
              onClick={() => handleChange('timing', 'now')}
              className={`flex-1 p-3 border-2 rounded-lg ${formData.timing === 'now' ? 'border-indigo-600 bg-indigo-100' : 'border-gray-100'}`}
            >
              <Zap className="w-4 h-4 mx-auto mb-1" />
              <p className="text-xs font-bold">Call Now</p>
            </button>
            <button
              onClick={() => handleChange('timing', 'schedule')}
              className={`flex-1 p-3 border-2 rounded-lg ${formData.timing === 'schedule' ? 'border-indigo-600 bg-indigo-100' : 'border-gray-100'}`}
            >
              <Calendar className="w-4 h-4 mx-auto mb-1" />
              <p className="text-xs font-bold">Schedule</p>
            </button>
          </div>
        </div>

        {formData.timing === 'schedule' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              value={formData.scheduleDateTime || ''}
              onChange={(e) => handleChange('scheduleDateTime', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {errors.scheduleDateTime && (
              <p className="text-red-500 text-s mt-1">{errors.scheduleDateTime}</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <RefreshCcw className="w-4 h-4 mr-2 text-indigo-600" /> Retry Attempts
          </label>
          <select 
            value={formData.retryAttempts} 
            onChange={(e) => handleChange('retryAttempts', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value={0}>No Retries</option>
            <option value={1}>1 Retry (If Busy)</option>
            <option value={2}>2 Retries</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Bell className="w-4 h-4 mr-2 text-indigo-600" /> IVR Keypad Interaction
          </label>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
            <span className="text-xs text-gray-600">Track keypad responses (Press 1, etc.)</span>
            <input 
              type="checkbox" 
              checked={formData.ivrTracking} 
              onChange={(e) => handleChange('ivrTracking', e.target.checked)} 
            />
          </div>
        </div>
      </div>

      <div className="bg-indigo-100 p-4 rounded-xl border border-indigo-100 flex gap-3">
        <Info className="w-5 h-5 text-indigo-600" />
        <p className="text-xs text-indigo-800 leading-relaxed">
          <strong>Telephony Policy:</strong> Calls will only be placed between 9:00 AM and 8:00 PM local time to comply with regulations.
        </p>
      </div>
    </div>
  );
};

export default StepThree;