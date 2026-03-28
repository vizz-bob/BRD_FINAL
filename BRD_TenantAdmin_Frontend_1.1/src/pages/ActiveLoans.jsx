import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function ActiveLoans() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const fetchActiveLoans = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("loans/active/");
      setLoans(res.data || []);
    } catch (err) {
      console.error("Failed to load active loans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActiveLoans(); }, []);

  const filteredLoans = loans.filter(l =>
    (l.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
     l.loan_account_number?.includes(search)) &&
    (filter === "ALL" || l.status === filter)
  );

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50 font-sans">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Active Loan Portfolio</h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Manage disbursements, repayment tracking, and closures.</p>
        </div>
        <button
          onClick={fetchActiveLoans}
          className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
        >
          Refresh Data
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-3 bg-slate-50/50">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Name or Loan Account No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="relative sm:w-48">
            <FunnelIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Standard (Active)</option>
              <option value="OVERDUE">Overdue</option>
              <option value="NPA">NPA / Default</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-100 text-slate-500 font-extrabold uppercase text-[11px] tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-4 md:px-8 py-5">Loan Account</th>
                <th className="px-4 md:px-8 py-5">Product Type</th>
                <th className="px-4 md:px-8 py-5">Disbursed Amount</th>
                <th className="px-4 md:px-8 py-5">Outstanding</th>
                <th className="px-4 md:px-8 py-5">Next EMI</th>
                <th className="px-4 md:px-8 py-5">Status</th>
                <th className="px-4 md:px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="p-12 text-center font-bold text-slate-400 animate-pulse">Loading active portfolio...</td></tr>
              ) : filteredLoans.length === 0 ? (
                <tr><td colSpan="7" className="p-12 text-center font-bold text-slate-400">No active loans found matching criteria.</td></tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-4 md:px-8 py-5">
                      <div className="font-bold text-slate-900">{loan.customer_name}</div>
                      <div className="text-xs font-mono text-slate-500 mt-1">{loan.loan_account_number}</div>
                    </td>
                    <td className="px-4 md:px-8 py-5">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md whitespace-nowrap">{loan.product_name}</span>
                    </td>
                    <td className="px-4 md:px-8 py-5 font-mono font-bold text-slate-700 whitespace-nowrap">
                      ₹{Number(loan.disbursed_amount).toLocaleString()}
                    </td>
                    <td className="px-4 md:px-8 py-5 font-mono font-bold text-slate-700 whitespace-nowrap">
                      ₹{Number(loan.current_outstanding).toLocaleString()}
                    </td>
                    <td className="px-4 md:px-8 py-5">
                      <div className="text-sm font-bold text-slate-800 whitespace-nowrap">{loan.next_emi_date}</div>
                      <div className="text-[10px] text-slate-400 font-bold">₹{Number(loan.emi_amount).toLocaleString()}</div>
                    </td>
                    <td className="px-4 md:px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${
                        loan.status === 'OVERDUE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        loan.status === 'NPA' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-5 text-right">
                      <button
                        onClick={() => navigate(`/loans/${loan.id}`)}
                        className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition whitespace-nowrap"
                      >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" /> View Ledger
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}