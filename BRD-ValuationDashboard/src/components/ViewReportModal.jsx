import React from 'react';
import Modal from 'react-modal';

const ViewReportModal = ({ isOpen, onRequestClose, report }) => {
  if (!report) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="View Report"
      className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[calc(100%-2rem)] max-w-xs sm:max-w-xl lg:max-w-2xl mx-auto mt-8 sm:mt-16 lg:mt-20 max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center px-4 sm:block sm:px-0 z-50"
    >
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Report Details</h2>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Report ID</h3>
          <p className="text-sm sm:text-base text-gray-800 mt-0.5">{report.id}</p>
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Title</h3>
          <p className="text-sm sm:text-base text-gray-800 mt-0.5">{report.title}</p>
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Date</h3>
          <p className="text-sm sm:text-base text-gray-800 mt-0.5">{report.date}</p>
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Type</h3>
          <p className="text-sm sm:text-base text-gray-800 mt-0.5">{report.type}</p>
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Content</h3>
          <p className="text-sm sm:text-base text-gray-800 mt-0.5 prose max-w-none">
            {report.content || 'No additional content available.'}
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 flex justify-end">
        <button
          onClick={onRequestClose}
          className="w-full xs:w-auto px-4 py-2 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewReportModal;