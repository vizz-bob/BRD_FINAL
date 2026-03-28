import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loanApplicationAPI } from "../services/loanApplicationService";

import LoanUnderwritingConsole from "../components/LoanUnderwritingConsole";
import ProductSelectionModal from "../components/ProductSelectionModal";

import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function LoanApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ------------------------------------------------------------------
  // DATA FETCH
  // ------------------------------------------------------------------

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;

      const response = await loanApplicationAPI.getAll(params);

      // Normalize data to avoid render crashes
      const normalized = (response?.data || []).map((app) => ({
        application_id: app?.application_id ?? "",
        first_name: app?.first_name ?? "",
        last_name: app?.last_name ?? "",
        product_name: app?.product_name ?? "Personal Loan",
        income_type: app?.income_type ?? "-",
        requested_amount: Number(app?.requested_amount ?? 0),
        requested_tenure: app?.requested_tenure ?? "-",
        status: app?.status ?? "UNKNOWN",
        created_at: app?.created_at ?? null,
      }));

      setApplications(normalized);
    } catch (err) {
      console.error("Failed to fetch loans:", err);
      setError("Unable to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchTerm]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ------------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------------

  const handleProductSelect = (product) => {
    setIsProductModalOpen(false);
    if (product?.id) {
      navigate(`/loan-applications/new/${product.id}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      NEW: "bg-blue-100 text-blue-800",
      KNOCKOUT_PENDING: "bg-orange-100 text-orange-800",
      UNDERWRITING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      SANCTIONED: "bg-primary-100 text-primary-800 border-primary-200",
      PRE_DISBURSEMENT: "bg-primary-100 text-primary-800",
      DISBURSED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800",
      HOLD: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-50 text-gray-600";
  };

  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "";

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------

  return (
  <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">

    {/* HEADER */}
    <div className="flex flex-wrap justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Loan Applications Queue</h1>
        <p className="text-sm text-gray-500 mt-1">Manage applications, underwriting checks, and disbursements.</p>
      </div>
      <button
        onClick={() => setIsProductModalOpen(true)}
        className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition shadow-sm font-medium whitespace-nowrap"
      >
        <PlusIcon className="h-5 w-5" /> New Application
      </button>
    </div>

    {/* FILTER BAR */}
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
      <div className="relative w-full md:w-96 group">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search Name, Mobile or ID..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchApplications()}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg flex-1 md:flex-none">
          <FunnelIcon className="h-4 w-4 text-gray-500 shrink-0" />
          <select
            className="bg-transparent text-sm outline-none text-gray-700 w-full"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="UNDERWRITING">Underwriting</option>
            <option value="SANCTIONED">Sanctioned</option>
            <option value="PRE_DISBURSEMENT">Pre-Disbursement</option>
            <option value="DISBURSED">Disbursed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <button onClick={fetchApplications} className="p-2.5 hover:bg-gray-100 rounded-lg shrink-0">
          <ArrowPathIcon className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>

    {/* TABLE */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[560px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Application</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-12 text-gray-500">Loading applications...</td></tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-red-600">
                  <div className="flex flex-col items-center gap-2">
                    <ExclamationCircleIcon className="h-6 w-6" />
                    <span>{error}</span>
                  </div>
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-gray-500">No applications found.</td></tr>
            ) : (
              applications.map((app, index) => (
                <tr key={app.application_id || index} className="hover:bg-gray-50">
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{app.first_name} {app.last_name}</div>
                    <div className="text-xs text-gray-500 font-mono">{app.application_id ? app.application_id.split("-")[0] : "N/A"}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm">
                    {app.product_name}
                    <div className="text-xs text-gray-500">{app.income_type}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm font-bold whitespace-nowrap">
                    {formatCurrency(app.requested_amount)}
                    <div className="text-xs text-gray-500 font-normal">{app.requested_tenure} Months</div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(app.status)}`}>
                      {app.status.replace(/_/g, " ")}
                    </span>
                    <div className="text-[10px] text-gray-400 mt-1">{formatDate(app.created_at)}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <button
                      onClick={() => app.application_id && setSelectedAppId(app.application_id)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium whitespace-nowrap"
                    >
                      Process &gt;
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* MODALS - keep unchanged */}
    {selectedAppId && (
      <LoanUnderwritingConsole appId={selectedAppId} onClose={() => { setSelectedAppId(null); fetchApplications(); }} />
    )}
    {isProductModalOpen && (
      <ProductSelectionModal onClose={() => setIsProductModalOpen(false)} onSelect={handleProductSelect} />
    )}
  </div>
);
}
