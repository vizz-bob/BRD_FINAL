// src/pages/core-crm/tasks-meetings/components/ActivityStats.jsx
import React from 'react';

const ActivityStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div 
            key={idx} 
            className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-800 mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-4 ${stat.bgColor} rounded-xl`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            
          </div>
        );
      })}
    </div>
  );
};

export default ActivityStats;