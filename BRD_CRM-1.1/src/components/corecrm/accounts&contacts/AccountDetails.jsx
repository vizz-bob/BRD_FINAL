// AccountDetails.jsx
import React, { useState } from 'react';
import { 
  X, Building2, MapPin, FileText, Users, 
  Briefcase, Edit, Trash2, TrendingUp, Phone, Mail
} from 'lucide-react';
import AccountTreeView from './AccountTreeView';
import AssociatedContacts from './AssociatedContacts';

const AccountDetails = ({ account, allAccounts, onClose, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'hierarchy', label: 'Hierarchy', icon: TrendingUp },
    { id: 'contacts', label: 'Contacts', icon: Users }
  ];

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-600';
  };

  const getAccountTypeColor = (type) => {
    const colors = {
      'Employer': 'bg-blue-100 text-blue-700',
      'Partner': 'bg-purple-100 text-purple-700',
      'Vendor': 'bg-orange-100 text-orange-700',
      'Client': 'bg-indigo-100 text-indigo-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{account.companyName}</h3>
              <p className="text-blue-100 text-sm">{account.id}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(account.status)}`}>
            {account.status}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full ${getAccountTypeColor(account.accountType)}`}>
            {account.accountType}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
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

      {/* Tab Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="p-6 space-y-4">
            {/* Industry & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Industry</p>
                <p className="text-sm font-medium text-gray-900">{account.industry}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Account Type</p>
                <p className="text-sm font-medium text-gray-900">{account.accountType}</p>
              </div>
            </div>

            {/* Tax Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Tax Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">GST Number</p>
                    <p className="font-medium text-gray-900">{account.gstNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">PAN Number</p>
                    <p className="font-medium text-gray-900">{account.panNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            {account.address && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Address</h4>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-900">{account.address}</span>
                </div>
              </div>
            )}

            {/* Stats */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-500">Contacts</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{account.associatedContacts}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-500">Active Deals</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{account.activeDeals}</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Info</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Assigned To</span>
                  <span className="font-medium text-gray-900">{account.assignedTo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created By</span>
                  <span className="font-medium text-gray-900">{account.createdBy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created At</span>
                  <span className="font-medium text-gray-900">
                    {new Date(account.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hierarchy' && (
          <AccountTreeView account={account} allAccounts={allAccounts} />
        )}

        {activeTab === 'contacts' && (
          <AssociatedContacts accountId={account.id} />
        )}
      </div>
    </div>
  );
};

export default AccountDetails;