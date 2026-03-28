import React, { useState } from 'react';
import { 
  FileText, TrendingUp, CheckCircle, XCircle,
  Clock, DollarSign, Users, AlertCircle,
  Plus, Download, Filter, History
} from 'lucide-react';
import LoanApplication from './LoanApplication';
import ApplicationStatus from './ApplicationStatus';
import Loans from './Loans';

const DealsDashboardCore = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [selectedItem, setSelectedItem] = useState(null);
  const [mobileView, setMobileView] = useState('list');

  const stats = [
    { label: 'Total Applications', value: '156', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Approved This Month', value: '42', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Under Review', value: '28', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Total Disbursed', value: '₹12.5Cr', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="bg-white border-b border-gray-100 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg shadow-lg">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Deals Module</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Loan Origination System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-all">
               <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-800 shadow-lg shadow-slate-200 transition-all">
               <Plus className="w-4 h-4" /> New Application
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
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

      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-8">
          <button 
            onClick={() => {setActiveTab('applications'); setSelectedItem(null);}} 
            className={`flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === 'applications' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <FileText className="w-4 h-4" /> <span className="text-sm">Loan Applications</span>
          </button>
          <button 
            onClick={() => {setActiveTab('status'); setSelectedItem(null);}} 
            className={`flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === 'status' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <Clock className="w-4 h-4" /> <span className="text-sm">Application Status</span>
          </button>
          <button 
            onClick={() => {setActiveTab('loans'); setSelectedItem(null);}} 
            className={`flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === 'loans' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <CheckCircle className="w-4 h-4" /> <span className="text-sm">Disbursed Loans</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[650px]">
          <div className={`${mobileView === 'list' ? 'block' : 'hidden'} lg:block flex-1 h-full`}>
            {activeTab === 'applications' && <LoanApplication onSelect={(item) => { setSelectedItem(item); setMobileView('details'); }} selectedId={selectedItem?.id} />}
            {activeTab === 'status' && <ApplicationStatus onSelect={(item) => { setSelectedItem(item); setMobileView('details'); }} selectedId={selectedItem?.id} />}
            {activeTab === 'loans' && <Loans onSelect={(item) => { setSelectedItem(item); setMobileView('details'); }} selectedId={selectedItem?.id} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DealsDashboardCore;