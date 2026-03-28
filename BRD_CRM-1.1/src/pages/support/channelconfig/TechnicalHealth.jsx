import React from 'react';
import { 
  Activity, 
  AlertCircle, 
  Terminal, 
  RefreshCcw, 
  Wifi, 
  WifiOff, 
  LifeBuoy,
  Clock,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

const TechnicalHealth = () => {
  const apiStatus = [
    { name: "JustDial API", status: "Operational", latency: "120ms", failures: 0, lastCheck: "1 min ago" },
    { name: "WhatsApp Gateway", status: "Critical", latency: "---", failures: 5, lastCheck: "Now" },
    { name: "Facebook Webhook", status: "Operational", latency: "250ms", failures: 0, lastCheck: "5 mins ago" },
    { name: "IndiaMart Hub", status: "Degraded", latency: "850ms", failures: 2, lastCheck: "2 mins ago" }
  ];

  const errorLogs = [
    { id: "ERR-992", channel: "WhatsApp", error: "Authentication Timeout", time: "17:02:10", impact: "High" },
    { id: "ERR-988", channel: "JustDial", error: "Malformed JSON", time: "16:45:30", impact: "Low" }
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8">
      {/* 1. API Monitoring Grid (Point 3) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <Activity size={18} className="text-blue-600" /> API Connectivity Monitor
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {apiStatus.map((api, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border transition-all ${api.status === 'Critical' ? 'bg-red-50 border-red-100 shadow-md animate-pulse' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${api.status === 'Operational' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {api.status === 'Operational' ? <Wifi size={18} /> : <WifiOff size={18} />}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{api.lastCheck}</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{api.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] font-bold uppercase ${api.status === 'Operational' ? 'text-green-600' : 'text-red-600'}`}>
                  {api.status}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">Latency: {api.latency}</span>
              </div>
              {api.failures >= 3 && (
                <div className="mt-3 pt-3 border-t border-red-200 flex items-center gap-2 text-red-700">
                  <AlertCircle size={12} />
                  <span className="text-[9px] font-bold uppercase">Admin Alert Sent</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Error Log Tab (Point 3) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Terminal size={18} className="text-gray-500" /> Error Log Tab
          </h3>
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
            <div className="p-3 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest ml-4">Terminal: Integration Failures</span>
            </div>
            <div className="p-4 font-mono text-[11px] space-y-3 max-h-[250px] overflow-y-auto">
              {errorLogs.map((log, i) => (
                <div key={i} className="flex flex-col gap-1 border-b border-gray-800 pb-2 last:border-0">
                  <div className="flex justify-between">
                    <span className="text-red-400 font-bold">[{log.time}] ERROR: {log.id}</span>
                    <span className="text-gray-500">Impact: {log.impact}</span>
                  </div>
                  <p className="text-gray-300 underline underline-offset-4">Source: {log.channel} Integration Failure</p>
                  <p className="text-gray-500 italic">{log.error} - HTTP 503 Service Unavailable</p>
                </div>
              ))}
              <div className="flex items-center gap-2 text-green-400/70">
                <RefreshCcw size={12} className="animate-spin-slow" />
                <span>Monitoring background processes...</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Support & SLA Tracking (Point 3) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <LifeBuoy size={18} className="text-blue-600" /> Infrastructure Support Tickets
          </h3>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-4">
                <ShieldAlert className="text-red-600" size={20} />
                <div>
                  <p className="text-xs font-bold text-red-900">WhatsApp Gateway Failure</p>
                  <p className="text-[10px] text-red-600 font-medium">Ticket #INF-1029 • High Priority</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-red-700 uppercase">SLA Expiry</p>
                <p className="text-xs font-bold text-red-900 flex items-center gap-1 justify-end">
                  <Clock size={12} /> 1h 42m left
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <LifeBuoy className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs font-bold text-gray-700">JustDial JSON Mapping Error</p>
                    <p className="text-[10px] text-gray-500 font-medium">Ticket #INF-1024 • Resolved</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-green-600 uppercase">Resolved in 45m</span>
              </div>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all">
              Raise Critical Support Ticket <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Data Hygiene Alert (Point 3) */}
      <div className="bg-blue-900 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/10 rounded-lg text-indigo-300">
            <Activity size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight">Lead Attribution Guard</h4>
            <p className="text-[11px] text-indigo-200">UTM and referral tags verified. System is currently preventing "Lead Leakage" from untraceable origins.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase">Data Hygiene: Clean</span>
        </div>
      </div>
    </div>
  );
};

export default TechnicalHealth;