// ThirdPartyLeadsDashboard.jsx – API-integrated dashboard with live stats
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Upload, Users, UserPlus, RefreshCw, Database,
  TrendingUp, Star, CheckCircle
} from 'lucide-react';
import UploadData from './UploadData';
import AllocateData from './AllocateData';
import ReallocateData from './ReallocateData';
import AllData from './AllData';
import { ThirdPartyLeadService } from '../../../services/dataAndLeads.service';

// ─── helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_STATS = {
  total:      { value: '—', change: '' },
  highQuality:{ value: '—', change: '' },
  conversion: { value: '—', change: '' },
  qualified:  { value: '—', change: '' },
};

const computeStats = (leads = []) => {
  const total      = leads.length;
  const highQ      = leads.filter((l) => l.lead_quality?.toUpperCase() === 'HIGH').length;
  const qualified  = leads.filter((l) => l.lead_status === 'QUALIFIED').length;
  const hot        = leads.filter((l) => l.lead_status === 'HOT').length;
  const convRate   = total > 0 ? (((qualified + hot) / total) * 100).toFixed(1) : '0.0';
  const highQPct   = total > 0 ? ((highQ / total) * 100).toFixed(0) : '0';

  return {
    total:       { value: total.toLocaleString(),     change: `${total} leads total` },
    highQuality: { value: highQ.toLocaleString(),     change: `${highQPct}% of total` },
    conversion:  { value: `${convRate}%`,             change: 'Qualified + Hot leads' },
    qualified:   { value: qualified.toLocaleString(), change: `${hot} hot leads` },
  };
};

// ─── tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'upload',     label: 'Upload Data',     icon: Upload,    path: 'upload'     },
  { id: 'allocate',   label: 'Allocate Data',   icon: UserPlus,  path: 'allocate'   },
  { id: 'reallocate', label: 'Reallocate Data', icon: RefreshCw, path: 'reallocate' },
  { id: 'all',        label: 'All Data',        icon: Database,  path: 'all'        },
];

// ─── component ────────────────────────────────────────────────────────────────

const ThirdPartyLeadsDashboard = () => {
  const location = useLocation();

  const [activeTab, setActiveTab]   = useState('upload');
  const [stats, setStats]           = useState(DEFAULT_STATS);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── sync tab with URL ──────────────────────────────────────────────────────
  useEffect(() => {
    const last  = location.pathname.split('/').pop();
    const valid = TABS.map((t) => t.path);
    if (valid.includes(last)) setActiveTab(last);
  }, [location.pathname]);

  // ── fetch stats ────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res  = await ThirdPartyLeadService.list();
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setStats(computeStats(data));
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      // Keep default "—" values on error; don't crash the dashboard
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ── stat card config (label / icon / colours) ─────────────────────────────
  const statCards = [
    {
      key:       'total',
      label:     'Total Vendor Leads',
      icon:      Users,
      bgColor:   'bg-indigo-100',
      textColor: 'text-indigo-600',
    },
    {
      key:       'highQuality',
      label:     'High Quality Leads',
      icon:      Star,
      bgColor:   'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      key:       'conversion',
      label:     'Conversion Rate',
      icon:      TrendingUp,
      bgColor:   'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      key:       'qualified',
      label:     'Qualified Leads',
      icon:      CheckCircle,
      bgColor:   'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Title row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Third Party Vendor Leads
                </h1>
                <p className="text-sm text-gray-500">
                  Manage and track leads from external vendors and agencies
                </p>
              </div>
            </div>

            {/* Refresh stats button */}
            <button
              onClick={fetchStats}
              disabled={statsLoading}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(({ key, label, icon: Icon, bgColor, textColor }) => {
              const { value, change } = stats[key];
              return (
                <div
                  key={key}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className={`text-xl font-bold text-gray-900 mb-1 ${statsLoading ? 'opacity-40' : ''}`}>
                        {statsLoading ? '…' : value}
                      </p>
                      <p className="text-xs text-gray-600">{change}</p>
                    </div>
                    <div className={`p-4 ${bgColor} rounded-lg`}>
                      <Icon className={`w-6 h-6 ${textColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-1 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon, path }) => {
              const isActive = activeTab === path;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(path)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === 'upload'     && <UploadData     onUploadSuccess={fetchStats} />}
        {activeTab === 'allocate'   && <AllocateData   onAllocateSuccess={fetchStats} />}
        {activeTab === 'reallocate' && <ReallocateData onReallocateSuccess={fetchStats} />}
        {activeTab === 'all'        && <AllData        onStatusChange={fetchStats} />}
      </div>
    </div>
  );
};

export default ThirdPartyLeadsDashboard;
