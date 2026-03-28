import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock3 } from 'lucide-react';

const StatusBadge = ({ outcome, status }) => {
  if (outcome) {
    const icons = {
      'Won': <CheckCircle2 className="w-3 h-3" />, 
      'Lost': <XCircle className="w-3 h-3" />, 
      'Dead': <AlertCircle className="w-3 h-3" />, 
      'In Progress': <Clock3 className="w-3 h-3" />,
    };
    const styles = {
      'Won': 'bg-green-100 text-green-800',
      'Lost': 'bg-red-100 text-red-800',
      'Dead': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
    };
    const style = styles[outcome] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style}`}>
        {icons[outcome]}{outcome}
      </span>
    );
  }

  // Fallback for status
  const statusStyles = {
    'Converted': 'bg-green-100 text-green-800',
    'Follow-up': 'bg-yellow-100 text-yellow-800',
    'Lost': 'bg-red-100 text-red-800',
    'Dead': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
  };
  const s = statusStyles[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${s}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
