import React, { useEffect, useState } from 'react';
import {
  XCircle, Skull, Clock, Ban,
  TrendingDown, AlertTriangle, Users, Archive,
  Plus, Download, Filter,
  AlertCircle
} from 'lucide-react';
import LeadLost from './LeadLost';
import LeadDead from './LeadDead';
import LeadExpired from './LeadExpired';
import LeadRejected from './LeadRejected';
import { leadStatusDashboard } from '../../../services/pipelineService';

const LeadStatusDashboard = () => {
  const [activeTab, setActiveTab] = useState('lost');
  const [selectedItem, setSelectedItem] = useState(null);
  const [stats, setStats] = useState([])

  const fetchSats = async () => {
    try {
      const res = await leadStatusDashboard();
      const data = res.data;

      const updatedStats = [
        { label: 'Lead Lost', value: data.lost, icon: AlertCircle, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: 'Lead Dead', value: data.dead, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
        { label: 'Lead Expired', value: data.expired, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'Lead Rejected', value: data.rejected, icon: Ban, color: 'text-purple-600', bg: 'bg-purple-100' },
      ];

      setStats(updatedStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchSats()
  }, [])

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg shadow-lg">
              <TrendingDown className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Lead Status Management</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Unconverted Lead Tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* <button className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-all">
               <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-800 shadow-lg shadow-slate-200 transition-all">
               <Archive className="w-4 h-4" /> Archive Selected
            </button> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <div className={`p-4 rounded-lg ${stat.bg} ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-8 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('lost'); setSelectedItem(null); }}
            className={`flex items-center gap-2 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'lost' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <AlertCircle className="w-4 h-4" /> <span className="text-sm">Lead Lost</span>
          </button>
          <button
            onClick={() => { setActiveTab('dead'); setSelectedItem(null); }}
            className={`flex items-center gap-2 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'dead' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <XCircle className="w-4 h-4" /> <span className="text-sm">Lead Dead</span>
          </button>
          <button
            onClick={() => { setActiveTab('expired'); setSelectedItem(null); }}
            className={`flex items-center gap-2 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'expired' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <Clock className="w-4 h-4" /> <span className="text-sm">Lead Expired</span>
          </button>
          <button
            onClick={() => { setActiveTab('rejected'); setSelectedItem(null); }}
            className={`flex items-center gap-2 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === 'rejected' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <Ban className="w-4 h-4" /> <span className="text-sm">Lead Rejected</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[650px]">
          <div className="flex-1 h-full">
            {activeTab === 'lost' && <LeadLost onSelect={handleItemSelect} selectedId={selectedItem?.id} />}
            {activeTab === 'dead' && <LeadDead onSelect={handleItemSelect} selectedId={selectedItem?.id} />}
            {activeTab === 'expired' && <LeadExpired onSelect={handleItemSelect} selectedId={selectedItem?.id} />}
            {activeTab === 'rejected' && <LeadRejected onSelect={handleItemSelect} selectedId={selectedItem?.id} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadStatusDashboard;