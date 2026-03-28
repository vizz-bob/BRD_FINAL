// ForecastsDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, Target, DollarSign, AlertTriangle, 
  Download, RefreshCw, Calendar, BarChart3, Settings
} from 'lucide-react';
import GlobalFilters from './GlobalFilters';
import PerformanceMetrics from './PerformanceMetrics';
import FunnelChart from './FunnelChart';
import ProjectionTrends from './ProjectionTrends.jsx';
import LeadSourceBreakdown from './LeadSourceBreakdown';
import ForecastTable from './ForecastTable';
import ExportModal from './ExportModal';
import ForecastGapAlert from './ForecastGapAlert';
import ForecastCrudPanel from './ForecastCrudPanel';
import { ForecastService } from '../../../services/financeService';


const ForecastsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState({
    period: 'monthly',
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    },
    product: 'all',
    campaign: 'all',
    team: 'all',
    forecastType: 'sales'
  });

  // Data States
  const [forecastData, setForecastData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [showGapAlert, setShowGapAlert] = useState(false);

  const getPeriodParam = (period) => {
    if (period === 'monthly') return 'WEEKLY';
    if (period === 'quarterly') return 'MONTHLY';
    return 'MONTHLY';
  };

  const loadForecastData = useCallback(async (activeFilters) => {
    setIsRefreshing(true);
    try {
      const filtersToUse = activeFilters || filters;
      const periodParam = getPeriodParam(filtersToUse.period);
      const [overviewRes, funnelRes, campaignRes, trendsRes, agentsRes, forecastsRes] = await Promise.all([
        ForecastService.overview(),
        ForecastService.leadFunnel(),
        ForecastService.campaignBreakdown(),
        ForecastService.trends(periodParam),
        ForecastService.agentPerformance(),
        ForecastService.getAll(),
      ]);

      const overview = overviewRes.data;
      const funnelRaw = funnelRes.data;
      const campaigns = campaignRes.data;
      const trendsRaw = trendsRes.data;
      const agents = agentsRes.data;
      const forecasts = forecastsRes.data || [];

      // --- metrics shape expected by PerformanceMetrics ---
      const metrics = {
        expectedDeals: overview.expected_deals,
        hotLeads: overview.expected_deals,
        projectedRevenue: Number(overview.projected_revenue),
        targetRevenue: Number(overview.target_revenue),
        achievementPercentage: overview.achievement_rate,
        dealsGrowth: 0,
        revenueGrowth: 0,
        activeForecasts: overview.active_forecasts,
        inactiveForecasts: 0,
      };

      // --- funnel shape expected by FunnelChart ---
      const funnelData = {
        rawLeads: funnelRaw.rawLeads || 0,
        qualifiedLeads: funnelRaw.qualifiedLeads || 0,
        hotLeads: funnelRaw.hotLeads || 0,
        followUp: funnelRaw.followUp || 0,
        deals: funnelRaw.deals || 0,
      };

      // --- source shape expected by LeadSourceBreakdown ---
      const total = campaigns.reduce((s, c) => s + c.leads, 0) || 1;
      const sourceData = campaigns.map((c) => ({
        source: c.campaign,
        count: c.leads,
        revenue: c.revenue,
        percentage: parseFloat(((c.leads / total) * 100).toFixed(1)),
      }));

      // --- trends shape expected by ProjectionTrends ---
      const trendsData = trendsRaw.length
        ? trendsRaw.map((t, i) => ({
            period: `W${i + 1}`,
            date: t.label,
            target: Number(t.target || 0),
            achieved: Number(t.value || 0),
          }))
        : forecasts
            .slice()
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
            .map((f, i) => ({
              period: `F${i + 1}`,
              date: f.start_date,
              target: Number(f.target_revenue || 0),
              achieved: 0,
            }));

      // --- agent table shape expected by ForecastTable ---
      const agentData = agents.length
        ? agents.map((a) => ({
            name: a.agent,
            team: a.team || 'Sales',
            target: Number(a.target || 0),
            achieved: Number(a.achieved || 0),
            achievementPercentage: Number(a.achievement_percent || 0),
            variance: Number(a.variance || 0),
            hotLeads: Number(a.expected_deals || 0),
            expectedDeals: Number(a.expected_deals || 0),
            lastUpdated: a.last_updated || '-',
          }))
        : forecasts.map((f) => ({
            name: f.name,
            team: f.period,
            target: Number(f.target_revenue || 0),
            achieved: 0,
            achievementPercentage: 0,
            variance: -Number(f.target_revenue || 0),
            hotLeads: 0,
            expectedDeals: 0,
            lastUpdated: f.created_at || '-',
          }));

      setMetricsData(metrics);
      setForecastData({ funnelData, sourceData, trendsData, agentData });

      // Gap alert: if achievement <60% after 20th of month
      const today = new Date();
      if (today.getDate() >= 20 && metrics.achievementPercentage < 60) {
        setShowGapAlert(true);
      }
    } catch (error) {
      console.error('Error loading forecast data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadForecastData(filters);
  }, [filters, loadForecastData]);

  const handleRefresh = () => {
    if (!isRefreshing) loadForecastData(filters);
  };

  const handleExport = (format, options = {}) => {
    setShowExportModal(false);
    const backendFormat = format === 'excel' ? 'excel' : 'csv';
    const fileExt = format === 'excel' ? 'xlsx' : 'csv';
    ForecastService.exportAgents(backendFormat, options)
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `forecast_agents.${fileExt}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 150);
      })
      .catch((err) => console.error('Export failed', err));
  };

  const tabs = [
    { id: 'overview',  label: 'Overview',          icon: BarChart3  },
    { id: 'detailed',  label: 'Detailed Analysis',  icon: Target     },
    { id: 'trends',    label: 'Trends',             icon: TrendingUp },
    { id: 'manage',    label: 'Manage Forecasts',   icon: Settings   },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  Forecasts - Performance Intelligence
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Predictive insights for revenue projections and pipeline analysis
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gap Alert */}
      {showGapAlert && (
        <ForecastGapAlert 
          achievementPercentage={metricsData?.achievementPercentage || 0}
          onClose={() => setShowGapAlert(false)}
        />
      )}

      {/* Global Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <GlobalFilters 
            filters={filters} 
            setFilters={setFilters}
            onApply={(nextFilters) => setFilters(nextFilters)}
          />
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {isRefreshing && activeTab !== 'manage' ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-gray-600">Loading forecast data...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <PerformanceMetrics metrics={metricsData} filters={filters} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FunnelChart data={forecastData?.funnelData} />
                  <LeadSourceBreakdown data={forecastData?.sourceData} />
                </div>
              </div>
            )}

            {activeTab === 'detailed' && (
              <div className="space-y-6">
                <ForecastTable 
                  data={forecastData?.agentData} 
                  filters={filters}
                  detailed={true}
                  onExport={handleExport}
                />
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-6">
                <ProjectionTrends 
                  data={forecastData?.trendsData} 
                  filters={filters}
                  expanded={true}
                />
              </div>
            )}

            {activeTab === 'manage' && (
              <ForecastCrudPanel onDataChange={loadForecastData} />
            )}
          </>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          filters={filters}
        />
      )}
    </div>
  );
};

export default ForecastsDashboard;
