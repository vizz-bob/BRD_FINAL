import React, { useEffect, useState } from 'react';
import {
  Flame, List, Columns, Zap,
  TrendingUp, AlertTriangle, Search, UploadCloud,
  Download
} from 'lucide-react';
import HotLeadListView from './HotLeadListView';
import HotLeadDetailsView from './HotLeadDetailsView';
import HotLeadKanbanView from './HotLeadKanbanView';
import leadService from '../../../services/leadService';

const HotLeadsDashboard = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedLead, setSelectedLead] = useState(null);
  const [mobileView, setMobileView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState([]);
  const [statsData, setStatsData] = useState({
    hot_leads: 0,
    sla_breaches: 0,
    docs_pending: 0,
    avg_intent: 0
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leadsData, statsResponse] = await Promise.all([
          leadService.getHotLeads(),
          leadService.getHotLeadStats()
        ]);
        setLeads(leadsData);
        setStatsData(statsResponse);
        if (leadsData.length > 0 && !selectedLead) {
          setSelectedLead(leadsData[0]);
        }
      } catch (error) {
        console.error("Error fetching hot leads data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);


  const stats = [
    { label: 'Hot Leads', value: statsData.hot_leads.toString(), icon: Flame, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'SLA Breaches', value: statsData.sla_breaches.toString(), icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Docs Pending', value: statsData.docs_pending.toString(), icon: Zap, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Avg. Intent', value: `${statsData.avg_intent}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const viewTabs = [
    { id: 'list', label: 'Priority List', icon: List },
    { id: 'kanban', label: 'Conversion Board', icon: Columns },
  ];


  const filteredLeads = leads.filter(lead => {
    const name = lead.name || '';
    const phone = lead.phone || '';
    const id = lead.id ? lead.id.toString() : '';

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' ||
      lead.status === filterStatus ||
      lead.eligibilityStatus === filterStatus ||
      (filterStatus === 'breach' && lead.slaStatus === 'Breach') ||
      (filterStatus === 'docpending' && (lead.docs === 'Pending' || lead.docs_completed === false));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg shadow-lg shadow-indigo-100">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Hot Leads</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Stage 4: Active Conversion Phase</p>
            </div>
          </div>

          {/* <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Search intent..." className="bg-transparent border-none text-sm outline-none w-48" />
            </div>
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
               Eligibility Check (LOS)
            </button>
          </div> */}
        </div>

        {/* Stats Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Filters & Search */}
      {/* <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          
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

          
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 md:flex-initial px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="hot">Hot Leads</option>
              <option value="breach">SLA Breaches</option>
              <option value="docpending">Docs Pending</option>
              <option value="avgintent">Avg. Intent</option>
            </select>

            <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div> */}

      {/* Sub-Tab Navigation */}
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
                  className={`flex items-center space-x-2 px-1 py-4 border-b-2 transition-all whitespace-nowrap ${isActive ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[650px]">
          {viewMode === 'list' ? (
            <>
              <div className={`${mobileView === 'list' ? 'block' : 'hidden'} lg:block flex-1 h-full`}>
                {/* Filters & Search */}
                <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-20">
                  <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md w-full">
                      <label htmlFor="hotlead-search" className="sr-only">Search by name, phone, or ID</label>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="hotlead-search"
                        name="searchTerm"
                        type="text"
                        placeholder="Search by name, phone, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Filter & Export */}
                    <div className="flex gap-2 w-full md:w-auto">
                      <label htmlFor="hotlead-filter" className="sr-only">Filter by status</label>
                      <select
                        id="hotlead-filter"
                        name="filterStatus"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="flex-1 md:flex-initial px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">All Priority</option>
                        <option value="hot">Hot (Ready)</option>
                        <option value="breach">SLA Breach</option>
                        <option value="docpending">Docs Pending</option>
                        <option value="DOC_VERIFICATION">Board: Doc Verification</option>
                        <option value="READY_FOR_CONSULT">Board: Ready for Consult</option>
                        <option value="MEETING_SCHEDULED">Board: Meeting Scheduled</option>
                      </select>

                      <button
                        onClick={() => {
                          const url = viewMode === 'list'
                            ? 'http://127.0.0.1:8000/hot_lead/hot-leads/export/'
                            : 'http://127.0.0.1:8000/conversion_board/leads/export/';
                          window.open(url, '_blank');
                        }}
                        className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>
                <HotLeadListView
                  leads={filteredLeads}
                  onSelectLead={(lead) => {
                    setSelectedLead(lead);
                    if (window.innerWidth < 1024) setMobileView('details');
                  }}
                  selectedLeadId={selectedLead?.id}
                />
              </div>
              <div className={`${mobileView === 'details' ? 'block' : 'hidden'} lg:block w-full lg:w-96 h-full`}>
                <HotLeadDetailsView
                  lead={selectedLead}
                  onBack={() => setMobileView('list')}
                  onUpdate={(updatedLead) => {
                    const fetchLeads = async () => {
                      try {
                        const data = await leadService.getHotLeads();
                        setLeads(data);
                        if (updatedLead) {
                          setSelectedLead(updatedLead);
                        } else if (selectedLead) {
                          // Refresh current selection from fresh data
                          const refreshed = data.find(l => l.id === selectedLead.id);
                          if (refreshed) setSelectedLead(refreshed);
                        }
                      } catch (err) {
                        console.error("Refresh failed:", err);
                      }
                    };
                    fetchLeads();
                    setRefreshKey(prev => prev + 1);
                  }}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full">
              <HotLeadKanbanView
                key={refreshKey}
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

export default HotLeadsDashboard;