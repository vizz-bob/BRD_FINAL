import React, { useState } from 'react';

const BulkAssignModal = ({ isOpen, onClose, agreements, onBulkAssign }) => {
  const [selectedAgreementIds, setSelectedAgreementIds] = useState([]);
  const [assignee, setAssignee] = useState('');

  // Match backend ASSIGNEES choices (first names only)
  const legalTeamMembers = ['Rahul', 'Amit', 'Sneha', 'Priya'];

  const handleCheckboxChange = (id) => {
    setSelectedAgreementIds((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((item) => item !== id) : [...prevSelected, id]
    );
  };

  const handleSubmit = () => {
    if (selectedAgreementIds.length > 0 && assignee) {
      onBulkAssign(selectedAgreementIds, assignee);
      setSelectedAgreementIds([]);
      setAssignee('');
      onClose();
    } else {
      alert('Please select agreements and an assignee.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-black/40 backdrop-blur-sm h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Bulk Assign Agreements</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Assign to:</label>
            <select
              id="assignee"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Select Assignee</option>
              {legalTeamMembers.map((member) => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Agreements:</h3>
            <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
              {agreements.length > 0 ? (
                agreements.map((agr) => (
                  <div key={agr.id} className="flex items-center p-3 border-b border-gray-100 last:border-b-0">
                    <input
                      type="checkbox"
                      id={`agreement-${agr.id}`}
                      checked={selectedAgreementIds.includes(agr.id)}
                      onChange={() => handleCheckboxChange(agr.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`agreement-${agr.id}`} className="ml-3 text-sm text-gray-900">
                      {agr.id} - {agr.type} ({agr.client})
                    </label>
                  </div>
                ))
              ) : (
                <p className="p-3 text-sm text-gray-500">No agreements available for bulk assignment.</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Assign Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkAssignModal;
