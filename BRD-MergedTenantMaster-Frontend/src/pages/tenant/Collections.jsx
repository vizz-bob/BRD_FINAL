import { useEffect, useState } from "react";
import { collectionAPI } from "../../services/collectionService";
import { ExclamationTriangleIcon, PhoneIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function Collections() {
  const [overdueLoans, setOverdueLoans] = useState([]);
  const [stats, setStats] = useState({ totalOverdue: "0", npaCases: 0, efficiency: "0%" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollectionsData = async () => {
      try {
        setLoading(true);
        const [loansData, statsData] = await Promise.all([
          collectionAPI.getOverdueLoans(),
          collectionAPI.getCollectionStats()
        ]);
        setOverdueLoans(Array.isArray(loansData) ? loansData : []);
        setStats(statsData);
      } catch (err) {
        console.error("Error loading collections:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCollectionsData();
  }, []);

const handleDirectAction = async (loan, actionType) => {
    try {
      await collectionAPI.recordAction(loan.id, actionType, `Direct ${actionType} action recorded`);
      loadCollectionsData(); // Refresh list
    } catch (err) {
      alert(`Failed to record ${actionType} action`);
    }
  };

  const openActionModal = (loan, type) => {
    setSelectedLoan(loan);
    setActionType(type);
    setRemarks("");
    setShowActionModal(true);
  };

  const handleRecordAction = async () => {
    if (!remarks) return alert("Please enter remarks");
    try {
      await collectionAPI.recordAction(selectedLoan.id, actionType, remarks);
      setShowActionModal(false);
      loadCollectionsData(); // Refresh list
    } catch (err) {
      alert("Failed to record action");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8">
        <div className="p-3 bg-red-100 rounded-xl text-red-700 shrink-0">
          <ExclamationTriangleIcon className="h-7 w-7 md:h-8 md:w-8" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Collections & Recovery</h1>
          <p className="text-sm text-gray-500">Phase 7b: Manage delinquencies and recovery actions.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-orange-50 p-5 md:p-6 rounded-xl border border-orange-200 shadow-sm">
          <div className="text-orange-800 font-bold uppercase text-xs">Total Overdue</div>
          <div className="text-2xl md:text-3xl font-bold text-orange-900 mt-2">₹{stats.totalOverdue}</div>
        </div>
        <div className="bg-red-50 p-5 md:p-6 rounded-xl border border-red-200 shadow-sm">
          <div className="text-red-800 font-bold uppercase text-xs">NPA Cases (90+ DPD)</div>
          <div className="text-2xl md:text-3xl font-bold text-red-900 mt-2">{stats.npaCases} {stats.npaCases === 1 ? 'Case' : 'Cases'}</div>
        </div>
        <div className="bg-blue-50 p-5 md:p-6 rounded-xl border border-blue-200 shadow-sm">
          <div className="text-blue-800 font-bold uppercase text-xs">Collection Efficiency</div>
          <div className="text-2xl md:text-3xl font-bold text-blue-900 mt-2">{stats.efficiency}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-100 font-bold text-gray-700 bg-gray-50">Delinquency Queue</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[560px]">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-4 md:px-6 py-3 text-xs font-bold text-gray-500 uppercase">Loan ID & Name</th>
                <th className="px-4 md:px-6 py-3 text-xs font-bold text-gray-500 uppercase">Overdue Amount</th>
                <th className="px-4 md:px-6 py-3 text-xs font-bold text-gray-500 uppercase">DPD</th>
                <th className="px-4 md:px-6 py-3 text-xs font-bold text-gray-500 uppercase">Bucket</th>
                <th className="px-4 md:px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {overdueLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 md:px-6 py-4">
                    <div className="font-bold text-gray-900">{loan.name}</div>
                    <div className="text-xs text-gray-500">{loan.id}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-red-600 font-bold whitespace-nowrap">
                    ₹{Number(loan.overdue_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 font-mono whitespace-nowrap">{loan.dpd} Days</td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${loan.dpd > 90 ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}>
                      {loan.bucket}
                    </span>
                  </td>
<td className="px-4 md:px-6 py-4">
                    <div className="flex justify-end gap-3 flex-wrap">
                      <button 
                        onClick={() => handleDirectAction(loan, "CALL")}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest shadow-lg transition active:scale-95"
                      >
                        <PhoneIcon className="h-3.5 w-3.5" /> Call
                      </button>
                      <button 
                        onClick={() => handleDirectAction(loan, "LEGAL")}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-100 text-[10px] font-black uppercase tracking-widest transition active:scale-95"
                      >
                        <DocumentTextIcon className="h-3.5 w-3.5" /> Notice
                      </button>
                      <button 
                        onClick={() => openActionModal(loan, "EMAIL")}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition active:scale-95"
                      >
                        <DocumentTextIcon className="h-3.5 w-3.5" /> Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
