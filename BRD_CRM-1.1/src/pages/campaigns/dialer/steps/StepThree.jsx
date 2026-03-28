// import React from 'react';
// import { Calendar, Clock, Settings, Bell, ShieldCheck } from 'lucide-react';

// const StepThree = ({ formData, setFormData, errors }) => {
//   const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

//   return (
//     <div className="space-y-6">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-3">Campaign Timing</label>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <button
//             type="button"
//             onClick={() => handleChange('timing', 'now')}
//             className={`p-4 border rounded-xl text-left ${formData.timing === 'now' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
//           >
//             <div className="font-semibold">Start Immediately</div>
//             <div className="text-xs text-gray-500">Campaign goes live once launched</div>
//           </button>
//           <button
//             type="button"
//             onClick={() => handleChange('timing', 'schedule')}
//             className={`p-4 border rounded-xl text-left ${formData.timing === 'schedule' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
//           >
//             <div className="font-semibold">Schedule for Later</div>
//             <div className="text-xs text-gray-500">Pick a specific date and time</div>
//           </button>
//         </div>
//       </div>

//       {formData.timing === 'schedule' && (
//         <>
//           <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Select Date & Time</label>
//             <input
//               type="datetime-local"
//               value={formData.scheduledTime}
//               onChange={(e) => handleChange('scheduledTime', e.target.value)}
//               className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
//                 errors.scheduledTime ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//           </div>
//           {errors.scheduledTime && (
//             <p className="text-red-500 text-sm mt-2">{errors.scheduledTime}</p>
//           )}
//         </>
//       )}

//       <div className="space-y-4">
//         <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
//           <input
//             type="checkbox"
//             checked={formData.autoSchedule}
//             onChange={(e) => handleChange('autoSchedule', e.target.checked)}
//             className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
//           />
//           <div className="ml-3">
//             <span className="text-sm font-medium text-gray-900">Auto-Schedule Follow-ups</span>
//             <p className="text-xs text-gray-500">Automatically retry busy or no-answer numbers after 2 hours</p>
//           </div>
//         </label>
        
//         {/* Compliance info box */}
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//           <p className="text-sm font-medium text-yellow-900 mb-2 flex items-center">
//             <ShieldCheck className="w-4 h-4 mr-2" /> Compliance Reminder
//           </p>
//           <p className="text-xs text-yellow-800">
//             Ensure your campaign adheres to TCPA and local calling regulations. Recordings are enabled by default.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StepThree;

import React from 'react';
import { ShieldCheck } from 'lucide-react';

const StepThree = ({ formData, setFormData, errors }) => {
  // Handle any field change
  const handleChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  // Handle timing selection and auto-fill scheduled_time if needed
  const handleTimingChange = (option) => {
    if (option === 'schedule' && !formData.scheduled_time) {
      // Fill with current datetime in YYYY-MM-DDTHH:mm format
      const now = new Date();
      const formatted = now.toISOString().slice(0, 16); // slice removes seconds & ms
      setFormData(prev => ({
        ...prev,
        timing: 'schedule',
        scheduled_time: formatted
      }));
    } else {
      setFormData(prev => ({ ...prev, timing: option }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Timing Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Campaign Timing
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['now', 'schedule'].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => handleTimingChange(option)}
              className={`p-4 border rounded-xl text-left ${
                formData.timing === option
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="font-semibold">
                {option === 'now' ? 'Start Immediately' : 'Schedule for Later'}
              </div>
              <div className="text-xs text-gray-500">
                {option === 'now'
                  ? 'Campaign goes live once launched'
                  : 'Pick a specific date and time'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled Date/Time Picker */}
      {formData.timing === 'schedule' && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date & Time
          </label>
          <input
            type="datetime-local"
            value={formData.scheduled_time || ''}
            onChange={(e) => handleChange('scheduled_time', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.scheduled_time ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.scheduled_time && (
            <p className="text-red-500 text-sm mt-2">{errors.scheduled_time}</p>
          )}
        </div>
      )}

      {/* Auto-Schedule Follow-ups */}
      <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          checked={formData.auto_schedule || false}
          onChange={(e) => handleChange('auto_schedule', e.target.checked)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
        />
        <div className="ml-3">
          <span className="text-sm font-medium text-gray-900">
            Auto-Schedule Follow-ups
          </span>
          <p className="text-xs text-gray-500">
            Automatically retry busy or no-answer numbers after 2 hours
          </p>
        </div>
      </label>

      {/* Compliance Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm font-medium text-yellow-900 mb-2 flex items-center">
          <ShieldCheck className="w-4 h-4 mr-2" /> Compliance Reminder
        </p>
        <p className="text-xs text-yellow-800">
          Ensure your campaign adheres to TCPA and local calling regulations. Recordings are enabled by default.
        </p>
      </div>
    </div>
  );
};

export default StepThree;
