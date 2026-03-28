// AccountCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Building2, MapPin, Users, Briefcase, MoreVertical, Edit, Trash2, TrendingUp } from 'lucide-react';

const AccountCard = ({ account, isSelected, viewMode, onSelect, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div
      className={`bg-white rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
        isSelected ? 'border-indigo-600' : 'border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{account.companyName}</h3>
              <p className="text-xs text-gray-500">{account.id}</p>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-t-xl"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>{account.industry}</span>
          </div>
          {account.address && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5" />
              <span className="line-clamp-2">{account.address}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{account.associatedContacts} contacts</span>
          </div>
        </div>

        {/* GST & PAN */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">GST</p>
            <p className="text-sm font-medium text-gray-900 truncate">{account.gstNumber}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">PAN</p>
            <p className="text-sm font-medium text-gray-900 truncate">{account.panNumber}</p>
          </div>
        </div>

        {/* Tags & Status */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(account.status)}`}>
            {account.status}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getAccountTypeColor(account.accountType)}`}>
            {account.accountType}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-500">Active Deals</p>
            <p className="text-sm font-semibold text-gray-900">{account.activeDeals}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Assigned To</p>
            <p className="text-sm font-semibold text-gray-900">{account.assignedTo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;