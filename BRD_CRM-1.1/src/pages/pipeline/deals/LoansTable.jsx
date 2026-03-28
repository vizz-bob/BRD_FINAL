import React, { useEffect, useState } from 'react';
import { disbursedLoansService } from '../../../services/pipelineService';

const LoansTable = () => {
  const [loans, setLoans] = useState([]);

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const mapLoan = (loan) => {
    return {
      loanId: loan.loan_id,
      customerName: loan.customer_name,
      productType: loan.product,
      disbursedAmount: formatCurrency(loan.disbursed_amount),
      emiAmount: formatCurrency(loan.emi_amount),
      emiStartDate: loan.created_at?.split("T")[0],
      tenure: "N/A",
      repaymentStatus: loan.status,
      nextEmiDue: loan.next_emi_due,
    };
  };

  const fetchDisbursedLoans = async () => {
    try {
      const res = await disbursedLoansService.list()
      setLoans(res.data.map(mapLoan))
    } catch {
      console.log("failed to fetch")
    }
  }

  useEffect(() => {
    fetchDisbursedLoans()
  }, [])

  const [showSchedule, setShowSchedule] = useState(false);

  const statusColors = {
    'On-track': 'bg-green-100 text-green-700',
    'Delayed': 'bg-yellow-100 text-yellow-700',
    'Defaulted': 'bg-red-100 text-red-700'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Disbursed Loans</h2>
        <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
          Export Report
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disbursed Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">EMI Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next EMI Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.loanId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{loan.loanId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loan.productType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.disbursedAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.emiAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loan.nextEmiDue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[loan.repaymentStatus]}`}>
                      {loan.repaymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => setShowSchedule(!showSchedule)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View Schedule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">EMI Payment Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">EMI #</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Due Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((emi) => (
                    <tr key={emi}>
                      <td className="px-4 py-2 text-sm text-gray-900">{emi}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">01-{emi < 10 ? `0${emi}` : emi}-2025</td>
                      <td className="px-4 py-2 text-sm text-gray-900">₹28,500</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Pending</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setShowSchedule(false)}
              className="mt-4 px-5 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansTable;