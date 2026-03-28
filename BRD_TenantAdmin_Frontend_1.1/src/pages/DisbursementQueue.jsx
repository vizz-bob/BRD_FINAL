import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  ArrowRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { disbursementAPI } from "../services/disbursementService";

export default function DisbursementQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const data = await disbursementAPI.getQueue();

      if (Array.isArray(data)) {
        setQueue(data);
      } else if (Array.isArray(data?.results)) {
        setQueue(data.results);
      } else {
        setQueue([]);
      }
    } catch (error) {
      console.error("Failed to load disbursement queue:", error);
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleDisburse = async (loan) => {
    const amount = Number(loan?.amount || 0);

    const confirmed = window.confirm(
      `Confirm transfer of ₹${amount.toLocaleString()} for Loan Account ID ${loan.id}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(loan.id);

      await disbursementAPI.disburse(loan.id);

      // Optimistic UI update
      setQueue((prev) => prev.filter((q) => q.id !== loan.id));

      alert("Funds transferred successfully.");
    } catch (error) {
      console.error("Disbursement failed:", error);
      alert(
        error?.detail ||
          error?.message ||
          "Disbursement failed. Please try again."
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading disbursement queue...
      </div>
    );
  }

  return (
  <div className="p-4 md:p-6 max-w-7xl mx-auto">

    {/* Header */}
    <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8">
      <div className="p-3 bg-green-100 rounded-xl text-green-700 shrink-0">
        <BanknotesIcon className="h-7 w-7 md:h-8 md:w-8" />
      </div>
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Disbursement Queue</h1>
        <p className="text-sm text-gray-500">Release funds for approved loan accounts</p>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[480px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500">Applicant</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500">Amount</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500">Bank Detail</th>
              <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {queue.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No Pending Disbursements</td>
              </tr>
            ) : (
              queue.map((loan) => {
                const amount = Number(loan?.amount || 0);
                return (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4">
                      <div className="font-semibold">{loan.applicant || "-"}</div>
                      <div className="text-xs text-gray-500">Loan Account ID: {loan.id}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 font-bold text-green-700 whitespace-nowrap">
                      ₹{amount.toLocaleString()}
                    </td>
                    <td className="px-4 md:px-6 py-4">{loan.bank || "-"}</td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <button
                        onClick={() => handleDisburse(loan)}
                        disabled={processingId === loan.id}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap"
                      >
                        {processingId === loan.id ? (
                          <><span className="hidden sm:inline">Processing</span><ArrowPathIcon className="h-4 w-4 animate-spin" /></>
                        ) : (
                          <><span className="hidden sm:inline">Disburse</span><ArrowRightIcon className="h-4 w-4" /></>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}
