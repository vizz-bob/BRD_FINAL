import React, { useState } from 'react';

const NewAgreementModal = ({ isOpen, onClose, onSave }) => {
  const [agreementType, setAgreementType] = useState('');
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');

  // Match backend ASSIGNEES choices (first names only)
  const legalTeamMembers = ['Rahul', 'Amit', 'Sneha', 'Priya'];

  const handleSubmit = () => {
    if (agreementType && client && amount && assignedTo) {
      onSave({
        agreement_id: `AGR-${Math.floor(Math.random() * 10000)}`,
        agreement_type: agreementType,
        client_name: client,
        amount: amount, // Send as number, not formatted string
        priority: priority,
        status: 'Pending',
        assigned_to: assignedTo,
      });

      // Reset form
      setAgreementType('');
      setClient('');
      setAmount('');
      setPriority('Medium');
      setAssignedTo('');
      onClose();
    } else {
      alert('Please fill in all required fields.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fadeInUp">
        
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Create New Agreement
        </h2>

        {/* Form */}
        <div className="space-y-4">
          {/* Agreement Type */}
          <SelectField
            label="Agreement Type"
            value={agreementType}
            onChange={(e) => setAgreementType(e.target.value)}
            options={['Loan Agreement', 'Collateral Agreement', 'Guarantor Agreement']}
            placeholder="Select Agreement Type"
          />

          {/* Client */}
          <InputField
            label="Client Name"
            value={client}
            placeholder="e.g., John Doe"
            onChange={(e) => setClient(e.target.value)}
          />

          {/* Amount */}
          <InputField
            label="Amount (₹)"
            type="number"
            value={amount}
            placeholder="e.g., 500000"
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Priority */}
          <SelectField
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={['Low', 'Medium', 'High']}
          />

          {/* Assign To */}
          <SelectField
            label="Assign To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            options={legalTeamMembers}
            placeholder="Select Assignee"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all"
          >
            Create Agreement
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.25s ease-out;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NewAgreementModal;


/* Reusable Clean Input Component */
const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
    />
  </div>
);

/* Reusable Clean Select Component */
const SelectField = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm 
                 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
