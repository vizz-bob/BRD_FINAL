import React, { useState } from 'react';
import { 
  CheckCircle, TrendingUp, Calendar, DollarSign, 
  FileText, Download, CreditCard, AlertCircle,
  ArrowLeft, Clock, Upload, Banknote, Eye,
  CheckSquare, XSquare
} from 'lucide-react';

const Loans = ({ onSelect, selectedId }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const loans = [
    { 
      id: 'LN-5001',
      leadName: 'Sneha Patel',
      leadId: 'LD-5524',
      productType: 'Business Loan',
      disbursedAmount: '₹25,00,000',
      emiAmount: '₹28,500',
      emiStartDate: '01 Feb 2025',
      disbursalDate: '20 Jan 2025',
      tenure: '120 months',
      totalEmis: 120,
      paidEmis: 0,
      repaymentStatus: 'On-track',
      nextEmiDate: '01 Feb 2025',
      outstandingAmount: '₹25,00,000',
      agreementUploaded: true
    },
    { 
      id: 'LN-4998',
      leadName: 'Rajesh Kumar',
      leadId: 'LD-5501',
      productType: 'Home Loan',
      disbursedAmount: '₹45,00,000',
      emiAmount: '₹42,000',
      emiStartDate: '01 Dec 2024',
      disbursalDate: '15 Nov 2024',
      tenure: '240 months',
      totalEmis: 240,
      paidEmis: 2,
      repaymentStatus: 'On-track',
      nextEmiDate: '01 Feb 2025',
      outstandingAmount: '₹44,16,000',
      agreementUploaded: true
    },
    { 
      id: 'LN-4995',
      leadName: 'Priya Iyer',
      leadId: 'LD-5489',
      productType: 'Personal Loan',
      disbursedAmount: '₹8,00,000',
      emiAmount: '₹24,000',
      emiStartDate: '01 Nov 2024',
      disbursalDate: '20 Oct 2024',
      tenure: '36 months',
      totalEmis: 36,
      paidEmis: 2,
      repaymentStatus: 'Delayed',
      nextEmiDate: '01 Jan 2025',
      outstandingAmount: '₹7,52,000',
      agreementUploaded: true
    },
    { 
      id: 'LN-4992',
      leadName: 'Anil Sharma',
      leadId: 'LD-5478',
      productType: 'Car Loan',
      disbursedAmount: '₹12,00,000',
      emiAmount: '₹22,000',
      emiStartDate: '01 Sep 2024',
      disbursalDate: '15 Aug 2024',
      tenure: '60 months',
      totalEmis: 60,
      paidEmis: 5,
      repaymentStatus: 'On-track',
      nextEmiDate: '01 Feb 2025',
      outstandingAmount: '₹10,90,000',
      agreementUploaded: true
    },
    { 
      id: 'LN-4988',
      leadName: 'Meera Desai',
      leadId: 'LD-5465',
      productType: 'Education Loan',
      disbursedAmount: '₹15,00,000',
      emiAmount: '₹18,500',
      emiStartDate: '01 Jul 2024',
      disbursalDate: '15 Jun 2024',
      tenure: '120 months',
      totalEmis: 120,
      paidEmis: 7,
      repaymentStatus: 'Defaulted',
      nextEmiDate: '01 Dec 2024',
      outstandingAmount: '₹13,70,500',
      agreementUploaded: true
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'On-track': 'bg-emerald-100 text-emerald-700',
      'Delayed': 'bg-amber-100 text-amber-700',
      'Defaulted': 'bg-red-100 text-red-700',
      'Pre-closed': 'bg-indigo-100 text-indigo-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const generatePaymentSchedule = (loan) => {
    const schedule = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 1; i <= Math.min(12, loan.totalEmis); i++) {
      const month = (i - 1) % 12;
      const year = 2024 + Math.floor((i - 1) / 12);
      
      schedule.push({
        emiNumber: i,
        dueDate: `01 ${months[month]} ${year}`,
        amount: loan.emiAmount,
        status: i <= loan.paidEmis ? 'Paid' : i === loan.paidEmis + 1 ? 'Due' : 'Upcoming'
      });
    }
    
    return schedule;
  };

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setShowDetails(true);
  };

  if (showDetails && selectedLoan) {
    const paymentSchedule = generatePaymentSchedule(selectedLoan);
    const completionPercentage = ((selectedLoan.paidEmis / selectedLoan.totalEmis) * 100).toFixed(1);

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDetails(false)} 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Loan Details</h3>
              <p className="text-[9px] text-slate-500 font-mono">{selectedLoan.id}</p>
            </div>
          </div>
          <CheckCircle className="w-4 h-4 text-emerald-600" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center pb-6 border-b border-gray-50">
            <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-emerald-100">
              <span className="text-3xl font-black text-white">{selectedLoan.leadName.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 mt-2">{selectedLoan.leadName}</h2>
            <p className="text-[11px] font-bold text-emerald-600 tracking-widest uppercase">
              {selectedLoan.productType} • {selectedLoan.id}
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white shadow-xl shadow-emerald-200">
            <p className="text-[10px] text-white font-bold uppercase mb-4">Disbursed Loan Summary</p>
            <p className="text-3xl font-black mb-1">{selectedLoan.disbursedAmount}</p>
            <p className="text-[10px] text-white/80 font-bold uppercase mb-6">Total Loan Amount</p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-[9px] text-white/70 uppercase font-bold">EMI Amount</p>
                <p className="text-lg font-black">{selectedLoan.emiAmount}</p>
              </div>
              <div>
                <p className="text-[9px] text-white/70 uppercase font-bold">Outstanding</p>
                <p className="text-lg font-black">{selectedLoan.outstandingAmount}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-600 uppercase">Repayment Progress</p>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-900">
                  {selectedLoan.paidEmis} / {selectedLoan.totalEmis} EMIs Paid
                </span>
                <span className="text-sm font-black text-emerald-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Started: {selectedLoan.emiStartDate}
                </span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${getStatusColor(selectedLoan.repaymentStatus)}`}>
                  {selectedLoan.repaymentStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <p className="text-[9px] text-gray-500 uppercase font-bold">Next EMI Date</p>
              </div>
              <p className="text-lg font-black text-gray-900">{selectedLoan.nextEmiDate}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <p className="text-[9px] text-gray-500 uppercase font-bold">Tenure</p>
              </div>
              <p className="text-lg font-black text-gray-900">{selectedLoan.tenure}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                <p className="text-[9px] text-gray-500 uppercase font-bold">Disbursal Date</p>
              </div>
              <p className="text-sm font-black text-gray-900">{selectedLoan.disbursalDate}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <p className="text-[9px] text-gray-500 uppercase font-bold">Agreement</p>
              </div>
              <div className="flex items-center gap-1">
                {selectedLoan.agreementUploaded ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-600">Uploaded</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-600">Pending</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-gray-600 uppercase">Payment Schedule</p>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Download className="w-3 h-3" /> Download Full
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left text-[9px] font-black text-gray-600 uppercase p-3">EMI #</th>
                      <th className="text-left text-[9px] font-black text-gray-600 uppercase p-3">Due Date</th>
                      <th className="text-right text-[9px] font-black text-gray-600 uppercase p-3">Amount</th>
                      <th className="text-center text-[9px] font-black text-gray-600 uppercase p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentSchedule.map((emi, idx) => (
                      <tr key={idx} className="border-t border-gray-200 hover:bg-white transition-colors">
                        <td className="p-3 text-xs font-bold text-gray-900">EMI {emi.emiNumber}</td>
                        <td className="p-3 text-xs text-gray-700">{emi.dueDate}</td>
                        <td className="p-3 text-xs font-bold text-gray-900 text-right">{emi.amount}</td>
                        <td className="p-3 text-center">
                          {emi.status === 'Paid' ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                              <CheckSquare className="w-3 h-3" /> Paid
                            </span>
                          ) : emi.status === 'Due' ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                              <AlertCircle className="w-3 h-3" /> Due
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              <Clock className="w-3 h-3" /> Upcoming
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95">
              <Download className="w-4 h-4" /> Agreement
            </button>
            <button className="py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
              <Banknote className="w-4 h-4" /> Pre-closure
            </button>
          </div>

          {selectedLoan.repaymentStatus === 'Delayed' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">Payment Delayed</p>
                <p className="text-xs text-amber-700 mt-1">EMI payment is overdue. Please contact customer for collection.</p>
              </div>
            </div>
          )}

          {selectedLoan.repaymentStatus === 'Defaulted' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <XSquare className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900">Defaulted Loan</p>
                <p className="text-xs text-red-700 mt-1">Multiple EMIs missed. Escalate to recovery team immediately.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Disbursed Loans</h3>
        <CheckCircle className="w-4 h-4 text-emerald-600" />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loans.map((loan) => (
          <div 
            key={loan.id} 
            onClick={() => onSelect(loan)} 
            className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-emerald-50 ${selectedId === loan.id ? 'bg-emerald-100 border-l-4 border-emerald-600' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{loan.leadName}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{loan.id} • {loan.productType}</p>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${getStatusColor(loan.repaymentStatus)}`}>
                {loan.repaymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Loan Amount</p>
                <p className="text-sm font-black text-emerald-600">{loan.disbursedAmount}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">EMI Amount</p>
                <p className="text-sm font-black text-gray-900">{loan.emiAmount}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Progress</p>
                <p className="text-xs font-bold text-gray-900">{loan.paidEmis}/{loan.totalEmis} EMIs</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Next EMI</p>
                <p className="text-[10px] font-bold text-gray-900">{loan.nextEmiDate}</p>
              </div>
            </div>

            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full"
                  style={{ width: `${(loan.paidEmis / loan.totalEmis) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Disbursed: {loan.disbursalDate}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(loan);
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Eye className="w-3 h-3" /> View Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loans;