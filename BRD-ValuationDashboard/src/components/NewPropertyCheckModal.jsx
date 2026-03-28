import React, { useState } from 'react';

const NewPropertyCheckModal = ({ isOpen, onClose, onSubmit }) => {
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setPropertyName('');
    setPropertyType('');
    setLocation('');
    setAssignedTo('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!propertyName.trim()) {
      setError('Property name is required.');
      return;
    }
    if (!assignedTo) {
      setError('Please select an agent.');
      return;
    }

    const payload = {
      property_name: propertyName.trim(),
      property_type: propertyType.trim(),
      location: location.trim(),
      assigned_to: assignedTo,
    };

    try {
      setLoading(true);
      await onSubmit(payload);
      resetForm();
    } catch (err) {
      console.error('Error creating property check:', err);
      setError('Failed to create property check. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-3 sm:px-4"
      onClick={handleClose}
    >
      <div
        className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-lg animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          New Property Check
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-3 sm:mb-4 px-3 sm:px-4 py-2 sm:py-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Property Name */}
          <div>
            <label htmlFor="propertyName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Property Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="propertyName"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter property name"
            />
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <input
              type="text"
              id="propertyType"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. Residential, Commercial"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter location"
            />
          </div>

          {/* Assigned To */}
          <div>
            <label htmlFor="assignedTo" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Assigned To <span className="text-red-500">*</span>
            </label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select Agent</option>
              <option value="Vikram Mehta">Vikram Mehta</option>
              <option value="Priya Sharma">Priya Sharma</option>
              <option value="Rajesh Kumar">Rajesh Kumar</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full xs:w-auto px-4 py-2 text-sm sm:text-base rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full xs:w-auto px-4 py-2 text-sm sm:text-base rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading ? 'Creating...' : 'Create Check'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPropertyCheckModal;