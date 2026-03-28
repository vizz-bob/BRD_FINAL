import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { activeLoanService } from "../../services/activeservice";

const STATUS_CONFIG = {
  OVERDUE: { label: "Overdue", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  NPA: { label: "NPA / Default", cls: "bg-red-50 text-red-700 border-red-200" },
  ACTIVE: { label: "Active", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.ACTIVE;
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function fmt(num) {
  return `₹${Number(num || 0).toLocaleString("en-IN")}`;
}

export default function ActiveLoans() {
  const navigate = useNavigate();

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  // ✅ FETCH FUNCTION
  const fetchActiveLoans = async () => {
    console.log("🔥 Fetching active loans...");

    setLoading(true);
    setError(null);

    try {
      const data = await activeLoanService.getAll();

      console.log("✅ RAW API RESPONSE:", data);

      const rawLoans = Array.isArray(data) ? data : (data.results ?? []);

      // ✅ SAFE MAPPING (handles backend mismatch)
      const mappedLoans = rawLoans.map((l) => ({
        id: l.id,
        customer_name: l.customer_name || l.customer || "N/A",
        loan_account_number: l.loan_account_number || l.loan_no || "N/A",
        product_name: l.product_name || l.product || "N/A",
        disbursed_amount: l.disbursed_amount || l.amount || 0,
        current_outstanding: l.current_outstanding || l.outstanding || 0,
        next_emi_date: l.next_emi_date || l.next_emi || "-",
        emi_amount: l.emi_amount || l.emi || 0,
        status: l.status || "ACTIVE",
      }));

      console.log("✅ MAPPED LOANS:", mappedLoans);

      setLoans(mappedLoans);
    } catch (err) {
      console.error("❌ API ERROR:", err);
      setError("Failed to load active loans");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECT useEffect
  useEffect(() => {
    fetchActiveLoans();
  }, []);

  // ✅ FILTER LOGIC
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      loan.loan_account_number?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || loan.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50 font-sans">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Active Loan Portfolio
          </h1>
          <p className="text-slate-500">
            Manage disbursements, repayment tracking, and closures.
          </p>
        </div>

        <button
          onClick={fetchActiveLoans}
          disabled={loading}
          className="px-4 py-2 bg-white border rounded-xl"
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* Filters */}
        <div className="p-4 flex gap-3 border-b">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="OVERDUE">Overdue</option>
            <option value="NPA">NPA</option>
          </select>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="p-3">Loan Account</th>
              <th className="p-3">Product</th>
              <th className="p-3">Disbursed</th>
              <th className="p-3">Outstanding</th>
              <th className="p-3">Next EMI</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filteredLoans.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  No data found
                </td>
              </tr>
            )}

           {!loading && !error &&
  filteredLoans.map((loan, index) => (
    <tr key={loan.id || loan.loan_account_number || index}>
      <td className="p-3">
        <div>{loan.customer_name}</div>
        <div className="text-xs text-gray-500">
          {loan.loan_account_number}
        </div>
      </td>

      <td className="p-3">{loan.product_name}</td>

      <td className="p-3">{fmt(loan.disbursed_amount)}</td>

      <td className="p-3">{fmt(loan.current_outstanding)}</td>

      <td className="p-3">
        {loan.next_emi_date}
        <div className="text-xs text-gray-400">
          {fmt(loan.emi_amount)}
        </div>
      </td>

      <td className="p-3">
        <StatusBadge status={loan.status} />
      </td>

      <td className="p-3 text-right">
        <button
          onClick={() => navigate(`/loans/${loan.id}`)}
          className="bg-black text-white px-3 py-1 rounded"
        >
          View
        </button>
      </td>
    </tr>
  ))}
          </tbody>
        </table>

        {!loading && !error && (
          <div className="p-3 text-xs text-gray-500">
            Showing {filteredLoans.length} of {loans.length}
          </div>
        )}
      </div>
    </div>
  );
}