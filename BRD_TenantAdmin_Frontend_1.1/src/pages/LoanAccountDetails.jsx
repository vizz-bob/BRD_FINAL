import { useState, useEffect } from "react"; // Fixed typo from useEffectx
import { useParams } from "react-router-dom";
import { loanAccountAPI } from "../services/loanAccountService";
import { 
  BanknotesIcon, CalendarDaysIcon, DocumentArrowDownIcon, 
  ArrowPathIcon, CheckBadgeIcon, ClockIcon 
} from "@heroicons/react/24/outline";

export default function LoanAccountDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("SCHEDULE");
  
  // New Live States
  const [account, setAccount] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoanData = async () => {
      setLoading(true);
      try {
        // Parallel fetching for better performance
        const [detailsRes, scheduleRes] = await Promise.all([
          loanAccountAPI.getAccountDetails(id),
          loanAccountAPI.getSchedule(id)
        ]);
        setAccount(detailsRes.data);
        setSchedule(scheduleRes.data || []);
      } catch (err) {
        console.error("Failed to load loan details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <ArrowPathIcon className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!account) return <div className="p-20 text-center">Loan account not found.</div>;

  return (
  <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50 animate-fade-in">

    {/* Account Header Card */}
    <div className="bg-slate-900 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white mb-6 md:mb-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-wrap justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="bg-primary-500/20 text-primary-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/30 whitespace-nowrap">
              {account.status || 'Active Loan'}
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{account.loan_no}</h1>
          </div>
          <p className="text-slate-400 font-medium text-base md:text-lg">Borrower: <span className="text-white">{account.borrower_name}</span></p>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          <button className="bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl font-bold text-sm backdrop-blur-sm transition flex items-center gap-2 whitespace-nowrap">
            <DocumentArrowDownIcon className="w-5 h-5 shrink-0" /> Statement
          </button>
          <button className="bg-primary-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 flex items-center gap-2 whitespace-nowrap">
            <CheckBadgeIcon className="w-5 h-5 shrink-0" /> Foreclose / NOC
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-12 relative z-10">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Loan Amount</p>
          <p className="text-xl md:text-3xl font-mono font-bold">₹{Number(account.amount).toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Outstanding</p>
          <p className="text-xl md:text-3xl font-mono font-bold text-orange-400">₹{Number(account.outstanding).toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Next EMI</p>
          <p className="text-xl md:text-3xl font-mono font-bold">{account.next_emi_date || 'N/A'}</p>
          <p className="text-xs text-slate-400 mt-1">₹{Number(account.emi_amount || 0).toLocaleString('en-IN')} due</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Tenure Progress</p>
          <div className="flex items-end gap-2 flex-wrap">
            <span className="text-xl md:text-3xl font-mono font-bold">{account.tenure_completed || 0}</span>
            <span className="text-slate-400 mb-1 font-bold text-sm">/ {account.tenure_total || 0} Months</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary-600 h-full transition-all duration-1000" style={{ width: `${(account.tenure_completed / account.tenure_total) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>

    {/* Tabs */}
    <div className="flex flex-wrap gap-1 md:gap-2 mb-6 border-b border-slate-200 pb-1">
      {['SCHEDULE', 'TRANSACTIONS', 'DOCUMENTS'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 md:px-6 py-2.5 md:py-3 text-xs font-bold uppercase tracking-widest rounded-t-xl transition-all ${
            activeTab === tab
              ? "bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
          }`}
        >
          {tab === 'SCHEDULE' ? 'Amortization Schedule' : tab === 'TRANSACTIONS' ? 'Ledger History' : 'Loan Documents'}
        </button>
      ))}
    </div>

    {activeTab === 'SCHEDULE' && (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 md:px-6 py-4">Inst. #</th>
                <th className="px-4 md:px-6 py-4">Due Date</th>
                <th className="px-4 md:px-6 py-4">EMI Amount</th>
                <th className="px-4 md:px-6 py-4">Principal</th>
                <th className="px-4 md:px-6 py-4">Interest</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4">Paid On</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {schedule.map((row) => (
                <tr key={row.inst} className="hover:bg-slate-50 transition">
                  <td className="px-4 md:px-6 py-4 font-bold text-slate-700">{row.inst}</td>
                  <td className="px-4 md:px-6 py-4 font-mono text-slate-600 whitespace-nowrap">{row.date}</td>
                  <td className="px-4 md:px-6 py-4 font-bold whitespace-nowrap">₹{Number(row.amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 md:px-6 py-4 text-slate-500 whitespace-nowrap">₹{Number(row.principal).toLocaleString('en-IN')}</td>
                  <td className="px-4 md:px-6 py-4 text-slate-500 whitespace-nowrap">₹{Number(row.interest).toLocaleString('en-IN')}</td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${
                      row.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      row.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-slate-500 text-xs whitespace-nowrap">{row.paid_date || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {activeTab === 'TRANSACTIONS' && (
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-dashed border-slate-300 text-center">
        <BanknotesIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-bold">Transaction Ledger Module</p>
      </div>
    )}
  </div>
);
}