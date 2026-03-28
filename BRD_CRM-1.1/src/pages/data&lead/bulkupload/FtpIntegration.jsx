import React, { useState, useEffect } from 'react';
import {
  Server, Key, FolderOpen, Clock, Play,
  CheckCircle, XCircle, Save
} from 'lucide-react';
import { FtpIntegrationService } from '../../../services/dataAndLeads.service';

// Must match FtpIntegration model FREQUENCY_CHOICES
const FREQUENCY_CHOICES = [
  { id: 'once',    name: 'One-time' },
  { id: 'daily',   name: 'Daily'    },
  { id: 'weekly',  name: 'Weekly'   },
  { id: 'monthly', name: 'Monthly'  },
];

const EMPTY_CONFIG = {
  configuration_name: '',
  ftp_host:           '',    // URLField — https:// added automatically
  port:               '21',
  username:           '',
  password:           '',
  remote_path:        '/',
  frequency:          'daily',
  time:               '01:00',
};

const FtpIntegration = ({ onSelect, selectedId }) => {
  const [ftpConfigs,    setFtpConfigs]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showNewConfig, setShowNewConfig] = useState(false);
  const [newConfig,     setNewConfig]     = useState({ ...EMPTY_CONFIG });
  const [saving,        setSaving]        = useState(false);
  const [testingId,     setTestingId]     = useState(null);
  const [testResult,    setTestResult]    = useState(null);
  const [saveError,     setSaveError]     = useState(null);

  useEffect(() => { fetchConfigs(); }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await FtpIntegrationService.list();
      setFtpConfigs(res.data);
    } catch (err) {
      console.error('Failed to fetch FTP integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (id) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const res = await FtpIntegrationService.testConnection(id);
      setTestResult({ success: true, message: res.data.message });
    } catch (err) {
      setTestResult({ success: false, message: err.response?.data?.message || 'Connection test failed.' });
    } finally {
      setTestingId(null);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      // ftp_host is a URLField — must start with http(s)://
      let host = newConfig.ftp_host.trim();
      if (host && !host.startsWith('http')) host = `https://${host}`;

      await FtpIntegrationService.create({
        configuration_name: newConfig.configuration_name,
        ftp_host:           host,
        port:               parseInt(newConfig.port, 10),
        username:           newConfig.username,
        password:           newConfig.password,
        remote_path:        newConfig.remote_path || null,
        frequency:          newConfig.frequency,
        time:               newConfig.time || null,
      });

      await fetchConfigs();
      setShowNewConfig(false);
      setNewConfig({ ...EMPTY_CONFIG });
    } catch (err) {
      console.error('Failed to save FTP config:', err.response?.data || err);
      setSaveError(JSON.stringify(err.response?.data || 'Unknown error', null, 2));
    } finally {
      setSaving(false);
    }
  };

  if (showNewConfig) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-black text-gray-900">New FTP Configuration</h3>
            <p className="text-xs text-gray-500 mt-1">Configure automated FTP data import</p>
          </div>
          <button onClick={() => { setShowNewConfig(false); setSaveError(null); }} className="p-2 text-gray-400 hover:text-gray-600">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-[10px] font-black text-indigo-600 uppercase mb-3">Connection Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-black text-gray-600 uppercase">Configuration Name</label>
                <input type="text" value={newConfig.configuration_name} onChange={(e) => setNewConfig({ ...newConfig, configuration_name: e.target.value })} placeholder="e.g., Marketing Campaign FTP" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">FTP Host</label>
                <input type="text" value={newConfig.ftp_host} onChange={(e) => setNewConfig({ ...newConfig, ftp_host: e.target.value })} placeholder="ftp.example.com" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
                <p className="text-[9px] text-gray-400">https:// added automatically if missing</p>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Port</label>
                <input type="number" value={newConfig.port} onChange={(e) => setNewConfig({ ...newConfig, port: e.target.value })} placeholder="21" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Username</label>
                <input type="text" value={newConfig.username} onChange={(e) => setNewConfig({ ...newConfig, username: e.target.value })} placeholder="FTP username" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Password</label>
                <input type="password" value={newConfig.password} onChange={(e) => setNewConfig({ ...newConfig, password: e.target.value })} placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-black text-gray-600 uppercase">Remote Path</label>
                <input type="text" value={newConfig.remote_path} onChange={(e) => setNewConfig({ ...newConfig, remote_path: e.target.value })} placeholder="/data/imports" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-3">Sync Schedule</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Frequency</label>
                <select value={newConfig.frequency} onChange={(e) => setNewConfig({ ...newConfig, frequency: e.target.value })} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500">
                  {FREQUENCY_CHOICES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Time</label>
                <input type="time" value={newConfig.time} onChange={(e) => setNewConfig({ ...newConfig, time: e.target.value })} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>
        </div>

        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs font-bold text-red-700 mb-1">Save Error:</p>
            <pre className="text-[10px] text-red-600 whitespace-pre-wrap">{saveError}</pre>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button onClick={() => { setShowNewConfig(false); setSaveError(null); }} className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95">Cancel</button>
          <button onClick={handleSaveConfig} disabled={saving} className="py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60">
            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">FTP Integrations</h3>
        <button onClick={() => setShowNewConfig(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-md font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
          <Server className="w-3 h-3" /> New Config
        </button>
      </div>

      {testResult && (
        <div className={`mx-4 mt-3 rounded-lg p-3 flex items-center gap-2 ${testResult.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          {testResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
          <p className={`text-xs font-bold ${testResult.success ? 'text-emerald-700' : 'text-red-700'}`}>{testResult.message}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : ftpConfigs.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No FTP integrations yet. Add one to get started.</div>
        ) : (
          ftpConfigs.map((config) => (
            <div key={config.id} onClick={() => onSelect(config)} className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-indigo-50 ${selectedId === config.id ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}`}>
              <div className="mb-3">
                <p className="text-sm font-bold text-gray-900">{config.configuration_name}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{config.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><p className="text-[9px] text-gray-500 uppercase font-bold flex items-center gap-1"><Server className="w-3 h-3" /> Host</p><p className="text-xs font-bold text-gray-900">{config.ftp_host || 'N/A'}</p></div>
                <div><p className="text-[9px] text-gray-500 uppercase font-bold flex items-center gap-1"><Key className="w-3 h-3" /> Username</p><p className="text-xs font-bold text-gray-900">{config.username}</p></div>
                <div><p className="text-[9px] text-gray-500 uppercase font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Frequency</p><p className="text-[10px] font-bold text-gray-900 capitalize">{config.frequency}</p></div>
                <div><p className="text-[9px] text-gray-500 uppercase font-bold flex items-center gap-1"><FolderOpen className="w-3 h-3" /> Remote Path</p><p className="text-[10px] font-bold text-gray-900">{config.remote_path || '/'}</p></div>
              </div>
              <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                <button onClick={(e) => { e.stopPropagation(); handleTestConnection(config.id); }} disabled={testingId === config.id} className="text-xs font-bold px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-700 flex items-center gap-1 disabled:opacity-60">
                  <Play className="w-3 h-3" />{testingId === config.id ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FtpIntegration;
