// FunnelChart.jsx
import React from 'react';
import { TrendingDown, Users, Filter, Zap, Calendar, Briefcase } from 'lucide-react';

const FunnelChart = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stages = [
    {
      name: 'Raw Leads',
      count: data.rawLeads,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      percentage: 100
    },
    {
      name: 'Qualified Leads',
      count: data.qualifiedLeads,
      icon: Filter,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      percentage: (data.qualifiedLeads / data.rawLeads) * 100
    },
    {
      name: 'Hot Leads',
      count: data.hotLeads,
      icon: Zap,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      percentage: (data.hotLeads / data.rawLeads) * 100
    },
    {
      name: 'Follow Up',
      count: data.followUp,
      icon: Calendar,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      percentage: (data.followUp / data.rawLeads) * 100
    },
    {
      name: 'Deals Closed',
      count: data.deals,
      icon: Briefcase,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600',
      percentage: (data.deals / data.rawLeads) * 100
    }
  ];

  const conversionRate = ((data.deals / data.rawLeads) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Sales Funnel</h3>
          <p className="text-sm text-gray-500 mt-1">
            Lead progression through pipeline stages
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-green-600">{conversionRate}%</p>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const dropOff = idx > 0 ? stages[idx - 1].count - stage.count : 0;
          const dropOffPercentage = idx > 0 
            ? (((stages[idx - 1].count - stage.count) / stages[idx - 1].count) * 100).toFixed(1)
            : 0;

          return (
            <div key={idx}>
              {/* Stage Bar */}
              <div 
                className="relative group cursor-pointer"
                style={{ 
                  width: `${stage.percentage}%`,
                  minWidth: '60%',
                  marginLeft: `${(100 - stage.percentage) / 2}%`,
                  transition: 'all 0.3s ease'
                }}
              >
                <div className={`${stage.color} rounded-xl p-4 hover:shadow-lg transition-shadow`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{stage.name}</p>
                        <p className="text-xs opacity-90">{stage.percentage.toFixed(1)}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stage.count.toLocaleString()}</p>
                      <p className="text-xs opacity-90">leads</p>
                    </div>
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute left-0 right-0 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                    <p className="font-medium mb-1">{stage.name} Details</p>
                    <p>Count: {stage.count.toLocaleString()}</p>
                    <p>Percentage: {stage.percentage.toFixed(1)}%</p>
                    {idx > 0 && (
                      <p className="text-red-300 mt-1">
                        Drop-off: {dropOff.toLocaleString()} ({dropOffPercentage}%)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Drop-off indicator */}
              {idx < stages.length - 1 && dropOff > 0 && (
                <div className="flex items-center justify-center py-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <TrendingDown className="w-3 h-3 text-red-500" />
                    <span>-{dropOff.toLocaleString()} leads ({dropOffPercentage}%)</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">Starting Leads</p>
            <p className="text-lg font-bold text-gray-900">{data.rawLeads.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Drop-off</p>
            <p className="text-lg font-bold text-red-600">
              {(data.rawLeads - data.deals).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Final Deals</p>
            <p className="text-lg font-bold text-green-600">{data.deals.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;