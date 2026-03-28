import React from 'react';

const DashboardMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{metric.value}</p>
            </div>
            <div className={`p-3 rounded-full ${
              metric.color === 'red' ? 'bg-red-100' :
              metric.color === 'yellow' ? 'bg-yellow-100' :
              metric.color === 'green' ? 'bg-green-100' :
              'bg-blue-100'
            }`}>
              {metric.icon}
            </div>
          </div>
          {metric.trend && (
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend > 0 ? '+' : ''}{metric.trend}%
              </span>
              <span className="ml-2 text-sm text-gray-500">vs last week</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;