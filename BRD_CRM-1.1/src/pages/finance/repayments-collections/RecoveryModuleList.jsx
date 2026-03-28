import React from 'react';

import { 
  Receipt, PhoneForwarded, History, Banknote, 
  BarChart3, Plus, FileText, TrendingUp,
  AlertCircle, ShieldCheck, Zap, Scale, Gavel,
  ArrowLeft, Calculator, Upload, MessageCircle,
  Phone, Smartphone, CheckCircle, Wallet, AlertTriangle,
  Clock, User, Calendar, FileCheck
} from 'lucide-react';
import { RecoveryService } from '../../../services/financeService';


const RecoveryModuleList = ({ onSelect, selectedId }) => {
  
  const [recoveryData, setRecoveryData] = React.useState([]);
  const fetchData = async () => {
    try {
      const response = await RecoveryService.getAll();
      setRecoveryData(response.data);
    } catch (error) {
      console.error("Error fetching recovery data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  const getStageColor = (stage) => {
    const colors = {
      'Soft Notice': 'bg-blue-100 text-blue-700',
      'Legal Notice': 'bg-orange-100 text-orange-700',
      'Field Visit': 'bg-purple-100 text-purple-700',
      'Court Case': 'bg-red-100 text-red-700',
      'Settled': 'bg-emerald-100 text-emerald-700'
    };
    return colors[stage] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      'In Progress': 'bg-indigo-600', 'Escalated': 'bg-red-600', 'Settled': 'bg-emerald-600', 'Dropped': 'bg-gray-600', 'Closed': 'bg-slate-600'
    };
    return colors[status] || 'bg-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recovery Module - NPA Resolution</h3>
        <Gavel className="w-4 h-4 text-slate-600" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {recoveryData.map((acc) => (
          <div key={acc.id} onClick={() => onSelect(acc)} className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-indigo-50 ${selectedId === acc.id ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">{acc.name}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{acc.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-indigo-600">{acc.overdue}</p>
                <span className={`inline-block text-[8px] font-black px-1.5 py-0.5 rounded text-white uppercase mt-1 ${getStatusColor(acc.status)}`}>{acc.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getStageColor(acc.stage)}`}>{acc.stage}</span>
              <span className="text-[9px] text-gray-500">• {acc.assignedAgent}</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Follow-up: {acc.followUpDate}</span>
              <span>Last: {acc.lastAction}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default RecoveryModuleList;