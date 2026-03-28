import React, { useEffect, useState } from 'react';
import {
  Database,
  Filter,
  ShieldCheck,
  UserCheck,
  Activity,
  ClipboardCheck
} from 'lucide-react';



import RawPoolTable from './RawPoolTable';
import ValidationRules from './ValidationRules';
// import ManualEntryForm from '../../data&lead/bulkdataupload/ManualEntryForm';
import SuppressionList from './SuppressionList';
import { rawLeadsPoolService } from '../../../services/pipelineService';


const DataIngestionDashboard = () => {
  const [activeTab, setActiveTab] = useState('pool');

  const tabs = [
    { id: 'pool', label: 'Raw Lead Pool', icon: Database },
    { id: 'rules', label: 'Validation Rules', icon: Filter },
    { id: 'suppression', label: 'Suppression List', icon: ShieldCheck }
  ];

  const data = [
    { label: 'Total Raw Pool', value: '42,892', icon: Database, color: 'indigo', change: 'Stage 1 Entry' },
    { label: 'Validation Pass', value: '94.2%', icon: ClipboardCheck, color: 'green', change: '+2.1% hygiene' },
    { label: 'Pending Assignment', value: '1,204', icon: UserCheck, color: 'purple', change: 'Ready for Stage 2' },
    { label: 'Suppressed Leads', value: '892', icon: ShieldCheck, color: 'red', change: 'No Consent' }
  ];

  const [stats, setStats] = useState(data)

  const fetchStats = async () => {
    const res = await rawLeadsPoolService.stats()
    const backendData = res.data
    const iconMap = {
      "Total Raw Pool": Database,
      "Validation Pass": ClipboardCheck,
      "Pending Assignment": UserCheck,
      "Suppressed Leads": ShieldCheck
    };
    const colorMap = {
      "Total Raw Pool": "indigo",
      "Validation Pass": "green",
      "Pending Assignment": "purple",
      "Suppressed Leads": "red"
    };
    const formattedStats = backendData.map(stat => ({
      ...stat,
      icon: iconMap[stat.label],
      color: colorMap[stat.label]
    }));
    setStats(formattedStats)
  }
  useEffect(() => {
    fetchStats()
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stage 1: Data Ingestion</h1>
              <p className="text-sm text-gray-500">
                Initial "Raw Pool" verify, deduplicate, and assign leads before sales engagement.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{stat.change}</p>
                  </div>
                  <div className={`p-4 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-all text-sm font-medium ${activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
          {activeTab === 'pool' && <RawPoolTable />}
          {activeTab === 'rules' && <ValidationRules />}
          {activeTab === 'suppression' && <SuppressionList />}
        </div>
      </div>
    </div>
  );
};

export default DataIngestionDashboard;