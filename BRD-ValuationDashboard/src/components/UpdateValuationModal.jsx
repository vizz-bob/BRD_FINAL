import React from 'react';

const UpdateValuationModal = ({ isOpen, onClose, valuation }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-3 sm:px-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Update Valuation</h2>
        <form>
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              defaultValue={valuation?.status}
              className="mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Verified</option>
            </select>
          </div>
          <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full xs:w-auto px-4 py-2 text-sm sm:text-base bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full xs:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateValuationModal;