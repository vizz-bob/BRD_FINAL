import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loanAccountAPI } from "../services/loanAccountService";

export default function LoanAccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await loanAccountAPI.getAllAccounts();
        const uniqueAccounts = Array.from(
          new Map((res.data || []).map((a) => [a.id, a])).values()
        );
        setAccounts(uniqueAccounts);
      } catch (error) {
        console.error("Failed to load loan accounts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 sm:p-8 text-center text-slate-500 text-sm">
        Loading loan accounts…
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-5 sm:mb-8">
        Active Loan Accounts (LMS)
      </h1>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: "560px" }}>
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] sm:text-xs tracking-wider">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Loan Account ID</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Borrower</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">Amount</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Action</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 sm:py-14 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <span className="text-4xl">📄</span>
                      <p className="text-sm font-semibold text-slate-700">No loan accounts found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50 transition-colors">

                    {/* Loan Account ID */}
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono text-xs font-bold text-slate-700 whitespace-nowrap">
                      {acc.id}
                    </td>

                    {/* Borrower */}
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-slate-800 whitespace-nowrap">
                      {acc.borrower ?? "—"}
                    </td>

                    {/* Amount — hidden on xs */}
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-semibold text-slate-700 whitespace-nowrap hidden sm:table-cell">
                      {acc.amount ? `₹${Number(acc.amount).toLocaleString("en-IN")}` : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold">
                        {acc.penny_drop_status ?? "—"}
                      </span>
                    </td>

                    {/* Action — hidden on mobile */}
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold">
                        {acc.action ?? "—"}
                      </span>
                    </td>

                    {/* Details */}
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/loan-accounts/${acc.id}`)}
                        className="text-indigo-600 hover:text-indigo-800 font-bold text-xs sm:text-sm transition"
                      >
                        View →
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