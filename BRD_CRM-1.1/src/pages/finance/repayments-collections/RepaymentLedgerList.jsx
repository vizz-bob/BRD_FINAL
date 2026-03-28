import React from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck, Wallet } from 'lucide-react';
import { RepaymentService } from '../../../services/financeService';

const RepaymentLedgerList = ({ onSelect, selectedId }) => {
  const [repaymentsData, setRepaymentsData] = React.useState([]);
  const fetchData = async () => {
    try {
      const response = await RepaymentService.getAll();
      const mapped = response.data.map(item => ({
        id: item.loan_id,
        name: item.borrower_name,
        emi: `${item.emi_number}/${item.emi_count}`,
        due: item.due_date,
        paid: `₹${item.amount_paid.toLocaleString()}`,
        status: item.status.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        mode: item.payment_mode || '-'
      }));
      setRepaymentsData(mapped);
    } catch (error) {
      console.error("Error fetching repayment ledger data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Financial Ledger Tracking</h3>
        <ShieldCheck className="w-4 h-4 text-slate-600" />
      </div>
      <div className="flex-1 overflow-y-auto border-b border-gray-50">
        {repaymentsData.map((acc) => (
          <div key={acc.id} onClick={() => onSelect(acc)} className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-indigo-100 ${selectedId === acc.id ? 'bg-indigo-200 border-l-4 border-indigo-600' : ''}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${acc.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{acc.name} <span className="text-[10px] text-gray-400 font-mono ml-1">#{acc.id}</span></p>
                <p className="text-[11px] text-gray-500">EMI {acc.emi} • Due {acc.due} • {acc.mode}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-gray-900">{acc.paid}</p>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                acc.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                acc.status === 'Partially Paid' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}>{acc.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepaymentLedgerList;