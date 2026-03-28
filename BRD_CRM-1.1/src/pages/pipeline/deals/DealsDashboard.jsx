import React, { useState } from 'react';
import { 
  Briefcase,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import LoanApplication from './LoanApplication';
import ApplicationStatus from './ApplicationStatus';
import LoansTable from './LoansTable';


// Main Dashboard Component
const DealsDashboard = () => {
  const [activeTab, setActiveTab] = useState('loan-application');

  const tabs = [
    { id: 'loan-application', label: 'Loan Application', icon: FileText },
    { id: 'application-status', label: 'Application Status', icon: TrendingUp },
    { id: 'loans', label: 'Loans (Disbursed)', icon: CheckCircle }
  ];

  const stats = [
    {
      label: 'Total Applications',
      value: '234',
      icon: FileText,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: '+12 this week'
    },
    {
      label: 'Under Review',
      value: '45',
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      change: 'Processing'
    },
    {
      label: 'Approved',
      value: '178',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      change: '76% approval rate'
    },
    {
      label: 'Total Disbursed',
      value: '₹45.2 Cr',
      icon: DollarSign,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: 'This month'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-2xl">
              <Briefcase className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Deals (Conversion/Disbursed)</h1>
              <p className="text-sm text-gray-500">Stage 7: Final conversion and loan disbursement tracking</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow">


                  <div className="flex items-center justify-between">
                    <div>
                       <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                       <p className="text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
                       <p className="text-xs text-gray-600">{stat.change}</p>
                    </div>
                    <div className={`p-4 ${stat.bgColor} rounded-xl`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>





                  <div className="flex items-center justify-between mb-2">
                    
                  </div>
                 
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
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
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 font-medium'
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
        {activeTab === 'loan-application' && <LoanApplication />}
        {activeTab === 'application-status' && <ApplicationStatus />}
        {activeTab === 'loans' && <LoansTable />}
      </div>
    </div>
  );
};

export default DealsDashboard;