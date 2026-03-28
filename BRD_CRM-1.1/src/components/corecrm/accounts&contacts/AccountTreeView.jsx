// AccountTreeView.jsx
import React, { useState, useEffect } from 'react';
import { Building2, ChevronRight, ChevronDown } from 'lucide-react';

const AccountTreeView = ({ account, allAccounts }) => {
  const [expandedAccounts, setExpandedAccounts] = useState(new Set());
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    // Build the tree structure
    const buildTree = () => {
      // Find parent account if exists
      let parentAccount = null;
      if (account.parentAccountId) {
        parentAccount = allAccounts.find(acc => acc.id === account.parentAccountId);
      }

      // Find child accounts (accounts that have this account as parent)
      const childAccounts = allAccounts.filter(acc => acc.parentAccountId === account.id);

      // Find sibling accounts (accounts with same parent)
      const siblingAccounts = account.parentAccountId
        ? allAccounts.filter(acc => 
            acc.parentAccountId === account.parentAccountId && 
            acc.id !== account.id
          )
        : [];

      return {
        parent: parentAccount,
        current: account,
        children: childAccounts,
        siblings: siblingAccounts
      };
    };

    setTreeData(buildTree());
    
    // Auto-expand current account if it has children
    const childAccounts = allAccounts.filter(acc => acc.parentAccountId === account.id);
    if (childAccounts.length > 0) {
      setExpandedAccounts(new Set([account.id]));
    }
  }, [account, allAccounts]);

  const toggleExpand = (accountId) => {
    setExpandedAccounts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  };

  const renderAccountNode = (acc, level = 0, isCurrent = false, isParent = false) => {
    const hasChildren = allAccounts.some(a => a.parentAccountId === acc.id);
    const isExpanded = expandedAccounts.has(acc.id);
    const children = allAccounts.filter(a => a.parentAccountId === acc.id);

    return (
      <div key={acc.id}>
        <div
          className={`flex items-center gap-2 p-3 rounded-xl transition-colors ${
            isCurrent
              ? 'bg-indigo-100 border-2 border-indigo-600'
              : isParent
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
          }`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpand(acc.id)}
              className="p-1 hover:bg-white rounded-lg transition"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-6" />}

          <div className={`w-8 h-8 ${
            isCurrent ? 'bg-indigo-600' : isParent ? 'bg-blue-600' : 'bg-gray-400'
          } rounded-full flex items-center justify-center flex-shrink-0`}>
            <Building2 className="w-4 h-4 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h5 className={`font-medium text-sm truncate ${
              isCurrent ? 'text-indigo-900' : 'text-gray-900'
            }`}>
              {acc.companyName}
              {isCurrent && <span className="ml-2 text-xs">(Current)</span>}
              {isParent && <span className="ml-2 text-xs">(Parent)</span>}
            </h5>
            <p className="text-xs text-gray-500">{acc.accountType} • {acc.industry}</p>
          </div>

          <div className="text-xs text-gray-500">
            {acc.associatedContacts} contacts
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2">
            {children.map(child => renderAccountNode(child, level + 1, child.id === account.id))}
          </div>
        )}
      </div>
    );
  };

  if (!treeData) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading hierarchy...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">Organization Hierarchy</h4>

      <div className="space-y-3">
        {/* Parent Account */}
        {treeData.parent && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Parent Organization</p>
            {renderAccountNode(treeData.parent, 0, false, true)}
          </div>
        )}

        {/* Current Account */}
        <div>
          {treeData.parent && <p className="text-xs text-gray-500 mb-2 mt-4">Current Organization</p>}
          {renderAccountNode(treeData.current, treeData.parent ? 1 : 0, true)}
        </div>

        {/* Child Accounts */}
        {treeData.children.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Child Organizations ({treeData.children.length})</p>
            <div className="space-y-2">
              {treeData.children.map(child => renderAccountNode(child, 1))}
            </div>
          </div>
        )}

        {/* Sibling Accounts */}
        {treeData.siblings.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Sibling Organizations ({treeData.siblings.length})</p>
            <div className="space-y-2">
              {treeData.siblings.map(sibling => renderAccountNode(sibling, treeData.parent ? 1 : 0))}
            </div>
          </div>
        )}

        {/* No Relationships */}
        {!treeData.parent && treeData.children.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No organizational relationships</p>
            <p className="text-gray-400 text-xs mt-1">This is an independent account</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2">Legend</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
            <span className="text-gray-600">Current Account</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">Parent Account</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">Other Accounts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTreeView;