import React, { useState, useEffect } from 'react';
import {
  Zap, Key, Code, CheckCircle, XCircle,
  Play, Copy, Eye, EyeOff, Save
} from 'lucide-react';
import { ApiIntegrationService } from '../../../services/dataAndLeads.service';

// Must match ApiIntegration model HTTP_METHOD_CHOICES
const HTTP_METHOD_CHOICES = ['GET', 'POST', 'PUT', 'PATCH'];

// Must match ApiIntegration model AUTH_TYPE_CHOICES
const AUTH_TYPE_CHOICES = [
  { id: 'bearer_token', name: 'Bearer Token' },
  { id: 'api_key',      name: 'API Key'       },
  { id: 'basic_auth',   name: 'Basic Auth'    },
  { id: 'oauth_2_0',   name: 'OAuth 2.0'     },
];

// Must match ApiIntegration model SYNC_SCHEDULE_CHOICES
const SYNC_SCHEDULE_CHOICES = [
  { id: 'real_time_webhook', name: 'Real-time (Webhook)' },
  { id: 'hourly',            name: 'Hourly'              },
  { id: 'daily',             name: 'Daily'               },
  { id: 'manual_only',       name: 'Manual Only'         },
];

const EMPTY_CONFIG = {
  configuration_name: '',
  api_endpoint_url:   '',                  // URLField — must be https:// or http://
  http_method:        'POST',
  auth_type:          'bearer_token',
  api_key:            '',                  // write_only in serializer
  header_key:         '',
  header_value:       '',
  sync_schedule:      'real_time_webhook',
};

const ApiIntegration = ({ onSelect, selectedId }) => {
  const [apiConfigs,    setApiConfigs]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showNewConfig, setShowNewConfig] = useState(false);
  const [showApiKey,    setShowApiKey]    = useState(false);
  const [newConfig,     setNewConfig]     = useState({ ...EMPTY_CONFIG });
  const [saving,        setSaving]        = useState(false);
  const [testingId,     setTestingId]     = useState(null);
  const [testResult,    setTestResult]    = useState(null);
  const [saveError,     setSaveError]     = useState(null);

  useEffect(() => { fetchConfigs(); }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await ApiIntegrationService.list();
      setApiConfigs(res.data);
    } catch (err) {
      console.error('Failed to fetch API integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestApi = async (id) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const res = await ApiIntegrationService.testApi(id);
      setTestResult({ success: true, message: res.data.message });
    } catch (err) {
      setTestResult({ success: false, message: err.response?.data?.message || 'API test failed.' });
    } finally {
      setTestingId(null);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await ApiIntegrationService.create({
        configuration_name: newConfig.configuration_name,
        api_endpoint_url:   newConfig.api_endpoint_url,  // serializer validates https://
        http_method:        newConfig.http_method,
        auth_type:          newConfig.auth_type,
        api_key:            newConfig.api_key,            // write_only
        header_key:         newConfig.header_key,
        header_value:       newConfig.header_value,
        sync_schedule:      newConfig.sync_schedule,
      });
      await fetchConfigs();
      setShowNewConfig(false);
      setNewConfig({ ...EMPTY_CONFIG });
    } catch (err) {
      console.error('Failed to save API config:', err.response?.data || err);
      setSaveError(JSON.stringify(err.response?.data || 'Unknown error', null, 2));
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  if (showNewConfig) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-black text-gray-900">New API Integration</h3>
            <p className="text-xs text-gray-500 mt-1">Configure automated API data import</p>
          </div>
          <button onClick={() => { setShowNewConfig(false); setSaveError(null); }} className="p-2 text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-4">
            <p className="text-[10px] font-black text-indigo-600 uppercase">API Configuration</p>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-600 uppercase">Configuration Name</label>
              <input type="text" value={newConfig.configuration_name} onChange={(e) => setNewConfig({ ...newConfig, configuration_name: e.target.value })} placeholder="e.g., Marketing Automation API" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-600 uppercase">API Endpoint URL</label>
              <input type="text" value={newConfig.api_endpoint_url} onChange={(e) => setNewConfig({ ...newConfig, api_endpoint_url: e.target.value })} placeholder="https://api.example.com/v1/endpoint" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-mono outline-none focus:border-indigo-500" />
              <p className="text-[9px] text-gray-400">Must start with https:// or http://</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">HTTP Method</label>
                <select value={newConfig.http_method} onChange={(e) => setNewConfig({ ...newConfig, http_method: e.target.value })} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500">
                  {HTTP_METHOD_CHOICES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Auth Type</label>
                <select value={newConfig.auth_type} onChange={(e) => setNewConfig({ ...newConfig, auth_type: e.target.value })} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500">
                  {AUTH_TYPE_CHOICES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-600 uppercase">API Key / Token</label>
              <div className="relative">
                <input type={showApiKey ? 'text' : 'password'} value={newConfig.api_key} onChange={(e) => setNewConfig({ ...newConfig, api_key: e.target.value })} placeholder="Enter your API key or token" className="w-full bg-white border border-gray-200 rounded-lg p-3 pr-10 text-sm font-mono outline-none focus:border-indigo-500" />
                <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-3">Custom Headers (Optional)</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Header Key</label>
                <input type="text" value={newConfig.header_key} onChange={(e) => setNewConfig({ ...newConfig, header_key: e.target.value })} placeholder="X-Custom-Header" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase">Header Value</label>
                <input type="text" value={newConfig.header_value} onChange={(e) => setNewConfig({ ...newConfig, header_value: e.target.value })} placeholder="Header value" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-amber-600 uppercase mb-3">Sync Schedule</p>
            <select value={newConfig.sync_schedule} onChange={(e) => setNewConfig({ ...newConfig, sync_schedule: e.target.value })} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500">
              {SYNC_SCHEDULE_CHOICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
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
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">API Integrations</h3>
        <button onClick={() => setShowNewConfig(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-md font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
          <Zap className="w-3 h-3" /> New API
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
        ) : apiConfigs.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No API integrations yet. Add one to get started.</div>
        ) : (
          apiConfigs.map((config) => (
            <div key={config.id} onClick={() => onSelect(config)} className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-indigo-50 ${selectedId === config.id ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}`}>
              <div className="mb-3">
                <p className="text-sm font-bold text-gray-900">{config.configuration_name}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{config.id}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 mb-3 flex items-center justify-between">
                <p className="text-[10px] font-mono text-gray-700 truncate flex-1">{config.api_endpoint_url || 'No endpoint set'}</p>
                {config.api_endpoint_url && (
                  <button onClick={(e) => { e.stopPropagation(); copyToClipboard(config.api_endpoint_url); }} className="ml-2 p-1 text-gray-400 hover:text-gray-600"><Copy className="w-3 h-3" /></button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><p className="text-[9px] text-gray-500 uppercase font-bold flex items-center gap-1"><Code className="w-3 h-3" /> Method</p><span className="inline-block text-xs font-black px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">{config.http_method}</span></div>
                <div><p className="text-[9px] text-gray-500 uppercase font-bold flex items-center gap-1"><Key className="w-3 h-3" /> Auth</p><p className="text-xs font-bold text-gray-900">{AUTH_TYPE_CHOICES.find(a => a.id === config.auth_type)?.name || config.auth_type}</p></div>
                <div><p className="text-[9px] text-gray-500 uppercase font-bold">Schedule</p><p className="text-xs font-bold text-gray-900">{SYNC_SCHEDULE_CHOICES.find(s => s.id === config.sync_schedule)?.name || config.sync_schedule}</p></div>
              </div>
              <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                <button onClick={(e) => { e.stopPropagation(); handleTestApi(config.id); }} disabled={testingId === config.id} className="text-xs font-bold px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-700 flex items-center gap-1 disabled:opacity-60">
                  <Play className="w-3 h-3" />{testingId === config.id ? 'Testing...' : 'Test API'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApiIntegration;
