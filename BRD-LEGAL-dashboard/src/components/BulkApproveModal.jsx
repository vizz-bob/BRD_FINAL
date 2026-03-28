import React, { useState } from 'react';

const BulkApproveModal = ({ isOpen, onClose, selectedApplications, onApprove }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleApproveClick = async () => {
    setLoading(true);
    setMessage('');
    try {
      await onApprove(selectedApplications.map(app => app.id));
      setMessage('Applications approved successfully!');
      // Optionally, close modal after a short delay or on user action
      setTimeout(onClose, 2000);
    } catch (error) {
      setMessage(`Error: ${error.message || 'Failed to approve applications.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Confirm Bulk Approval</h2>
        {selectedApplications.length > 0 ? (
          <div className="mb-4">
            <p className="text-gray-700 mb-2">You are about to approve the following applications:</p>
            <ul className="list-disc list-inside text-gray-600">
              {selectedApplications.map((app, index) => (
                <li key={index}>{app['Credit Score']} - {app['Loan Amount']} ({app['Status']})</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-700 mb-4">No applications selected for approval.</p>
        )}

        {message && (
          <p className={`mb-4 ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}

        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={handleApproveClick}
            disabled={loading || selectedApplications.length === 0}
          >
            {loading ? 'Approving...' : 'Approve Selected'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkApproveModal;