import React from 'react';
import { Calendar, Clock, Zap, Info, TrendingUp } from 'lucide-react';

const StepThree = ({ formData, setFormData, errors }) => {

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleBool = (field) => {
    handleChange(field, !formData[field]);
  };

  const getNowLocal = () => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6">

      {/* Timing */}
      <div>
        <label className="block text-sm font-medium mb-3">
          When to Send <span className="text-red-500">*</span>
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              handleChange('timing', 'now');
              handleChange('schedule_datetime', null);
            }}
            className={`p-4 border-2 rounded-lg ${
              formData.timing === 'now'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Zap className="text-green-600" />
              <div>
                <p className="font-medium">Send Now</p>
                <p className="text-xs text-gray-500">Immediate launch</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleChange('timing', 'schedule')}
            className={`p-4 border-2 rounded-lg ${
              formData.timing === 'schedule'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="text-indigo-600" />
              <div>
                <p className="font-medium">Schedule</p>
                <p className="text-xs text-gray-500">Pick date & time</p>
              </div>
            </div>
          </button>
        </div>

        {errors.timing && (
          <p className="text-red-500 text-sm mt-2">{errors.timing}</p>
        )}
      </div>

      {/* Schedule */}
      {formData.timing === 'schedule' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Schedule Date & Time <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type="datetime-local"
              min={getNowLocal()}
              value={formData.schedule_datetime || ''}
              onChange={(e) =>
                handleChange('schedule_datetime', e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.schedule_datetime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <Clock className="absolute right-3 top-2.5 text-gray-400" />
          </div>

          {errors.schedule_datetime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.schedule_datetime}
            </p>
          )}

          <div className="mt-2 flex gap-2 bg-indigo-50 p-2 rounded text-xs text-indigo-800">
            <Info size={14} />
            Best time: Tue–Thu, 10AM–2PM
          </div>
        </div>
      )}

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Frequency <span className="text-red-500">*</span>
        </label>

        <select
          value={formData.frequency || ''}
          onChange={(e) => handleChange('frequency', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.frequency ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select frequency</option>
          <option value="once">One-time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Tracking */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-indigo-600" />
          <h3 className="font-semibold">Tracking & Analytics</h3>
        </div>

        {[
          ['tracking_enabled', 'Email Open Tracking'],
          ['utm_parameters', 'UTM Parameters'],
          ['click_tracking', 'Click Tracking'],
        ].map(([key, label]) => (
          <div
            key={key}
            className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
          >
            <span className="text-sm">{label}</span>
            <button
              type="button"
              onClick={() => toggleBool(key)}
              className={`h-6 w-11 rounded-full relative ${
                formData[key] ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-transform ${
                  formData[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="border-t pt-4">
        <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
          Draft
        </span>
      </div>
    </div>
  );
};

export default StepThree;
