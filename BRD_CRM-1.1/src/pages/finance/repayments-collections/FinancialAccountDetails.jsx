import React, { useRef, useState } from 'react';
import {
  Receipt, PhoneForwarded, History, Banknote,
  BarChart3, Plus, FileText, TrendingUp,
  AlertCircle, ShieldCheck, Zap, Scale, Gavel,
  ArrowLeft, Calculator, Upload, MessageCircle,
  Phone, Smartphone, CheckCircle, Wallet, AlertTriangle,
  Clock, User, Calendar, FileCheck, X
} from 'lucide-react';
import { CollectionService, RecoveryService, RepaymentService } from '../../../services/financeService';

// FinancialAccountDetails Component
const FinancialAccountDetails = ({ account, mode, onBack }) => {
  const [txnId, setTxnId] = useState('');
  const [legalNoticeSent, setLegalNoticeSent] = useState(true);

  // const fileInputRef = useRef(null);
  // const [files, setFiles] = useState([]);

  const receiptInputRef = useRef(null);
  const legalInputRef = useRef(null);

  const [receiptFiles, setReceiptFiles] = useState([]);
  const [legalFiles, setLegalFiles] = useState([]);


  const handleButtonClick = (ref) => {
    ref.current?.click();
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setReceiptFiles((prev) => [...prev, file]);

    const formData = new FormData();
    formData.append("receipt", file);
    formData.append("transaction_id", txnId);

    try {
      await RepaymentService.uploadRecipt(account.id, formData);
      alert("Receipt uploaded successfully!");
    } catch {
      alert("Failed to upload receipt!");
    }

    e.target.value = null;
  };

  const handleLegalUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLegalFiles((prev) => [...prev, file]);

    const formData = new FormData();
    formData.append("file", file);  // IMPORTANT: backend field name

    try {
      await RecoveryService.uploadDocument(account.id, formData);
      alert("Legal document uploaded successfully!");
    } catch {
      alert("Failed to upload legal document!");
    }

    e.target.value = null;
  };

  const removeFile = (index, setFileState) => {
    setFileState((prev) => prev.filter((_, i) => i !== index));
  };


  // const handleButtonClick = () => {
  //   fileInputRef.current.click();
  // };

  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files);

  //   // Append new files instead of replacing
  //   setFiles((prev) => [...prev, ...selectedFiles]);

  //   // Reset input so same file can be uploaded again if needed
  //   e.target.value = null;
  // };

  // const removeFile = (index) => {
  //   setFiles((prev) => prev.filter((_, i) => i !== index));
  // };

  const handleEscalate = async () => {
    try {
      const res = await CollectionService.esclateToRecovery(account.id);
      alert("Account escalated to recovery successfully!");
    }
    catch (err) {
      alert("Failed to escalate account!");
    }
  }

  const markSettled = async () => {
    try {
      const res = await RecoveryService.markSettled(account.id);
      alert("Account marked as settled!");
    } catch (err) {
      alert("Failed to mark account as settled!");
    }
  }

  if (!account) return (
    <div className="h-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-8 text-center text-gray-400 font-bold uppercase text-[10px]">
      Select Account to View Financial Status
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <button onClick={onBack} className="lg:hidden p-2 text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
          {mode === 'recovery' ? 'Recovery Case Management' : 'Post-Disbursal Account'}
        </span>
        <button className="p-2 text-slate-600 hover:bg-white rounded-lg transition-colors"><History className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-center pb-6 border-b border-gray-50">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-100">
              <span className="text-3xl font-black text-white">{account.name?.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-emerald-100">
              {mode === 'recovery' ? <Gavel className="w-4 h-4 text-indigo-500 fill-indigo-500" /> : <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500" />}
            </div>
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-2">{account.name}</h2>
          <p className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase">
            {`Loan NO • ${account.loan_no}`}
          </p>
        </div>

        {mode === 'repayments' && (
          <div className="space-y-4">
            <div className="bg-indigo-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-xl shadow-slate-200">
              <div className="relative z-10">
                <p className="text-[10px] text-white font-bold uppercase mb-4">Meticulous Ledger</p>
                <p className="text-3xl font-black">₹3,42,100</p>
                <p className="text-[10px] text-white font-bold uppercase mt-1 tracking-wider">Outstanding Balance</p>
                <div className="mt-6 flex justify-between border-t border-white/10 pt-4">
                  <div><p className="text-[9px] text-white uppercase font-bold">Auto-Late Fee</p><p className="font-bold text-red-400">₹1,250</p></div>
                  <div><p className="text-[9px] text-white uppercase font-bold">EMI Count</p><p className="font-bold">04 / 12</p></div>
                </div>
              </div>
              <Calculator className="absolute right-[-15px] bottom-[-15px] w-24 h-24 text-white/5 -rotate-12" />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-gray-600 uppercase">Transaction ID Integrity</label>
                  {txnId.length > 5 && <span className="text-emerald-600 flex items-center gap-1 text-[9px] font-bold">No Duplicates <CheckCircle className="w-3 h-3" /></span>}
                </div>
                <input type="text" value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="Enter Transaction ID" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs font-mono outline-none" />
              </div>


              <div>
                {/* Hidden file input */}
                {/* <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                /> */}
                <input
                  ref={receiptInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleReceiptUpload}
                />


                <button type="button" onClick={() => handleButtonClick(receiptInputRef)} className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
                  <Upload className="w-4 h-4" /> Upload Receipt
                </button>

                {/* Uploaded file list */}
                {/* {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                      >
                        <span className="truncate text-gray-700">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )} */}


                {receiptFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs">
                    <span className="truncate text-gray-700">{file.name}</span>
                    <button onClick={() => removeFile(index, setReceiptFiles)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}


              </div>


            </div>
          </div>
        )}

        {mode === 'collections' && (
          <div className="space-y-5">
            <div className="bg-red-100 border border-red-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-red-600 uppercase">Recovery Pulse</p>
                <p className="text-lg font-black text-red-700">{account.dpd || '12 Days'} Overdue</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <div className="bg-white border-2 border-red-100 p-4 rounded-xl space-y-4">
              <h4 className="text-[10px] font-black text-red-600 uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Log Promise to Pay (PTP)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Commit Date</label>
                  <input type="date" className="w-full bg-gray-50 p-2 rounded-lg text-xs font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Commit Amount</label>
                  <input type="number" placeholder="₹" className="w-full bg-gray-50 p-2 rounded-lg text-xs font-bold" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Interaction Log</p>
              <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs font-bold outline-none">
                <option>Select Call Outcome</option>
                <option>Switched Off</option>
                <option>Not Reachable</option>
                <option>PTP Captured</option>
                <option>Wrong Number</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex-1 py-2 bg-slate-50 text-[10px] font-bold rounded-lg border border-gray-200">Call SMS History</button>
                <button className="flex-1 py-2 bg-slate-50 text-[10px] font-bold rounded-lg border border-gray-200">WhatsApp Log</button>
              </div>
            </div>
            <button onClick={handleEscalate} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">
              <Scale className="w-5 h-5" /> ESCALATE TO RECOVERY
            </button>
          </div>
        )}

        {mode === 'recovery' && (
          <div className="space-y-5">
            <div className="bg-indigo-100 border-2 border-red-600 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase">NPA Recovery Case</p>
                  <p className="text-2xl font-black text-indigo-600">{account.overdue || '₹15,000'}</p>
                </div>
                <Gavel className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-indigo-600">
                <div>
                  <p className="text-[9px] text-indigo-600 uppercase font-bold">Escalated On</p>
                  <p className="text-xs font-bold text-indigo-900">{account.escalatedOn || '01 May 2025'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-indigo-600 uppercase font-bold">Days in Recovery</p>
                  <p className="text-xs font-bold text-indigo-900">12 Days</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-indigo-200 p-4 rounded-xl space-y-4">
              <h4 className="text-[12px] font-black text-indigo-600 uppercase flex items-center gap-2">
                <Scale className="w-4 h-4" /> Recovery Stage Tracking
              </h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Recovery Stage</label>
                  <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs font-bold outline-none">
                    <option>Soft Notice</option>
                    <option>Legal Notice</option>
                    <option>Field Visit</option>
                    <option>Court Case</option>
                    <option>Settled</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Recovery Mode</label>
                  <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs font-bold outline-none">
                    <option>Legal</option>
                    <option>Field Visit</option>
                    <option>Telephonic</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Assigned Agent</label>
                  <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs font-bold outline-none">
                    <option>{account.assignedAgent || 'Agent K'}</option>
                    <option>Legal Team A</option>
                    <option>Field Agent M</option>
                    <option>Agent P</option>
                    <option>Recovery Manager</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase">Follow-up Date</label>
                    <input type="date" className="w-full bg-gray-50 p-2 rounded-lg text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase">Amount Collected</label>
                    <input type="number" placeholder="₹" className="w-full bg-gray-50 p-2 rounded-lg text-xs font-bold" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-amber-700 uppercase">Legal Notice Sent</p>
                  <p className="text-xs text-amber-600 mt-1">Track formal notice status</p>
                </div>
                <button onClick={() => setLegalNoticeSent(!legalNoticeSent)} className={`relative w-12 h-6 rounded-full transition-colors ${legalNoticeSent ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${legalNoticeSent ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>

            {/* <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
              <label className="text-[10px] font-black text-gray-600 uppercase flex items-center gap-2">
                <FileCheck className="w-4 h-4" /> Settlement Documents
              </label>
              <button className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
                <Upload className="w-4 h-4" /> Upload Legal Documents
              </button>
              <p className="text-[9px] text-gray-500 text-center">Notices, receipts, agreements, court orders</p>
            </div> */}


            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
              <label className="text-[10px] font-black text-gray-600 uppercase flex items-center gap-2">
                <FileCheck className="w-4 h-4" /> Settlement Documents
              </label>

              {/* Hidden file input */}
              {/* <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              /> */}


              <input
                ref={legalInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleLegalUpload}
              />

              {/* Upload button */}
              <button
                type="button"
                onClick={() => handleButtonClick(legalInputRef)}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Upload className="w-4 h-4" />
                Upload Legal Documents
              </button>

              {/* Uploaded file list */}
              {/* {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                    >
                      <span className="truncate text-gray-700">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}



                  

                </div>
              )} */}


              {legalFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs">
                  <span className="truncate text-gray-700">{file.name}</span>
                  <button onClick={() => removeFile(index, setLegalFiles)} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}




              <p className="text-[9px] text-gray-500 text-center">
                Notices, receipts, agreements, court orders
              </p>
            </div>



            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Settlement Summary</label>
              <textarea placeholder="Enter final remarks, negotiation details, or case closure notes..." className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs outline-none min-h-[80px]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={markSettled} className="py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-95">
                <CheckCircle className="w-4 h-4" /> Mark Settled
              </button>
              <button className="py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
                <Banknote className="w-4 h-4" /> Payment Link
              </button>
            </div>
          </div>
        )}

        {mode !== 'recovery' && (
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Automated System Triggers</p>
            <div className="grid grid-cols-3 gap-2">
              <button className="p-3 bg-indigo-100 text-indigo-600 rounded-xl flex flex-col items-center gap-1 hover:bg-indigo-200 transition-all">
                <MessageCircle className="w-5 h-5" /> <span className="text-[8px] font-black tracking-tight">3-DAY</span>
              </button>
              <button className="p-3 bg-red-100 text-red-600 rounded-xl flex flex-col items-center gap-1 hover:bg-red-200 transition-all">
                <Smartphone className="w-5 h-5" /> <span className="text-[8px] font-black tracking-tight">1-DAY</span>
              </button>
              <button className="p-3 bg-green-100 text-green-700 rounded-xl flex flex-col items-center gap-1 hover:bg-green-200 transition-all">
                <Phone className="w-5 h-5" /> <span className="text-[8px] font-black tracking-tight">CALL</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default FinancialAccountDetails;