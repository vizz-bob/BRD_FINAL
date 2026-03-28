// ContactsAccountsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, UserPlus, Plus, 
  TrendingUp, AlertCircle, Search, Filter,
  Upload, Download
} from 'lucide-react';
import ContactsView from './ContactsView';
import AccountsView from './AccountsView';
import { getContactStats } from '../../../services/coreCRMService';


const ContactsAccountsDashboard = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalAccounts: 0,
    activeContacts: 0,
    dormantContacts: 0,
    newThisMonth: 0,
    linkedAccounts: 0
  });

  // Mock stats - replace with API call
  

  async function fetchStats() {
    const res = await getContactStats()
    setStats(res.data)
  }

  useEffect(() => {
    fetchStats()
  }, []);

  const tabs = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'accounts', label: 'Accounts', icon: Building2 }
  ];

  const statsCards = [
    {
      label: 'Total Contacts',
      value: stats.totalContacts.toLocaleString(),
      icon: Users,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: `+${stats.newThisMonth} this month`
    },
    {
      label: 'Total Accounts',
      value: stats.totalAccounts.toString(),
      icon: Building2,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      change: 'Organizations'
    },
    {
      label: 'Active Contacts',
      value: stats.activeContacts.toLocaleString(),
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      change: '87% of total'
    },
    {
      label: 'Dormant Contacts',
      value: stats.dormantContacts.toString(),
      icon: AlertCircle,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      change: 'Requires attention'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-2xl">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Contacts & Accounts
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your contact directory and organizations
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button> */}
              {/* <button 
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                <Plus className="w-5 h-5" />
                Add {activeTab === 'contacts' ? 'Contact' : 'Account'}
              </button> */}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 ${stat.bgColor} rounded-xl`}>
                      <Icon className={`w-4 h-4 ${stat.textColor}`} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.change}</p>
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
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
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

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === 'contacts' && <ContactsView />}
        {activeTab === 'accounts' && <AccountsView />}
      </div>
    </div>
  );
};

export default ContactsAccountsDashboard;