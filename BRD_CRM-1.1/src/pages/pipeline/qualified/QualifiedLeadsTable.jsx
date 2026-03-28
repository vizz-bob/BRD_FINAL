// QualifiedLeadsTable.jsx
import React from 'react';
import { Phone, Mail, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { ELIGIBILITY_STATUS, INTEREST_AREAS } from '../../../utils/constants';

const QualifiedLeadsTable = ({ leads, selectedLead, onSelectLead }) => {
  const getStatusBadge = (status) => {
    const statusConfig = ELIGIBILITY_STATUS.find(s => s.value === status);
    if (!statusConfig) return null;

    const colorClasses = {
      green: 'bg-green-100 text-green-700',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-700',
      indigo: 'bg-indigo-100 text-indigo-600'
    };

    return (
      <span className={`px-3 py-1 rounded-xl text-xs font-medium ${colorClasses[statusConfig.color]}`}>
        {statusConfig.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colorClasses = {
      high: 'bg-red-100 text-red-600',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-600'
    };

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${colorClasses[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const getInterestLabel = (value) => {
    const interest = INTEREST_AREAS.find(i => i.value === value);
    return interest ? interest.label : value;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Qualified Leads Found</h3>
        <p className="text-gray-500">Start by qualifying leads from the Raw Leads stage.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Lead List</h3>
        <p className="text-sm text-gray-500 mt-1">{leads.length} qualified leads</p>
      </div>

      {/* Table Content - Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Follow-up</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr 
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className={`hover:bg-gray-50 cursor-pointer transition ${
                  selectedLead?.id === lead.id ? 'bg-indigo-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Phone className="w-3 h-3" />
                      {lead.phone}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{lead.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {getInterestLabel(lead.interestArea)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(lead.eligibilityStatus)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${lead.leadScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{lead.leadScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(lead.nextFollowUp)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getPriorityBadge(lead.priority)}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onSelectLead(lead)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View - Mobile */}
      <div className="md:hidden divide-y divide-gray-200">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
              selectedLead?.id === lead.id ? 'bg-indigo-50' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{lead.id}</p>
              </div>
              {getPriorityBadge(lead.priority)}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                {lead.phone}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                {lead.email}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Interest</p>
                <p className="text-sm font-medium text-gray-900">
                  {getInterestLabel(lead.interestArea)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Score</p>
                <p className="text-sm font-bold text-indigo-600">{lead.leadScore}%</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              {getStatusBadge(lead.eligibilityStatus)}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {formatDate(lead.nextFollowUp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualifiedLeadsTable;