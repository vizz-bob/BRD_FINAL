import React, { useState } from 'react';
import { 
  Receipt, PhoneForwarded, History, Banknote, 
  BarChart3, Plus, FileText, TrendingUp,
  AlertCircle, ShieldCheck, Zap,
  Gavel
} from 'lucide-react';
import RepaymentLedgerList from './RepaymentLedgerList';
import CollectionsBucketList from './CollectionsBucketList';
import FinancialAccountDetails from './FinancialAccountDetails';
import RecoveryModuleList from './RecoveryModuleList';


const RepaymentsDashboard = () => {
  const [activeTab, setActiveTab] = useState('repayments'); 
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [mobileView, setMobileView] = useState('list');

  // Analytical & Forecasting Data Points
  const stats = [
    { label: 'Projected Revenue', value: 'NA', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Expected Recovery %', value: 'NA', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Active Collections', value: 'NA', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'SLA Overdue', value: 'NA', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0 font-sans">
      {/* Header & Integration Actions */}
      <div className="bg-white border-b border-gray-100 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg shadow-lg">
              <History className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Repayments & Collections</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Stage 7: Financial Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-all">
               <FileText className="w-4 h-4" /> Generate Schedule
            </button>
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-800 shadow-lg shadow-slate-200 transition-all">
               <Plus className="w-4 h-4" /> Log Manual Payment
            </button>
          </div>
        </div>

        {/* Analytical Forecasting Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                <div className={`p-4 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-8">
          <button onClick={() => {setActiveTab('repayments'); setSelectedAccount(null);}} className={`flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === 'repayments' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            <Receipt className="w-4 h-4" /> <span className="text-sm">Repayment Ledger</span>
          </button>
          <button onClick={() => {setActiveTab('collections'); setSelectedAccount(null);}} className={`flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === 'collections' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            <PhoneForwarded className="w-4 h-4" /> <span className="text-sm">Collections Bucket</span>
          </button>
          <button onClick={() => {setActiveTab('recovery'); setSelectedAccount(null);}} className={`flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === 'recovery' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            <Gavel className="w-4 h-4" /> <span className="text-sm">Recovery Module</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[650px]">
          <div className={`${mobileView === 'list' ? 'block' : 'hidden'} lg:block flex-1 h-full`}>
            {activeTab === 'repayments' && <RepaymentLedgerList onSelect={(acc) => { setSelectedAccount(acc); setMobileView('details'); }} selectedId={selectedAccount?.id} />}
            {activeTab === 'collections' && <CollectionsBucketList onSelect={(acc) => { setSelectedAccount(acc); setMobileView('details'); }} selectedId={selectedAccount?.id} />}
            {activeTab === 'recovery' && <RecoveryModuleList onSelect={(acc) => { setSelectedAccount(acc); setMobileView('details'); }} selectedId={selectedAccount?.id} />}
          </div>
          <div className={`${mobileView === 'details' ? 'block' : 'hidden'} lg:block w-full lg:w-[420px] h-full`}>
            <FinancialAccountDetails account={selectedAccount} mode={activeTab} onBack={() => setMobileView('list')} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepaymentsDashboard;