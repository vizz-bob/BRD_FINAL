import React from 'react';

const ViewPropertyDetailsModal = ({ isOpen, onClose, property }) => {
  if (!isOpen || !property) return null;

  const statusClasses = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'Not Started': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'not-started': 'bg-gray-100 text-gray-800',
  };

  const getStatusClass = (status) => statusClasses[status] || 'bg-gray-100 text-gray-800';

  // Safe fallback
  const checkItems = property.checkItems ?? property.check_items ?? [];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-3 sm:px-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-xl lg:max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 border-b pb-3 break-words">
          {property.property_name ?? property.name}
        </h2>

        {/* Property Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-gray-700">
              <span className="font-medium">Property ID:</span> {property.id}
            </p>
            <p className="text-xs sm:text-sm text-gray-700">
              <span className="font-medium">Type:</span>{' '}
              {property.property_type ?? property.type ?? '—'}
            </p>
            <p className="text-xs sm:text-sm text-gray-700">
              <span className="font-medium">Location:</span>{' '}
              {property.location ?? '—'}
            </p>
            <p className="text-xs sm:text-sm text-gray-700">
              <span className="font-medium">Assigned To:</span>{' '}
              {property.assigned_to ?? property.assignedTo ?? '—'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-gray-700 flex flex-wrap items-center gap-1">
              <span className="font-medium">Status:</span>{' '}
              {property.status ? (
                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusClass(property.status)}`}>
                  {property.status}
                </span>
              ) : '—'}
            </p>
            <p className="text-xs sm:text-sm text-gray-700 flex flex-wrap items-center gap-1">
              <span className="font-medium">Priority:</span>{' '}
              {property.priority ? (
                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusClass(property.priority)}`}>
                  {property.priority}
                </span>
              ) : '—'}
            </p>
            <p className="text-xs sm:text-sm text-gray-700">
              <span className="font-medium">Created At:</span>{' '}
              {property.created_at
                ? new Date(property.created_at).toLocaleDateString()
                : property.lastCheck ?? '—'}
            </p>
          </div>
        </div>

        {/* Check Items */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 border-b pb-2">
            Check Items
          </h3>
          {checkItems.length > 0 ? (
            <ul className="space-y-2">
              {checkItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-0 bg-gray-50 p-2 sm:p-3 rounded-lg shadow-sm"
                >
                  <span className="text-xs sm:text-sm text-gray-700">{item.item}</span>
                  <span className={`self-start xs:self-auto px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-gray-400 italic">No check items available.</p>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-full xs:w-auto px-4 sm:px-5 py-2 text-sm sm:text-base bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPropertyDetailsModal;