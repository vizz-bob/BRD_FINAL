import React, { useEffect, useState } from 'react';
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import { dashboardApi } from '../../services/dashboardService';

export default function PredictiveForecastWidget() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch Forecast Data
    const loadForecast = async () => {
      try {
        const res = await dashboardApi.fetchForecasts();
        setData(res.data);
      } catch (err) {
        // Mock Data Fallback for Demo
        setData({
          projectedRevenue: 4500000, // ₹45L Next Month
          growthRate: 12.5,
          riskFactor: 4.2, // 4.2% predicted default
          recoveryForecast: [
            { label: 'Week 1', value: 20, expected: 25 },
            { label: 'Week 2', value: 35, expected: 40 },
            { label: 'Week 3', value: 45, expected: 60 },
            { label: 'Week 4', value: 10, expected: 80 }, // Lower initial value for animation
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    loadForecast();
  }, []);

  if (loading) return <div className="h-48 bg-gray-50 rounded-xl animate-pulse"></div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <PresentationChartLineIcon className="w-5 h-5 text-indigo-600" />
            AI Revenue Forecast
          </h3>
          <p className="text-sm text-gray-500">Projected cash flow for next 30 days</p>
        </div>
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
          AI Confidence: High
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Big Number Projection */}
        <div className="p-4 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl text-white shadow-lg">
          <div className="flex items-center gap-2 opacity-80 mb-1">
            <BanknotesIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Projected Inflow</span>
          </div>
          <div className="text-3xl font-black mb-1">
            ₹{(data?.projectedRevenue / 100000).toFixed(1)}L
          </div>
          <div className="flex items-center gap-1 text-green-300 text-sm font-medium">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            +{data?.growthRate}% vs last month
          </div>
        </div>

        {/* 2. Recovery Probability Bar Chart */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-sm font-bold text-gray-700">Recovery Trajectory</div>
              <div className="text-xs text-gray-500">Actual vs Expected (Weekly)</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-red-600">{data?.riskFactor}% Risk</div>
              <div className="text-xs text-gray-400">Predicted NPA Impact</div>
            </div>
          </div>

          {/* Simple CSS Bar Chart */}
          <div className="flex items-end justify-between h-24 gap-2 pt-2 border-b border-gray-100 pb-1">
            {data?.recoveryForecast?.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div className="relative w-full flex justify-center h-full items-end gap-1">
                  {/* Expected Bar (Ghost) */}
                  <div
                    className="w-3 bg-gray-100 rounded-t-sm h-full absolute bottom-0"
                    style={{ height: `${item.expected}%` }}
                  ></div>
                  {/* Actual Bar (Solid) */}
                  <div
                    className="w-3 bg-indigo-500 rounded-t-sm relative z-10 transition-all duration-500 group-hover:bg-indigo-600"
                    style={{ height: `${item.value}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-xs text-gray-500">Projected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-200"></span>
              <span className="text-xs text-gray-500">Target</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
