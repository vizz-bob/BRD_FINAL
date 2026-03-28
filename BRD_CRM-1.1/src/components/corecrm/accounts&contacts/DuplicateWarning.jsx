import { AlertTriangle, X } from 'lucide-react';

const DuplicateWarning = ({ onClose, onProceed }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Duplicate Contact Detected</h3>
          </div>

          <p className="text-gray-600 mb-6">
            A contact with this phone number or email already exists. Do you want to create a duplicate or merge with the existing contact?
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition"
            >
              Create Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateWarning;