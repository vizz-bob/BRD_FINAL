// ActivityItem.jsx
import React from 'react';

const ActivityItem = ({ activity, icon: Icon, color, isLast }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMins = Math.floor((now - date) / (1000 * 60));
      return `${diffInMins} mins ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="relative flex gap-4">
      {/* Icon */}
      <div className={`relative z-10 flex-shrink-0 w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {activity.user} • {formatTimestamp(activity.timestamp)}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

          {/* Metadata */}
          {Object.keys(activity.metadata).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(activity.metadata).map(([key, value]) => (
                <span
                  key={key}
                  className="text-xs px-2 py-1 bg-white rounded-lg border border-gray-200"
                >
                  <span className="text-gray-500 capitalize">{key}:</span>{' '}
                  <span className="text-gray-900 font-medium">{value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;