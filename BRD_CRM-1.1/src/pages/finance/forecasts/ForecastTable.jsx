// ForecastTable.jsx
import React, { useState } from 'react';
import { 
  Search, Filter, ChevronDown, ChevronUp, 
  TrendingUp, TrendingDown, User, AlertCircle,
  CheckCircle, Clock, Download
} from 'lucide-react';

const ForecastTable = ({ data, filters, detailed = false, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'achievementPercentage', direction: 'desc' });
  const [selectedAgents, setSelectedAgents] = useState([]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No forecast data available</p>
        </div>
      </div>
    );
  }

  // Filter data based on search
  const filteredData = data.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getStatusBadge = (percentage) => {
    if (percentage >= 80) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: CheckCircle,
        label: 'On Track'
      };
    } else if (percentage >= 60) {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: Clock,
        label: 'Needs Attention'
      };
    } else {
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: AlertCircle,
        label: 'Behind Target'
      };
    }
  };

  const getVarianceColor = (variance) => {
    if (variance >= 0) return 'text-green-600';
    return 'text-red-600';
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const calculateTotals = () => {
    return sortedData.reduce((acc, agent) => ({
      target: acc.target + agent.target,
      achieved: acc.achieved + agent.achieved,
      variance: acc.variance + agent.variance,
      expectedDeals: acc.expectedDeals + agent.expectedDeals,
      hotLeads: acc.hotLeads + agent.hotLeads
    }), { target: 0, achieved: 0, variance: 0, expectedDeals: 0, hotLeads: 0 });
  };

  const totals = calculateTotals();
  const overallAchievement = totals.target
    ? ((totals.achieved / totals.target) * 100).toFixed(1)
    : '0.0';

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-indigo-600" />
      : <ChevronDown className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Agent Performance Forecast</h3>
            <p className="text-sm text-gray-500 mt-1">
              Individual targets and achievement tracking
            </p>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents or teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => onExport?.('csv', { includeDetails: detailed })}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 mb-1">Total Target</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totals.target)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 mb-1">Total Achieved</p>
            <p className="text-lg font-bold text-indigo-600">{formatCurrency(totals.achieved)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 mb-1">Achievement</p>
            <p className="text-lg font-bold text-green-600">{overallAchievement}%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 mb-1">Expected Deals</p>
            <p className="text-lg font-bold text-gray-900">{totals.expectedDeals}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 mb-1">Total Variance</p>
            <p className={`text-lg font-bold ${getVarianceColor(totals.variance)}`}>
              {totals.variance >= 0 ? '+' : ''}{formatCurrency(totals.variance)}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase hover:text-gray-900"
                >
                  Agent Details
                  <SortIcon columnKey="name" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('target')}
                  className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase hover:text-gray-900"
                >
                  Target
                  <SortIcon columnKey="target" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('achieved')}
                  className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase hover:text-gray-900"
                >
                  Achieved
                  <SortIcon columnKey="achieved" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('achievementPercentage')}
                  className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase hover:text-gray-900"
                >
                  Achievement %
                  <SortIcon columnKey="achievementPercentage" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('variance')}
                  className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase hover:text-gray-900"
                >
                  Variance
                  <SortIcon columnKey="variance" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('expectedDeals')}
                  className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase hover:text-gray-900"
                >
                  Expected Deals
                  <SortIcon columnKey="expectedDeals" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-600 uppercase">
                  Status
                </span>
              </th>
              {detailed && (
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-600 uppercase">
                    Last Updated
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((agent, idx) => {
              const status = getStatusBadge(agent.achievementPercentage);
              const StatusIcon = status.icon;
              
              return (
                <tr 
                  key={idx}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Agent Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.team} • {agent.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Target */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(agent.target)}
                    </p>
                  </td>

                  {/* Achieved */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-indigo-600">
                      {formatCurrency(agent.achieved)}
                    </p>
                  </td>

                  {/* Achievement Percentage */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${
                            agent.achievementPercentage >= 80 ? 'bg-green-500' :
                            agent.achievementPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(agent.achievementPercentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 min-w-[45px]">
                        {agent.achievementPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* Variance */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {agent.variance >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${getVarianceColor(agent.variance)}`}>
                        {agent.variance >= 0 ? '+' : ''}{formatCurrency(agent.variance)}
                      </span>
                    </div>
                  </td>

                  {/* Expected Deals */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{agent.expectedDeals}</p>
                      <p className="text-xs text-gray-500">from {agent.hotLeads} hot leads</p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 ${status.bg} ${status.text} rounded-full text-xs font-medium`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </div>
                  </td>

                  {/* Last Updated (detailed view) */}
                  {detailed && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{agent.lastUpdated}</span>
                      </div>
                      {agent.isInactive && (
                        <p className="text-xs text-red-600 mt-1">⚠️ No updates in 7+ days</p>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {sortedData.length} of {data.length} agents
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg">
              1
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastTable;