// StatusBadge.jsx
import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch(status) {
      case 'Scheduled':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          icon: Clock,
          label: 'Scheduled'
        };
      case 'Completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'Cancelled':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: AlertCircle,
          label: 'Cancelled'
        };
      case 'No-show':
        return {
          bg: 'bg-red-100',
          text: 'text-red-600',
          icon: XCircle,
          label: 'No-show'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          icon: Clock,
          label: status
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.text} font-medium rounded-lg ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  );
};

export default StatusBadge;