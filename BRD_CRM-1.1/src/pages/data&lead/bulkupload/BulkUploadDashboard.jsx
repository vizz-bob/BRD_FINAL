import React, { useState, useEffect } from 'react';
import {
  Upload, Database, RefreshCw, History,
  AlertTriangle, FileText, Settings
} from 'lucide-react';
import FileUploadMethod from './FileUploadMethod';
import ManualEntryForm from './ManualEntryForm';
import FtpIntegration from './FtpIntegration';
import ApiIntegration from './ApiIntegration';
import UploadHistory from './UploadHistory';
import {
  FileUploadService,
  ManualEntryService,
  FtpIntegrationService,
  ApiIntegrationService,
} from '../../../services/dataAndLeads.service';

const BulkUploadDashboard = () => {
  const [activeTab,           setActiveTab]           = useState('file-upload');
  const [selectedItem,        setSelectedItem]        = useState(null);
  const [totalUploads,        setTotalUploads]        = useState(null);
  const [totalManualEntries,  setTotalManualEntries]  = useState(null);
  const [activeIntegrations,  setActiveIntegrations]  = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const [filesRes, entriesRes, ftpRes, apiRes] = await Promise.allSettled([
        FileUploadService.list(),
        ManualEntryService.list(),
        FtpIntegrationService.list(),
        ApiIntegrationService.list(),
      ]);
      if (filesRes.status   === 'fulfilled') setTotalUploads(filesRes.value.data.length);
      if (entriesRes.status === 'fulfilled') setTotalManualEntries(entriesRes.value.data.length);
      const ftpCount = ftpRes.status === 'fulfilled' ? ftpRes.value.data.length : 0;
      const apiCount = apiRes.status === 'fulfilled' ? apiRes.value.data.length : 0;
      setActiveIntegrations(ftpCount + apiCount);
    };
    fetchStats();
  }, []);

  const fmt = (val) => val !== null ? val.toLocaleString() : 'N/A';

  const stats = [
    { label: 'Total Uploads',       value: fmt(totalUploads),      icon: Upload,        color: 'text-indigo-600',  bg: 'bg-indigo-100'  },
    { label: 'Manual Entries',      value: fmt(totalManualEntries), icon: Database,      color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Active Integrations', value: fmt(activeIntegrations), icon: RefreshCw,     color: 'text-purple-600',  bg: 'bg-purple-100'  },
    { label: 'Failed Records',      value: 'N/A',                   icon: AlertTriangle, color: 'text-red-600',     bg: 'bg-red-100'     },
  ];

  const switchTab = (tab) => { setActiveTab(tab); setSelectedItem(null); };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="bg-white border-b border-gray-100 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg shadow-lg">
              <Database className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Bulk Data Upload</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Data Import & Management</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-2xl font-black ${stat.value === 'N/A' ? 'text-gray-400' : 'text-gray-900'}`}>{stat.value}</p>
                  <div className={`p-4 rounded-lg ${stat.bg} ${stat.color}`}><Icon className="w-6 h-6" /></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-8 overflow-x-auto">
          {[
            { id: 'file-upload',  label: 'File Upload',     icon: Upload   },
            { id: 'manual-entry', label: 'Manual Entry',    icon: FileText },
            { id: 'ftp',          label: 'FTP Integration', icon: Database },
            { id: 'api',          label: 'API Integration', icon: Settings },
            { id: 'history',      label: 'Upload History',  icon: History  },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => switchTab(tab.id)} className={`flex items-center gap-2 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <Icon className="w-4 h-4" /><span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === 'file-upload'  && <FileUploadMethod onSelect={(item) => setSelectedItem(item)} selectedId={selectedItem?.id} />}
        {activeTab === 'manual-entry' && <ManualEntryForm  onSelect={(item) => setSelectedItem(item)} selectedId={selectedItem?.id} />}
        {activeTab === 'ftp'          && <FtpIntegration   onSelect={(item) => setSelectedItem(item)} selectedId={selectedItem?.id} />}
        {activeTab === 'api'          && <ApiIntegration   onSelect={(item) => setSelectedItem(item)} selectedId={selectedItem?.id} />}
        {activeTab === 'history'      && <UploadHistory    onSelect={(item) => setSelectedItem(item)} selectedId={selectedItem?.id} />}
      </main>
    </div>
  );
};

export default BulkUploadDashboard;
