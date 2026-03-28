import React from 'react';
import { X, AlertCircle, RefreshCcw, Terminal } from 'lucide-react';

const ErrorLogModal = ({ channel, onClose }) => {
  const mockErrors = [
    { id: "E-102", msg: "API Connection Timeout", time: "2026-01-06 14:02", code: "504" },
    { id: "E-105", msg: "Invalid JSON Structure", time: "2026-01-05 09:15", code: "400" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Terminal className="text-indigo-400" size={20} />
            <h3 className="text-white font-bold">Technical Error Logs: {channel?.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
          {mockErrors.map((err) => (
            <div key={err.id} className="bg-black/40 border border-gray-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-red-400 font-mono text-xs font-bold">[{err.code}] {err.msg}</span>
                <span className="text-gray-600 text-[10px] font-mono">{err.time}</span>
              </div>
              <p className="text-gray-500 text-[10px] font-mono leading-relaxed">
                Failure logged in LOS Pipeline. Automated alert sent to admin via Support Module.
              </p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-800/50 flex justify-between items-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Status: Monitoring Active</p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-2">
            <RefreshCcw size={14} /> Re-test Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorLogModal;