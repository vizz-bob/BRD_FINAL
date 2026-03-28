import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Archive, FolderLock, RefreshCw, Database,
  Shield, AlertCircle, TrendingDown, Loader2,
} from 'lucide-react';
import AllocateData from './AllocateData';
import ReallocateData from './ReallocateData';
import AllData from './AllData';
import { ArchivedLeadService } from "../../../services/dataAndLeads.service";

const ArchivedLeadsDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('allocate');
  const [stats, setStats] = useState({ total: 0, compliant: 0, fraudInvalid: 0, reactivationRate: '0%', reactivatedCount: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const tabs = [
    { id: 'allocate',   label: 'Allocate Data',   icon: FolderLock, path: 'allocate' },
    { id: 'reallocate', label: 'Reallocate Data',  icon: RefreshCw,  path: 'reallocate' },
    { id: 'all',        label: 'All Data',          icon: Database,   path: 'all' },
  ];

  useEffect(() => {
    const last = location.pathname.split('/').pop();
    if (tabs.map((t) => t.path).includes(last)) setActiveTab(last);
  }, [location.pathname]);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const [allRes, reactivatedRes] = await Promise.all([
          ArchivedLeadService.list(),
          ArchivedLeadService.allData({ is_reactivated: 'true' }),
        ]);

        const allData = allRes.data;
        const reactivatedData = reactivatedRes.data;

        const fullList = Array.isArray(allData) ? allData : allData.results || [];
        const total = Array.isArray(allData) ? fullList.length : allData.count || fullList.length;

        const reactivatedList = Array.isArray(reactivatedData) ? reactivatedData : reactivatedData.results || [];
        const reactivatedCount = Array.isArray(reactivatedData) ? reactivatedData.length : reactivatedData.count || reactivatedList.length;

        const fraudInvalid = fullList.filter(
          (l) => l.archived_reason === 'invalid' || l.archived_reason === 'fraud' || l.compliance_flag === 'Critical'
        ).length;
        const compliant = total - fraudInvalid;
        const rate = total > 0 ? `${((reactivatedCount / total) * 100).toFixed(1)}%` : '0%';

        setStats({ total, compliant, fraudInvalid, reactivationRate: rate, reactivatedCount });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Archived Leads',
      value: stats.total.toLocaleString(),
      icon: Archive,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: 'All time',
    },
    {
      label: 'Compliance Ready',
      value: stats.compliant.toLocaleString(),
      icon: Shield,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      change: stats.total > 0 ? `${((stats.compliant / stats.total) * 100).toFixed(1)}% compliant` : '—',
    },
    {
      label: 'Fraud / Invalid',
      value: stats.fraudInvalid.toLocaleString(),
      icon: AlertCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      change: stats.total > 0 ? `${((stats.fraudInvalid / stats.total) * 100).toFixed(1)}% of total` : '—',
    },
    {
      label: 'Reactivation Rate',
      value: stats.reactivationRate,
      icon: TrendingDown,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: `${stats.reactivatedCount} leads reactivated`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Archive className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Archived Leads (Compliance)</h1>
              <p className="text-sm text-gray-500">
                Secure storage for inactive leads with full audit trail and compliance tracking
              </p>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-indigo-900 mb-1">
                  Compliance &amp; Data Retention
                </h3>
                <p className="text-xs text-indigo-700">
                  All archived leads are retained for regulatory compliance (1 year minimum). Data
                  is read-only and requires manager authorization for reactivation.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900 mb-1">
                        {statsLoading ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : stat.value}
                      </p>
                      <p className="text-xs text-gray-600">{stat.change}</p>
                    </div>
                    <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                      <Icon className={`w-4 h-4 ${stat.textColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.path;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.path)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-gray-600 text-gray-900 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === 'allocate'   && <AllocateData />}
        {activeTab === 'reallocate' && <ReallocateData />}
        {activeTab === 'all'        && <AllData />}
      </div>
    </div>
  );
};

export default ArchivedLeadsDashboard;
