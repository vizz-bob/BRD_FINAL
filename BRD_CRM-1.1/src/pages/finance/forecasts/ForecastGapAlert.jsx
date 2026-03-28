// ForecastGapAlert.jsx
import React from 'react';
import { AlertTriangle, X, TrendingDown, Target } from 'lucide-react';

const ForecastGapAlert = ({ achievementPercentage, onClose }) => {
  const today = new Date();
  const dayOfMonth = today.getDate();
  
  const getUrgencyLevel = () => {
    if (achievementPercentage < 40) return 'critical';
    if (achievementPercentage < 60) return 'warning';
    return 'info';
  };

  const urgency = getUrgencyLevel();

  const urgencyConfig = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      title: '🚨 Critical Forecast Gap Alert',
      message: 'Team performance is significantly below target. Immediate action required.'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-900',
      title: '⚠️ Forecast Gap Alert',
      message: 'Team performance is below expected levels. Strategic intervention needed.'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      title: 'ℹ️ Performance Notice',
      message: 'Monitor team performance closely to maintain targets.'
    }
  };

  const config = urgencyConfig[urgency];

  const recommendations = [
    {
      icon: Target,
      title: 'Review Target Strategy',
      description: 'Reassess monthly targets and adjust based on current pipeline'
    },
    {
      icon: TrendingDown,
      title: 'Analyze Drop-off Points',
      description: 'Identify where leads are being lost in the funnel'
    },
    {
      icon: AlertTriangle,
      title: 'Increase Follow-ups',
      description: 'Accelerate engagement with hot leads to boost conversions'
    }
  ];

  return (
    <div className={`mx-4 lg:mx-8 mt-4 rounded-2xl border-2 ${config.border} ${config.bg} overflow-hidden`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 ${config.iconBg} rounded-xl`}>
              <AlertTriangle className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${config.textColor} mb-1`}>
                {config.title}
              </h3>
              <p className="text-sm text-gray-600">
                {config.message}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Current Achievement</p>
            <p className={`text-2xl font-bold ${config.textColor}`}>
              {achievementPercentage.toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Gap to Target</p>
            <p className="text-2xl font-bold text-red-600">
              {(100 - achievementPercentage).toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Days Remaining</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - dayOfMonth}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">
            Recommended Actions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.map((rec, idx) => {
              const Icon = rec.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                      <Icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {rec.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Alert triggered: Day {dayOfMonth} of the month • Achievement below 60%
          </p>
          <button
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
          >
            View Detailed Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForecastGapAlert;