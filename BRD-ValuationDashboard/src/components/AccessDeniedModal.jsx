import React from 'react';

const AccessDeniedModal = ({ isOpen, onClose, message }) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-6 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white p-5 sm:p-8 rounded-xl shadow-2xl text-center w-full max-w-xs sm:max-w-md mx-auto transform transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-90'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-red-700 mb-3 sm:mb-4 animate-pulse">
          Access Denied
        </h2>
        <p className="text-sm sm:text-lg text-gray-800 mb-4 sm:mb-6 border-t border-b py-3 border-gray-200 break-words">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-red-600 text-white text-sm sm:text-base rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedModal;