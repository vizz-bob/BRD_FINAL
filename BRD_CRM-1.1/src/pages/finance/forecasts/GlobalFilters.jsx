// GlobalFilters.jsx
import React, { useEffect, useState } from 'react';
import { Calendar, Filter, X, Check } from 'lucide-react';

const GlobalFilters = ({ filters, setFilters, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const periods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const forecastTypes = [
    { value: 'sales', label: 'Sales Forecast' },
    { value: 'recovery', label: 'Recovery Forecast' }
  ];

  const products = [
    { value: 'all', label: 'All Products' },
    { value: 'home-loan', label: 'Home Loan' },
    { value: 'personal-loan', label: 'Personal Loan' },
    { value: 'car-loan', label: 'Car Loan' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'business-loan', label: 'Business Loan' }
  ];

  const campaigns = [
    { value: 'all', label: 'All Campaigns' },
    { value: 'email', label: 'Email Campaigns' },
    { value: 'sms', label: 'SMS Campaigns' },
    { value: 'dialer', label: 'Dialer Campaigns' },
    { value: 'whatsapp', label: 'WhatsApp Campaigns' }
  ];

  const teams = [
    { value: 'all', label: 'All Teams' },
    { value: 'team-a', label: 'Team A' },
    { value: 'team-b', label: 'Team B' },
    { value: 'team-c', label: 'Team C' }
  ];

  const handleApply = () => {
    setFilters(localFilters);
    if (onApply) onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      period: 'monthly',
      dateRange: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      },
      product: 'all',
      campaign: 'all',
      team: 'all',
      forecastType: 'sales'
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    if (onApply) onApply(resetFilters);
  };

  const getDateRangeByPeriod = (period) => {
    const today = new Date();
    let start, end;

    switch (period) {
      case 'monthly':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'quarterly':
        const currentQuarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), currentQuarter * 3, 1);
        end = new Date(today.getFullYear(), (currentQuarter + 1) * 3, 0);
        break;
      case 'yearly':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    return { start, end };
  };

  const handlePeriodChange = (period) => {
    const newDateRange = getDateRangeByPeriod(period);
    setLocalFilters({
      ...localFilters,
      period,
      dateRange: newDateRange
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      {/* Primary Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Forecast Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Forecast Type
          </label>
          <select
            value={localFilters.forecastType}
            onChange={(e) => setLocalFilters({ ...localFilters, forecastType: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {forecastTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Period */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Period
          </label>
          <select
            value={localFilters.period}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Display */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {formatDate(localFilters.dateRange.start)} - {formatDate(localFilters.dateRange.end)}
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        <Filter className="w-4 h-4" />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
          {/* Product Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Product
            </label>
            <select
              value={localFilters.product}
              onChange={(e) => setLocalFilters({ ...localFilters, product: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {products.map(product => (
                <option key={product.value} value={product.value}>
                  {product.label}
                </option>
              ))}
            </select>
          </div>

          {/* Campaign Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Campaign
            </label>
            <select
              value={localFilters.campaign}
              onChange={(e) => setLocalFilters({ ...localFilters, campaign: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {campaigns.map(campaign => (
                <option key={campaign.value} value={campaign.value}>
                  {campaign.label}
                </option>
              ))}
            </select>
          </div>

          {/* Team Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Team / User
            </label>
            <select
              value={localFilters.team}
              onChange={(e) => setLocalFilters({ ...localFilters, team: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {teams.map(team => (
                <option key={team.value} value={team.value}>
                  {team.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleApply}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          <Check className="w-4 h-4" />
          Apply Filters
        </button>
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
        >
          <X className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default GlobalFilters;