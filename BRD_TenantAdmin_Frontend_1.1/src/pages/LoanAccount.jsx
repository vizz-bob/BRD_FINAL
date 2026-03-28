import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  BanknotesIcon, DocumentArrowDownIcon, CheckBadgeIcon 
} from "@heroicons/react/24/outline";
import { loanAccountAPI } from "../services/loanAccountService";

export default function LoanAccount() {
  const { id } = useParams(); // URL: /loan-account/:id
  const [activeTab, setActiveTab] = useState("SCHEDULE");
  const [loanDetails, setLoanDetails] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch loan account details, schedule, and transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [loanRes, scheduleRes, transactionsRes] = await Promise.all([
          loanAccountAPI.getAccountById(id),
          loanAccountAPI.getSchedule(id),
          loanAccountAPI.getTransactions(id),
        ]);

        setLoanDetails(loanRes.data);
        setSchedule(scheduleRes.data);
        setTransactions(transactionsRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch loan details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Download statement
  const handleDownloadStatement = async () => {
    try {
      const res = await loanAccountAPI.downloadStatement(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `LoanStatement-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download statement", err);
    }
  };

  // Foreclose / generate NOC
  const handleForeclose = async () => {
    try {
      await loanAccountAPI.forecloseAccount(id, {}); // Pass required payload
      alert("Foreclosure / NOC request submitted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to foreclose account");
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50 animate-fade-in">
      
      {/* Account Header Card */}
      <div className="bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-7 lg:p-10 text-white mb-6 sm:mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/30 whitespace-nowrap">
                {loanDetails.status || "Active Loan"}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight break-all">{loanDetails.loan_number}</h1>
            </div>
            <p className="text-slate-400 font-medium text-sm sm:text-base lg:text-lg">
              Borrower: <span className="text-white">{loanDetails.borrower}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <button 
              onClick={handleDownloadStatement} 
              className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <DocumentArrowDownIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>Statement</span>
            </button>
            <button 
              onClick={handleForeclose} 
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <CheckBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>Foreclose / NOC</span>
            </button>
          </div>
        </div>

        {/* Loan Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 lg:mt-12 relative z-10">
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Loan Amount</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold">₹{loanDetails.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Outstanding</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-orange-400">₹{loanDetails.outstanding?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Next EMI</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold">{loanDetails.next_emi_date || '-'}</p>
            <p className="text-xs text-slate-400 mt-1">₹{loanDetails.next_emi_amount?.toLocaleString() || 0} due</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Tenure Progress</p>
            <div className="flex items-end gap-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold">{loanDetails.tenure_completed || 0}</span>
              <span className="text-slate-400 mb-1 font-bold text-xs sm:text-sm">/ {loanDetails.tenure_total || 0} Months</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500" style={{ width: `${(loanDetails.tenure_completed / loanDetails.tenure_total) * 100 || 0}%`, height: "100%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-6 border-b border-slate-200 pb-1 overflow-x-auto">
        {['SCHEDULE', 'TRANSACTIONS', 'DOCUMENTS'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-t-xl transition-all ${
              activeTab === tab 
              ? "bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
            }`}
          >
            {tab === 'SCHEDULE' ? 'Amortization Schedule' : tab === 'TRANSACTIONS' ? 'Ledger History' : 'Loan Documents'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'SCHEDULE' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 sm:px-6 py-4">Inst. #</th>
                  <th className="px-4 sm:px-6 py-4">Due Date</th>
                  <th className="px-4 sm:px-6 py-4">EMI Amount</th>
                  <th className="px-4 sm:px-6 py-4">Principal</th>
                  <th className="px-4 sm:px-6 py-4">Interest</th>
                  <th className="px-4 sm:px-6 py-4">Status</th>
                  <th className="px-4 sm:px-6 py-4">Paid On</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
                {schedule.map(row => (
                  <tr key={row.inst} className="hover:bg-slate-50 transition">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-slate-700">{row.inst}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono text-slate-600 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold whitespace-nowrap">₹{row.amount.toLocaleString()}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-500 whitespace-nowrap">₹{row.principal.toLocaleString()}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-500 whitespace-nowrap">₹{row.interest.toLocaleString()}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 sm:px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${
                        row.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        row.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-500 text-xs whitespace-nowrap">{row.paid_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'TRANSACTIONS' && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-dashed border-slate-300">
          {transactions.length === 0 ? (
            <div className="text-center text-slate-400">
              <BanknotesIcon className="w-12 h-12 mx-auto mb-4" />
              <p className="font-bold">No transactions available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[560px]">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3">Date</th>
                    <th className="px-4 sm:px-6 py-3">Description</th>
                    <th className="px-4 sm:px-6 py-3">Amount</th>
                    <th className="px-4 sm:px-6 py-3">Type</th>
                    <th className="px-4 sm:px-6 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 sm:px-6 py-3 font-mono text-slate-600 whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 sm:px-6 py-3">{tx.description}</td>
                      <td className="px-4 sm:px-6 py-3 font-bold whitespace-nowrap">₹{tx.amount.toLocaleString()}</td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{tx.type}</td>
                      <td className="px-4 sm:px-6 py-3 font-mono whitespace-nowrap">₹{tx.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'DOCUMENTS' && (
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-dashed border-slate-300 text-center">
          <DocumentArrowDownIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Loan Documents Module</p>
        </div>
      )}
    </div>
  );
}