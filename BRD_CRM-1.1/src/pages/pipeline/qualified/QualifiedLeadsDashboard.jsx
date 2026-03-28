// QualifiedLeadsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Filter, Users, TrendingUp, AlertCircle,
  CheckCircle, Clock, Search, Download
} from 'lucide-react';
import QualifiedLeadsTable from './QualifiedLeadsTable';
import QualifiedLeadDetails from './QualifiedLeadDetails';

import leadService from '../../../services/leadService';

const QualifiedLeadsDashboard = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const data = await leadService.getQualifiedLeads(filterStatus);
        setLeads(data);
      } catch (error) {
        console.error("Error fetching qualified leads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [filterStatus]);

  const stats = [
    {
      label: 'Total Qualified Leads',
      value: leads.length.toString(),
      icon: Users,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: '+12 this week'
    },
    {
      label: 'Eligible Leads',
      value: leads.filter(l => l.eligibilityStatus === 'eligible').length.toString(),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      change: '68% of total'
    },
    {
      label: 'Documents Pending',
      value: leads.filter(l => l.eligibilityStatus === 'pending-docs').length.toString(),
      icon: AlertCircle,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      change: 'Needs attention'
    },
    {
      label: 'Under Review',
      value: leads.filter(l => l.eligibilityStatus === 'under-review').length.toString(),
      icon: Clock,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      change: 'In progress'
    }
  ];

  const filteredLeads = leads.filter(lead => {
    const name = lead?.name?.toLowerCase() || '';
    const phone = lead?.phone || '';
    const id = lead?.id?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      name.includes(search) ||
      phone.includes(search) ||
      id.includes(search);

    const matchesFilter = filterStatus === 'all' || lead.eligibilityStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-2xl">
              <Filter className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Qualified Leads</h1>
              <p className="text-sm text-gray-500">
                Interest verified • Eligibility assessment in progress
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >

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
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter & Export */}
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 md:flex-initial px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="eligible">Eligible</option>
              <option value="pending-docs">Documents Pending</option>
              <option value="under-review">Under Review</option>
              <option value="ineligible">Ineligible</option>
            </select>

            <button
              onClick={() => window.open('http://127.0.0.1:8000/qualified_leads/export/', '_blank')}
              className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads Table */}
          <div className={selectedLead ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <QualifiedLeadsTable
              leads={filteredLeads}
              selectedLead={selectedLead}
              onSelectLead={setSelectedLead}
            />
          </div>

          {/* Lead Details Panel */}
          {selectedLead && (
            <div className="lg:col-span-1">
              <QualifiedLeadDetails
                lead={selectedLead}
                onClose={() => setSelectedLead(null)}
                onUpdate={(updatedLead) => {
                  if (!updatedLead) return;
                  setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
                  setSelectedLead(updatedLead);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualifiedLeadsDashboard;