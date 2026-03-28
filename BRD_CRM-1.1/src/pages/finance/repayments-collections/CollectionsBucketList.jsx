import React from 'react';
import { AlertTriangle, Clock, PhoneOutgoing, MessageSquare } from 'lucide-react';
import { CollectionService } from '../../../services/financeService';

const CollectionsBucketList = ({ onSelect, selectedId }) => {

  const [delinquencyData, setDelinquencyData] = React.useState([]);
  const fetchData = async () => {
    try {
      const response = await CollectionService.getAll();
      setDelinquencyData(response.data);
    } catch (error) {
      console.error("Error fetching delinquency data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Delinquency Management</h3>
        <AlertTriangle className="w-4 h-4 text-slate-600" />
      </div>
      <div className="flex-1 overflow-y-auto border-b border-gray-50">
        {delinquencyData.map((acc) => (
          <div key={acc.id} onClick={() => onSelect(acc)} className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-indigo-100 ${selectedId === acc.id ? 'bg-indigo-200 border-l-4 border-indigo-600' : ''}`}>
            <div>
              <p className="text-sm font-bold text-gray-900">{acc.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-black">{acc.dpd} DPD</span>
                <span className="text-[10px] text-gray-900 font-medium italic">{acc.lastOutcome}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-red-600">{acc.overdue}</p>
              <div className="flex items-center gap-1 justify-end text-[9px] font-bold text-gray-900 uppercase tracking-tighter">
                <Clock className="w-3 h-3" /> PTP: {acc.ptp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsBucketList;