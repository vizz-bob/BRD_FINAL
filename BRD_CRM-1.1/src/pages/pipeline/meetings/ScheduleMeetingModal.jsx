// ScheduleMeetingModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, Phone, MapPin, User, FileText, Upload } from 'lucide-react';

const ScheduleMeetingModal = ({ onClose, onSchedule, initialData = {} }) => {
  const [formData, setFormData] = useState({
    leadName: initialData.leadName || '',
    leadId: initialData.leadId || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    meetingType: 'Virtual',
    meetingMode: 'Google Meet',
    scheduledDate: '',
    scheduledTime: '',
    duration: '',
    agenda: '',
    location: '',
    agentName: 'Agent A',
    agentId: 'AGT-001',
    attachments: [],
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        leadName: initialData.leadName || prev.leadName,
        leadId: initialData.leadId || prev.leadId,
        phone: initialData.phone || prev.phone,
        email: initialData.email || prev.email,
      }));
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});

  const meetingModes = {
    'Virtual': ['Google Meet', 'Zoom', 'WhatsApp'],
    'In-person': ['Physical'],
    'Telephonic': ['Phone']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset meetingMode when meetingType changes
      ...(name === 'meetingType' ? { meetingMode: meetingModes[value][0] } : {})
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.leadName.trim()) newErrors.leadName = 'Lead name is required';
    if (!formData.leadId.trim()) newErrors.leadId = 'Lead ID is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Date is required';
    if (!formData.scheduledTime) newErrors.scheduledTime = 'Time is required';
    if (!formData.agenda.trim()) newErrors.agenda = 'Agenda is required';
    
    // Validate date is not in the past
    const selectedDate = new Date(formData.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.scheduledDate = 'Date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Auto-generate location based on meeting mode
    let location = formData.location;
    if (formData.meetingMode === 'Google Meet' && !location) {
      location = 'https://meet.google.com/auto-generated';
    } else if (formData.meetingMode === 'Phone') {
      location = 'N/A';
    }

    onSchedule({
      ...formData,
      location
    });
  };

  const getMeetingIcon = () => {
    switch(formData.meetingMode) {
      case 'Google Meet':
      case 'Zoom':
      case 'WhatsApp':
        return <Video className="w-5 h-5" />;
      case 'Phone':
        return <Phone className="w-5 h-5" />;
      case 'Physical':
        return <MapPin className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Schedule New Meeting</h2>
              <p className="text-sm text-gray-500">Book an appointment with your lead</p>
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
          {/* Lead Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Lead Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Name *
                </label>
                <input
                  type="text"
                  name="leadName"
                  value={formData.leadName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.leadName ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter lead name"
                />
                {errors.leadName && <p className="text-red-500 text-xs mt-1">{errors.leadName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead ID *
                </label>
                <input
                  type="text"
                  name="leadId"
                  value={formData.leadId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.leadId ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g., QL-001"
                />
                {errors.leadId && <p className="text-red-500 text-xs mt-1">{errors.leadId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="lead@example.com"
                />
              </div>
            </div>
          </div>

          {/* Meeting Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              {getMeetingIcon()}
              Meeting Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Type *
                </label>
                <select
                  name="meetingType"
                  value={formData.meetingType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Virtual">Virtual</option>
                  <option value="In-person">In-person</option>
                  <option value="Telephonic">Telephonic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Mode *
                </label>
                <select
                  name="meetingMode"
                  value={formData.meetingMode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {meetingModes[formData.meetingType].map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.scheduledDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.scheduledDate && <p className="text-red-500 text-xs mt-1">{errors.scheduledDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.scheduledTime ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.scheduledTime && <p className="text-red-500 text-xs mt-1">{errors.scheduledTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="15 minutes">15 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="45 minutes">45 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location / Link
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={
                    formData.meetingMode === 'Physical' 
                      ? 'Branch Office Address' 
                      : formData.meetingMode === 'Phone'
                      ? 'N/A'
                      : 'Auto-generated'
                  }
                />
              </div>
            </div>
          </div>

          {/* Agenda & Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Agenda *
            </label>
            <textarea
              name="agenda"
              value={formData.agenda}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                errors.agenda ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Describe the purpose and topics for this meeting..."
            />
            {errors.agenda && <p className="text-red-500 text-xs mt-1">{errors.agenda}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Any additional notes or special instructions..."
            />
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
              <Calendar className="w-4 h-4" />
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;