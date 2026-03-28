// ProjectionTrends.jsx
import React from 'react';
import { TrendingUp, Calendar, BarChart3, Activity } from 'lucide-react';

const ProjectionTrends = ({ data, filters, expanded = false }) => {

  if (!data) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No trend data available</p>
          <p className="text-sm text-gray-400 mt-1">Create forecasts in the Manage Forecasts tab to see trends</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.target, d.achieved)), 1);
  const chartHeight = expanded ? 400 : 300;

  const getBarHeight = (value) => {
    return (value / maxValue) * (chartHeight - 80);
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const calculateTrend = () => {
    if (data.length < 2) return { value: 0, positive: true };
    
    const lastWeek = data[data.length - 1];
    const previousWeek = data[data.length - 2];
    
    const trend = ((lastWeek.achieved - previousWeek.achieved) / previousWeek.achieved) * 100;
    return { value: Math.abs(trend).toFixed(1), positive: trend > 0 };
  };

  const trend = calculateTrend();

  const overallAchievement = data.reduce((sum, d) => sum + d.achieved, 0);
  const overallTarget = data.reduce((sum, d) => sum + d.target, 0);
  const achievementPercentage = overallTarget > 0
    ? ((overallAchievement / overallTarget) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Projection Trends</h3>
          <p className="text-sm text-gray-500 mt-1">
            Target vs Achieved performance over time
          </p>
        </div>

        {/* Overall Stats */}
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl">
          <Activity className="w-4 h-4 text-indigo-600" />
          <div className="text-right">
            <p className="text-xs text-gray-600">Overall</p>
            <p className="text-sm font-bold text-indigo-600">{achievementPercentage}%</p>
          </div>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${trend.positive ? 'bg-green-100' : 'bg-red-100'} rounded-lg`}>
              <TrendingUp 
                className={`w-5 h-5 ${trend.positive ? 'text-green-600' : 'text-red-600 rotate-180'}`} 
              />
            </div>
            <div>
              <p className="text-xs text-gray-600">Performance Trend</p>
              <p className={`text-lg font-bold ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? '+' : '-'}{trend.value}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">vs Previous Period</p>
            <p className="text-sm font-medium text-gray-900">
              {trend.positive ? 'Growing' : 'Declining'}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${chartHeight}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-20 flex flex-col justify-between text-xs text-gray-500">
          <span>{formatCurrency(maxValue)}</span>
          <span>{formatCurrency(maxValue * 0.75)}</span>
          <span>{formatCurrency(maxValue * 0.5)}</span>
          <span>{formatCurrency(maxValue * 0.25)}</span>
          <span>₹0</span>
        </div>

        {/* Chart area */}
        <div className="ml-16 h-full">
          {/* Grid lines */}
          <div className="absolute left-16 right-0 top-0 bottom-20">
            {[0, 25, 50, 75, 100].map(percent => (
              <div
                key={percent}
                className="absolute left-0 right-0 border-t border-gray-200"
                style={{ bottom: `${(percent / 100) * (chartHeight - 80)}px` }}
              />
            ))}
          </div>

          {/* Bars */}
          <div className="relative h-full flex items-end justify-around gap-1 pb-20">
            {data.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                {/* Bars container */}
                <div className="w-full flex gap-1 items-end" style={{ height: `${chartHeight - 80}px` }}>
                  {/* Target bar */}
                  <div className="relative flex-1 group">
                    <div
                      className="w-full bg-gray-300 rounded-t-lg transition-all hover:bg-gray-400 cursor-pointer"
                      style={{ height: `${getBarHeight(item.target)}px` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                          <p className="font-medium">Target</p>
                          <p>{formatCurrency(item.target)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achieved bar */}
                  <div className="relative flex-1 group">
                    <div
                      className={`w-full rounded-t-lg transition-all cursor-pointer ${
                        item.achieved >= item.target
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-indigo-500 hover:bg-indigo-600'
                      }`}
                      style={{ height: `${getBarHeight(item.achieved)}px` }}
                    >
                      {/* Achievement indicator */}
                      {item.achieved >= item.target && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                          <div className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                            ✓
                          </div>
                        </div>
                      )}

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                          <p className="font-medium">Achieved</p>
                          <p>{formatCurrency(item.achieved)}</p>
                          <p className="text-gray-400 mt-1">
                            {((item.achieved / item.target) * 100).toFixed(1)}% of target
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* X-axis label */}
                <div className="mt-3 text-center">
                  <p className="text-xs font-medium text-gray-900">{item.period}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-500 rounded"></div>
            <span className="text-sm text-gray-600">Achieved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Target Met</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionTrends;