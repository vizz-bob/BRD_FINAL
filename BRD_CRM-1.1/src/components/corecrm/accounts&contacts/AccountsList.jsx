// AccountsList.jsx
import React from 'react';
import { Plus, Building2 } from 'lucide-react';
import AccountCard from './AccountCard';

const AccountsList = ({ 
  accounts, 
  viewMode, 
  selectedAccount, 
  onSelectAccount, 
  onEditAccount, 
  onDeleteAccount,
  onAddAccount 
}) => {
  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
        <p className="text-gray-500 mb-4">Get started by adding your first account</p>
        <button
          onClick={onAddAccount}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Add Account
        </button>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
        : 'grid-cols-1'
    }`}>
      {accounts.map(account => (
        <AccountCard
          key={account.id}
          account={account}
          isSelected={selectedAccount?.id === account.id}
          viewMode={viewMode}
          onSelect={() => onSelectAccount(account)}
          onEdit={() => onEditAccount(account)}
          onDelete={() => onDeleteAccount(account.id)}
        />
      ))}
    </div>
  );
};

export default AccountsList;