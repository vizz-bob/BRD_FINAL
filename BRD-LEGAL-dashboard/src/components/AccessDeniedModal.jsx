import React from 'react';

const AccessDeniedModal = ({ isOpen, onClose, message }) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose} // Allows clicking outside to close
    >
      <div
        className={`bg-white p-8 rounded-xl shadow-2xl text-center max-w-md mx-auto transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}
        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
      >
        <h2 className="text-3xl font-extrabold text-red-700 mb-4 animate-pulse">Access Denied</h2>
        <p className="text-lg text-gray-800 mb-6 border-t border-b py-3 border-gray-200">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedModal;
