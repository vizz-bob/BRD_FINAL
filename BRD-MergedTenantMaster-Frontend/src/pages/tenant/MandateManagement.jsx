import { useState, useEffect } from "react";
import { getMandates, updateMandate } from "../../services/mandateService";
import {
  BuildingLibraryIcon,
  CheckBadgeIcon,
  XCircleIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

export default function MandateManagement() {
  const [mandates, setMandates] = useState([]);
  const [processing, setProcessing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMandates(); }, []);

  const fetchMandates = async () => {
    try {
      setLoading(true);
      const res = await getMandates();
      setMandates(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.error("Failed to load mandates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id) => {
    setProcessing(id);
    try {
      await updateMandate(id, { action: "SUCCESS" });
      setMandates((prev) => prev.map((m) => m.id === id ? { ...m, action: "SUCCESS" } : m));
    } catch {
      alert("Action failed");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-10 text-center text-slate-500">
        Loading mandates...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50">

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
        <div className="p-2.5 sm:p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
          <BuildingLibraryIcon className="h-6 w-6 sm:h-8 sm:w-8" />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900">Mandate & Banking</h1>
          <p className="text-slate-500 text-sm font-medium">Verify accounts and register repayment mandates</p>
        </div>
      </div>

      {/* Table container — scrolls on mobile */}
      <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "680px" }}>
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] sm:text-xs font-bold uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-left">Application</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-left">Customer</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-left">Bank</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-left">Penny Drop</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-left">eNACH</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {(Array.isArray(mandates) ? mandates : []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No mandates found
                  </td>
                </tr>
              ) : (
                (Array.isArray(mandates) ? mandates : []).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">

                    {/* Application */}
                    <td className="px-4 sm:px-8 py-4 sm:py-6 font-bold text-indigo-600 text-sm whitespace-nowrap">
                      {item.application_id}
                    </td>

                    {/* Customer */}
                    <td className="px-4 sm:px-8 py-4 sm:py-6 font-bold text-sm whitespace-nowrap">
                      {item.customer}
                    </td>

                    {/* Bank */}
                    <td className="px-4 sm:px-8 py-4 sm:py-6">
                      <div className="font-bold text-sm">{item.bank}</div>
                      <div className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">
                        {item.ifsc} · {item.account}
                      </div>
                    </td>

                    {/* Penny Drop */}
                    <td className="px-4 sm:px-8 py-4 sm:py-6 whitespace-nowrap">
                      {item.penny_drop_status === "SUCCESS" ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-bold text-sm">
                          <CheckBadgeIcon className="h-4 w-4 shrink-0" /> Verified
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Pending</span>
                      )}
                    </td>

                    {/* eNACH */}
                    <td className="px-4 sm:px-8 py-4 sm:py-6 whitespace-nowrap">
                      {item.enach_status === "SUCCESS" ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-bold text-sm">
                          <QrCodeIcon className="h-4 w-4 shrink-0" /> Active
                        </span>
                      ) : (
                        <span className="text-orange-400 text-xs">Not Registered</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-right whitespace-nowrap">
                      {item.action === "PENDING" && (
                        <button
                          onClick={() => handleAction(item.id)}
                          disabled={processing === item.id}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {processing === item.id ? "Processing..." : "Proceed"}
                        </button>
                      )}
                      {item.action === "SUCCESS" && (
                        <span className="text-emerald-600 font-bold flex justify-end items-center gap-1 text-sm">
                          <CheckBadgeIcon className="h-4 w-4" /> Completed
                        </span>
                      )}
                      {item.action === "FAILED" && (
                        <span className="text-red-600 font-bold flex justify-end items-center gap-1 text-sm">
                          <XCircleIcon className="h-4 w-4" /> Failed
                        </span>
                      )}
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
