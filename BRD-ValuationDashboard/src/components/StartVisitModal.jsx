import React, { useState, useEffect } from 'react';

const StartVisitModal = ({ isOpen, onClose, verificationId }) => {
  const [visitNotes, setVisitNotes] = useState('');
  const [status, setStatus] = useState('In Progress');

  useEffect(() => {
    if (!isOpen) {
      setVisitNotes('');
      setStatus('In Progress');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Starting visit for ${verificationId} with notes: ${visitNotes} and status: ${status}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-3 sm:px-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 sm:p-8 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 break-words">
          Start Visit for {verificationId}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 sm:mb-4">
            <label htmlFor="status" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mb-4 sm:mb-6">
            <label htmlFor="visitNotes" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Visit Notes
            </label>
            <textarea
              id="visitNotes"
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              rows="4"
              className="mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none sm:resize-y"
            />
          </div>
          <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full xs:w-auto px-4 py-2 text-sm sm:text-base bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full xs:w-auto px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartVisitModal;