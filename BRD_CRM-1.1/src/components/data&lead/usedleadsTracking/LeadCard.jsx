import React from 'react';
import StatusBadge from './StatusBadge';
import { Eye } from 'lucide-react';

const LeadCard = ({ lead, onView, onReallocate, onReactivate, isAdmin, isLocked }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm sm:flex sm:items-center sm:justify-between">
      <div className="sm:flex sm:items-center sm:gap-4">
        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
        <div className="text-xs text-gray-500">{lead.id}</div>
        <div className="mt-2 sm:mt-0 sm:ml-4">
          <div className="text-xs text-gray-600">Agent: <span className="font-medium text-gray-900">{lead.agent}</span></div>
          <div className="text-xs text-gray-600">Product: <span className="font-medium text-gray-900">{lead.product || '-'}</span></div>
        </div>
      </div>

      <div className="mt-3 sm:mt-0 sm:flex sm:items-center sm:gap-3">
        <div className="mr-2">
          <StatusBadge outcome={lead.outcome} status={lead.status} />
        </div>
        <div className="text-sm text-gray-600">{lead.leadAge} days</div>
        <button onClick={() => onView(lead)} className="ml-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
          <Eye className="w-4 h-4" /> View
        </button>
        {!isLocked && (
          <button onClick={() => onReallocate(lead)} className="ml-2 px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
            Reallocate
          </button>
        )}
        {isLocked && isAdmin && (
          <button onClick={() => onReactivate(lead)} className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
            Reactivate
          </button>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
