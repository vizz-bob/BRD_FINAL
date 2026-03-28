// PerformanceMetrics.jsx
import React from 'react';
import { 
  Target, TrendingUp, DollarSign, Users, 
  AlertCircle, CheckCircle, Activity, Percent 
} from 'lucide-react';

const PerformanceMetrics = ({ metrics, filters }) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const getStatusColor = (percentage) => {
    if (percentage >= 80) return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle };
    if (percentage >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Activity };
    return { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle };
  };

  const achievementStatus = getStatusColor(metrics.achievementPercentage);
  const StatusIcon = achievementStatus.icon;

  const metricsCards = [
    {
      label: 'Expected Deals',
      value: metrics.expectedDeals,
      subValue: `from ${metrics.hotLeads} hot leads`,
      icon: Target,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      trend: metrics.dealsGrowth,
      trendPositive: metrics.dealsGrowth > 0
    },
    {
      label: 'Projected Revenue',
      value: `₹${(metrics.projectedRevenue / 10000000).toFixed(2)}Cr`,
      subValue: `Target: ₹${(metrics.targetRevenue / 10000000).toFixed(2)}Cr`,
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      trend: metrics.revenueGrowth,
      trendPositive: metrics.revenueGrowth > 0
    },
    {
      label: 'Achievement Rate',
      value: `${metrics.achievementPercentage.toFixed(1)}%`,
      subValue: achievementStatus.text.includes('green') ? 'On Track' : 
                achievementStatus.text.includes('yellow') ? 'Needs Attention' : 'Behind Target',
      icon: Percent,
      color: achievementStatus.bg.includes('green') ? 'green' : 
             achievementStatus.bg.includes('yellow') ? 'yellow' : 'red',
      bgColor: achievementStatus.bg,
      textColor: achievementStatus.text,
      showStatus: true,
      StatusIcon: StatusIcon
    },
    {
      label: 'Active Forecasts',
      value: metrics.activeForecasts,
      subValue: `${metrics.inactiveForecasts} inactive`,
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      trend: null
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsCards.map((metric, idx) => {
        const Icon = metric.icon;
        
        return (
          <div 
            key={idx}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {metric.value}
                  </h3>
                  {metric.showStatus && metric.StatusIcon && (
                    <metric.StatusIcon className={`w-5 h-5 ${metric.textColor}`} />
                  )}
                </div>
              </div>
              
              <div className={`p-3 ${metric.bgColor} rounded-xl`}>
                <Icon className={`w-6 h-6 ${metric.textColor}`} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">
                {metric.subValue}
              </p>
              
              {metric.trend !== null && metric.trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  metric.trendPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp 
                    className={`w-3 h-3 ${metric.trendPositive ? '' : 'rotate-180'}`} 
                  />
                  <span>{Math.abs(metric.trend)}%</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PerformanceMetrics;