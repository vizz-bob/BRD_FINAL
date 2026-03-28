import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  X,
  CheckCircle2,
  Clock,
  Upload,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
  Banknote,
  ChevronDown,
  ChevronUp,
  Download,
  Send
} from 'lucide-react';
import { loanApplicationService } from '../../../services/pipelineService';

// ─── Dummy extended data keyed by App ID ────────────────────────────────────
const APP_DETAILS = {
  'APP-001': {
    documents: [
      { name: 'PAN Card', status: 'uploaded', uploadedOn: '2025-05-10' },
      { name: 'Aadhaar Card', status: 'uploaded', uploadedOn: '2025-05-10' },
      { name: 'Salary Slip (Last 3 months)', status: 'uploaded', uploadedOn: '2025-05-12' },
      { name: 'Bank Statement (6 months)', status: 'pending', uploadedOn: null },
      { name: 'Employment Letter', status: 'pending', uploadedOn: null },
      { name: 'Property Documents', status: 'rejected', uploadedOn: '2025-05-11' },
    ],
    timeline: [
      { label: 'Application Created', date: '15 May 2025', done: true },
      { label: 'Documents Submitted', date: '—', done: false },
      { label: 'Under Review', date: '—', done: false },
      { label: 'Credit Appraisal', date: '—', done: false },
      { label: 'Sanction / Rejection', date: '—', done: false },
      { label: 'Disbursement', date: '—', done: false },
    ],
    applicantDetails: {
      dob: '12 March 1985',
      occupation: 'Salaried – Software Engineer',
      annualIncome: '₹18,00,000',
      existingLoans: '₹8,200 / month',
      creditScore: 742,
    },
    propertyDetails: {
      propertyType: 'Residential Flat',
      location: 'Sector 42, Gurugram, Haryana',
      estimatedValue: '₹52,00,000',
    }
  },
  'APP-002': {
    documents: [
      { name: 'PAN Card', status: 'uploaded', uploadedOn: '2025-05-08' },
      { name: 'Aadhaar Card', status: 'uploaded', uploadedOn: '2025-05-08' },
      { name: 'Salary Slip (Last 3 months)', status: 'uploaded', uploadedOn: '2025-05-09' },
      { name: 'Bank Statement (6 months)', status: 'uploaded', uploadedOn: '2025-05-09' },
      { name: 'Employment Letter', status: 'uploaded', uploadedOn: '2025-05-10' },
      { name: 'Form 16 (Last 2 years)', status: 'uploaded', uploadedOn: '2025-05-10' },
    ],
    timeline: [
      { label: 'Application Created', date: '14 May 2025', done: true },
      { label: 'Documents Submitted', date: '14 May 2025', done: true },
      { label: 'Under Review', date: '15 May 2025', done: false },
      { label: 'Credit Appraisal', date: '—', done: false },
      { label: 'Sanction / Rejection', date: '—', done: false },
      { label: 'Disbursement', date: '—', done: false },
    ],
    applicantDetails: {
      dob: '7 August 1990',
      occupation: 'Salaried – Marketing Manager',
      annualIncome: '₹14,40,000',
      existingLoans: '₹4,100 / month',
      creditScore: 718,
    },
    propertyDetails: null, // personal loan – no property
  }
};

// ─── EMI Calculator (pure) ──────────────────────────────────────────────────
function calcEMI(principal, annualRate, months) {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

// ─── Main Component ─────────────────────────────────────────────────────────
const LoanApplication = () => {
  const [applications, setApplications] = useState([]);

  const mapApplication = (item) => {
    const rawAmount = parseFloat(item.requested_amount);
    const rawTenure = item.tenure_months;

    const documentsArray = item.documents || [];

    return {
      id: item.id,   // 1 → APP-001
      leadName: item.lead_name,
      productType: item.product_type,
      requestedAmount: rawAmount,
      rawAmount: rawAmount,
      tenure: `${rawTenure} months`,
      rawTenure: rawTenure,
      interestType: item.interest_type,
      status: item.application_status,
      applicationDate: item.created_at.split("T")[0],
      documentsUploaded: documentsArray.length,
      totalDocuments: documentsArray.length
    };
  };

  const fetchApplications = async () => {
    const res = await loanApplicationService.list();
    setApplications(res.data.map(mapApplication));
  }

  useEffect(() => {
    fetchApplications();
  }, [])

  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null); // opens the detail modal
  const [activeTab, setActiveTab] = useState('overview'); // tab inside modal
  const [formData, setFormData] = useState({
    lead_name: "",
    product_type: "Home Loan",
    requested_amount: "",
    tenure_months: "",
    interest_type: "Fixed",
    documents: []
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData(prev => ({
      ...prev,
      documents: files
    }));
  };
  const handleSubmit = async (status) => {
    try {
      const payload = new FormData();

      payload.append("lead_name", formData.lead_name);
      payload.append("product_type", formData.product_type);
      payload.append("requested_amount", formData.requested_amount);
      payload.append("tenure_months", formData.tenure_months);
      payload.append("interest_type", formData.interest_type);
      payload.append("application_status", status);

      formData.documents.forEach((file) => {
        payload.append("documents", file);
      });

      await loanApplicationService.create(payload);

      await fetchApplications(); // refresh list

      setShowForm(false);

      // reset form
      setFormData({
        lead_name: "",
        product_type: "Home Loan",
        requested_amount: "",
        tenure_months: "",
        interest_type: "Fixed",
        documents: []
      });

    } catch (error) {
      console.error("Loan creation failed:", error);
    }
  };


  const statusColors = {
    'Draft': 'bg-gray-100 text-gray-700',
    'Submitted': 'bg-indigo-100 text-indigo-700',
    'Under Review': 'bg-yellow-100 text-yellow-700',
    'Approved': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700'
  };

  // ── EMI stats derived from selected app ──
  const emiData = useMemo(() => {
    if (!selectedApp) return null;
    const emi = calcEMI(selectedApp.rawAmount, selectedApp.interestRate, selectedApp.rawTenure);
    const totalPay = emi * selectedApp.rawTenure;
    const totalInterest = totalPay - selectedApp.rawAmount;
    return { emi, totalPay, totalInterest };
  }, [selectedApp]);

  // ── Doc status icon ──
  const docIcon = (status) => {
    if (status === 'uploaded') return <CheckCircle2 size={18} className="text-green-500" />;
    if (status === 'rejected') return <AlertCircle size={18} className="text-red-500" />;
    return <Clock size={18} className="text-amber-500" />;
  };

  const fmt = (n) => '₹' + n.toLocaleString('en-IN');

  // ──────────────────────────────────────────────────────────────────────────
  // MODAL
  // ──────────────────────────────────────────────────────────────────────────
  const renderModal = () => {
    if (!selectedApp) return null;
    const detail = APP_DETAILS[selectedApp.id];
    const tabs = ['overview', 'documents', 'emi'];

    return (
      /* backdrop */
      <div
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm"
        style={{ paddingTop: '48px' }}
        onClick={() => setSelectedApp(null)}
      >
        {/* modal card */}
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-96px)] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── header ── */}
          <div className="sticky top-0 bg-white border-b border-gray-100 z-10 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                    {selectedApp.id}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg ${statusColors[selectedApp.status]}`}>
                    {selectedApp.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1.5">{selectedApp.leadName}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Applied on {selectedApp.applicationDate}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-700 transition">
                <X size={20} />
              </button>
            </div>

            {/* tabs */}
            <div className="flex gap-1 mt-4 bg-gray-100 rounded-xl p-1">
              {tabs.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={[
                    'flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all',
                    activeTab === t ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  ].join(' ')}
                >
                  {t === 'emi' ? 'EMI Breakdown' : t}
                </button>
              ))}
            </div>
          </div>

          {/* ── tab body ── */}
          <div className="p-5">

            {/* ─── OVERVIEW ─── */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* top stat cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <Banknote size={18} className="text-indigo-500" />, label: 'Requested', value: selectedApp.requestedAmount },
                    { icon: <Calendar size={18} className="text-purple-500" />, label: 'Tenure', value: selectedApp.tenure },
                    { icon: <TrendingUp size={18} className="text-green-500" />, label: 'Rate', value: `${selectedApp.interestRate}%` },
                  ].map((s, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="flex justify-center mb-1.5">{s.icon}</div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{s.label}</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* applicant info */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User size={15} className="text-gray-400" />
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Applicant Details</h4>
                  </div>
                  <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
                    {Object.entries(detail.applicantDetails).map(([key, val]) => {
                      const labels = {
                        dob: 'Date of Birth',
                        occupation: 'Occupation',
                        annualIncome: 'Annual Income',
                        existingLoans: 'Existing EMIs',
                        creditScore: 'Credit Score'
                      };
                      return (
                        <div key={key} className="flex justify-between items-center px-4 py-2.5">
                          <span className="text-xs text-gray-500">{labels[key]}</span>
                          <span className={`text-xs font-bold ${key === 'creditScore' ? (val >= 700 ? 'text-green-600' : 'text-amber-600') : 'text-gray-800'}`}>
                            {val}
                            {key === 'creditScore' && <span className="ml-1 font-normal text-gray-400">(Good)</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* property info – only for home loan */}
                {detail.propertyDetails && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={15} className="text-gray-400" />
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Property Details</h4>
                    </div>
                    <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
                      {[
                        ['Type', detail.propertyDetails.propertyType],
                        ['Location', detail.propertyDetails.location],
                        ['Est. Value', detail.propertyDetails.estimatedValue],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between items-center px-4 py-2.5">
                          <span className="text-xs text-gray-500">{l}</span>
                          <span className="text-xs font-bold text-gray-800">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* timeline */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Application Timeline</h4>
                  <div className="relative pl-5">
                    {/* vertical line */}
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />
                    {detail.timeline.map((step, i) => (
                      <div key={i} className="relative flex items-start gap-3 mb-4 last:mb-0">
                        {/* dot */}
                        <div className={[
                          'relative z-10 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 -ml-5',
                          step.done ? 'bg-indigo-600' : 'bg-white border-2 border-gray-300'
                        ].join(' ')}>
                          {step.done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* action row */}
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  {selectedApp.status === 'Draft' && (
                    <button className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                      <Send size={14} /> Submit Application
                    </button>
                  )}
                  <button className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              </div>
            )}

            {/* ─── DOCUMENTS ─── */}
            {activeTab === 'documents' && (
              <div className="space-y-3">
                {/* progress bar */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-600">
                    {selectedApp.documentsUploaded} of {selectedApp.totalDocuments} uploaded
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600">
                    {Math.round((selectedApp.documentsUploaded / selectedApp.totalDocuments) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${(selectedApp.documentsUploaded / selectedApp.totalDocuments) * 100}%` }}
                  />
                </div>

                {/* doc list */}
                <div className="mt-4 space-y-2">
                  {detail.documents.map((doc, i) => (
                    <div key={i} className={[
                      'flex items-center justify-between p-3.5 rounded-xl border transition-all',
                      doc.status === 'uploaded' ? 'bg-green-50 border-green-100' :
                        doc.status === 'rejected' ? 'bg-red-50 border-red-100' :
                          'bg-gray-50 border-gray-200'
                    ].join(' ')}>
                      <div className="flex items-center gap-3">
                        {docIcon(doc.status)}
                        <div>
                          <p className="text-xs font-bold text-gray-800">{doc.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {doc.status === 'uploaded'
                              ? `Uploaded ${doc.uploadedOn}`
                              : doc.status === 'rejected'
                                ? 'Re-upload required'
                                : 'Awaiting upload'}
                          </p>
                        </div>
                      </div>
                      {doc.status === 'uploaded' && (
                        <button className="text-indigo-500 hover:text-indigo-700 transition">
                          <Download size={15} />
                        </button>
                      )}
                      {(doc.status === 'pending' || doc.status === 'rejected') && (
                        <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">
                          <Upload size={13} /> Upload
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── EMI BREAKDOWN ─── */}
            {activeTab === 'emi' && emiData && (
              <div className="space-y-5">
                {/* big EMI card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white text-center">
                  <p className="text-[11px] font-semibold opacity-70 uppercase tracking-widest mb-1">Monthly EMI</p>
                  <p className="text-3xl font-bold">{fmt(Math.round(emiData.emi))}</p>
                  <p className="text-[11px] opacity-60 mt-1">for {selectedApp.rawTenure} months @ {selectedApp.interestRate}% {selectedApp.interestType}</p>
                </div>

                {/* breakdown cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Principal', value: selectedApp.rawAmount, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Total Interest', value: emiData.totalInterest, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Total Payable', value: emiData.totalPay, color: 'text-green-600', bg: 'bg-green-50' },
                  ].map((c, i) => (
                    <div key={i} className={`${c.bg} rounded-xl p-3 text-center`}>
                      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">{c.label}</p>
                      <p className={`text-sm font-bold ${c.color} mt-1`}>{fmt(Math.round(c.value))}</p>
                    </div>
                  ))}
                </div>

                {/* visual ratio bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wide">
                    <span>Principal</span>
                    <span>Interest</span>
                  </div>
                  <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-100">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-700"
                      style={{ width: `${(selectedApp.rawAmount / emiData.totalPay) * 100}%` }}
                    />
                    <div className="bg-amber-400 h-full flex-1" />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] font-bold text-indigo-600">{((selectedApp.rawAmount / emiData.totalPay) * 100).toFixed(1)}%</span>
                    <span className="text-[10px] font-bold text-amber-600">{((emiData.totalInterest / emiData.totalPay) * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* yearly table */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Yearly Breakdown</h4>
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-4 gap-0 text-[10px] font-bold text-gray-400 uppercase tracking-wide px-4 py-2 border-b border-gray-200">
                      <span>Year</span><span>Principal</span><span>Interest</span><span className="text-right">Balance</span>
                    </div>
                    {(() => {
                      const rows = [];
                      let balance = selectedApp.rawAmount;
                      const r = selectedApp.interestRate / 12 / 100;
                      const totalYears = Math.ceil(selectedApp.rawTenure / 12);
                      for (let y = 1; y <= Math.min(totalYears, 5); y++) {
                        let yearPrincipal = 0, yearInterest = 0;
                        const months = y < totalYears ? 12 : ((selectedApp.rawTenure - 1) % 12) + 1;
                        for (let m = 0; m < months; m++) {
                          if (balance <= 0) break;
                          const interest = balance * r;
                          const principal = Math.min(emiData.emi - interest, balance);
                          yearInterest += interest;
                          yearPrincipal += principal;
                          balance -= principal;
                        }
                        rows.push({ year: y, principal: yearPrincipal, interest: yearInterest, balance: Math.max(balance, 0) });
                      }
                      return rows.map((row, i) => (
                        <div key={i} className={`grid grid-cols-4 gap-0 px-4 py-2 text-xs ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <span className="font-bold text-gray-700">Yr {row.year}</span>
                          <span className="text-indigo-600 font-semibold">{fmt(Math.round(row.principal))}</span>
                          <span className="text-amber-600 font-semibold">{fmt(Math.round(row.interest))}</span>
                          <span className="text-right text-gray-700 font-bold">{fmt(Math.round(row.balance))}</span>
                        </div>
                      ));
                    })()}
                    {selectedApp.rawTenure > 60 && (
                      <div className="px-4 py-2 text-[10px] text-gray-400 text-center border-t border-gray-200">
                        Showing first 5 years of {Math.ceil(selectedApp.rawTenure / 12)} years
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN LIST VIEW
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* modal rendered via portal-style overlay */}
      {renderModal()}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Loan Applications</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          New Application
        </button>
      </div>

      {/* ── Create form (unchanged structure) ── */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Loan Application</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Name</label>
              <input name="lead_name"
                value={formData.lead_name}
                onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Select or search lead" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
              <select name="product_type"
                value={formData.product_type}
                onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                <option>Home Loan</option><option>Personal Loan</option><option>Car Loan</option><option>Business Loan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requested Amount</label>
              <input name="requested_amount"
                value={formData.requested_amount}
                onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="₹" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (months)</label>
              <input name="tenure_months"
                value={formData.tenure_months}
                onChange={handleChange} type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 240" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Type</label>
              <select name="interest_type"
                value={formData.interest_type}
                onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                <option>Fixed</option><option>Floating</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents (KYC & Income Proof)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />

            <label
              htmlFor="fileUpload"
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer block"
            >
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">
                PAN, Aadhar, Salary Slips, Bank Statements
              </p>
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => handleSubmit("Draft")} className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">Save as Draft</button>
            <button onClick={() => handleSubmit("Submitted")} className="px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">Submit Application</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">Cancel</button>
          </div>
        </div>
      )}

      {/* ── Applications Table ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['App ID', 'Lead Name', 'Product', 'Amount', 'Tenure', 'Documents', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.leadName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.productType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.requestedAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.tenure}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{app.documentsUploaded}/{app.totalDocuments}</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${app.documentsUploaded === app.totalDocuments ? 'bg-green-500' : 'bg-indigo-500'}`}
                          style={{ width: `${(app.documentsUploaded / app.totalDocuments) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>{app.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => { setSelectedApp(app); setActiveTab('overview'); }}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
