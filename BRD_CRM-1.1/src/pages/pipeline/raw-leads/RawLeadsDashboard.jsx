import React, { useEffect, useState } from 'react';
import {
  Database, List, Columns, UploadCloud,
  AlertCircle, Clock, Search, ShieldAlert, Filter,
  Download
} from 'lucide-react';
import RawLeadListView from './RawLeadListView';
import RawLeadDetailsView from './RawLeadDetailsView';
import RawLeadKanbanView from './RawLeadKanbanView';
import { qualifiedLeadsService, rawLeadService } from '../../../services/pipelineService';

const RawLeadsDashboard = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [selectedLead, setSelectedLead] = useState(null);
  const [mobileView, setMobileView] = useState('list');

  // Definition for your new Sub-Tab Navigation
  const viewTabs = [
    { id: 'list', label: 'Lead List View', icon: List },
    { id: 'kanban', label: 'Kanban Board', icon: Columns }, // Using Columns for better compatibility
  ];

  const [leadsData, setLeadsData] = useState([]);
  const formatLastActivity = (lastActivity) => {
    if (!lastActivity) return "—";

    const diffMs = new Date() - new Date(lastActivity);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };
  const formatStatus = (status) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const mapRawLead = (item) => ({
    id: item.id,
    contactName: item.contact_name,
    vendorSource: item.vendor_source,
    status: formatStatus(item.status),
    lastActivity: formatLastActivity(item.last_activity),
    phone: item.phone,
    email: item.email,
    isDuplicate: item.is_duplicate,
    isStagnant: item.is_stagnant,
    city: item.city,
    interestArea: item.interest_area,
    updated_at: item.updated_at,
  });
  const fetchLeads = async () => {
    try {
      const response = await rawLeadService.list();
      setLeadsData(response.data.map(mapRawLead));
    }
    catch (error) {
      console.error("Error fetching leads:", error);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [])

  const stats = React.useMemo(() => {
    const total = leadsData.length;

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const newToday = leadsData.filter((lead) => {
      if (!lead.updated_at) return false;
      return new Date(lead.updated_at) >= startOfToday;
    }).length;

    const stagnant = leadsData.filter((lead) => lead.isStagnant).length;

    const duplicates = leadsData.filter((lead) => lead.isDuplicate).length;

    return [
      {
        label: "Total Raw Leads",
        value: total.toLocaleString(),
        icon: Database,
        color: "text-indigo-600",
        bg: "bg-indigo-100",
      },
      {
        label: "New Today",
        value: newToday.toLocaleString(),
        icon: Clock,
        color: "text-green-600",
        bg: "bg-green-100",
      },
      {
        label: "Stagnant (>7d)",
        value: stagnant.toLocaleString(),
        icon: AlertCircle,
        color: "text-orange-600",
        bg: "bg-orange-100",
      },
      {
        label: "Duplicate Flags",
        value: duplicates.toLocaleString(),
        icon: ShieldAlert,
        color: "text-red-600",
        bg: "bg-red-100",
      },
    ];
  }, [leadsData]);

  const moveToQualified = async (lead) => {
    try {
      await qualifiedLeadsService.create(
        lead
      )
      await fetchLeads();
      setSelectedLead(null);
    } catch (error) {
      console.error("Error moving lead to qualified:", error);
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* 1. TOP HEADER SECTION */}
      <div className="bg-white border-b border-gray-100 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg shadow-lg shadow-red-100">
              <Database className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Raw Leads</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Stage 1: Validation & Processing</p>
            </div>
          </div>

          {/* <button className="mt-4 md:mt-0 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-sm">
            <UploadCloud className="w-4 h-4" /> Bulk Ingest Data
          </button> */}
        </div>

        {/* 2. QUICK STATS CARDS */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SUB-TAB NAVIGATION (VIEW MODE SWITCHER) */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8 overflow-x-auto">
            {viewTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = viewMode === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`flex items-center space-x-2 px-1 py-4 border-b-2 transition-all whitespace-nowrap ${isActive
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-600 font-medium'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="text-sm">{tab.label}</span>

                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[650px]">
          {viewMode === 'list' ? (
            <>
              <div className={`${mobileView === 'list' ? 'block' : 'hidden'} lg:block flex-1 h-full`}>
                <RawLeadListView
                  leadsData={leadsData}
                  onSelectLead={(lead) => {
                    setSelectedLead(lead);
                    if (window.innerWidth < 1024) setMobileView('details');
                  }}
                  selectedLeadId={selectedLead?.id}
                />
              </div>
              <div className={`${mobileView === 'details' ? 'block' : 'hidden'} lg:block w-full lg:w-96 h-full`}>
                <RawLeadDetailsView
                  lead={selectedLead}
                  moveToQualified={moveToQualified}
                  onBack={() => setMobileView('list')}
                />
              </div>
            </>
          ) : (
            <div className="w-full">
              <RawLeadKanbanView
                leadsData={leadsData}
                onSelectLead={(lead) => {
                  setSelectedLead(lead);
                  setMobileView('details');
                }} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RawLeadsDashboard;