import { useState } from "react";
import { loanApplicationAPI } from "../services/loanApplicationService";
import {
  XMarkIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function LoanApplicationDetail({ app, onClose }) {
  const [processing, setProcessing] = useState(false);
  const [remarks, setRemarks] = useState("");

  const isSalaried = app.income_type === "Salaried";

  const handleStatusChange = async (newStatus) => {
    setProcessing(true);
    try {
      await loanApplicationAPI.updateStatus(app.id || app.application_id, newStatus, remarks);
      alert(`Application Moved to ${newStatus}`);
      onClose();
    } catch (err) {
      alert("Status Update Failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleVideoAction = async (decision) => {
    try {
      await loanApplicationAPI.verifyVideo(app.id || app.application_id, decision, "Manual Review");
      alert(`Video ${decision === "approve" ? "Verified" : "Rejected"}`);
    } catch (err) {
      alert("Video Action Failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity backdrop-blur-sm">
      <div className="bg-gray-50 w-full max-w-5xl h-[95vh] sm:h-[95vh] shadow-2xl flex flex-col animate-slide-in rounded-t-2xl sm:rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-start flex-shrink-0 z-10">
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                {app.first_name} {app.last_name}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex-shrink-0 ${
                app.status === "SANCTIONED" ? "bg-green-100 text-green-700 border-green-200"
                : app.status === "REJECTED" ? "bg-red-100 text-red-700 border-red-200"
                : "bg-blue-100 text-blue-700 border-blue-200"
              }`}>
                {app.status?.replace(/_/g, " ")}
              </span>
            </div>
            <div className="mt-1 text-gray-500 text-xs sm:text-sm flex flex-wrap items-center gap-1 sm:gap-3">
              <span className="font-mono">ID: {app.application_id}</span>
              <span className="hidden sm:inline">•</span>
              <span>{app.product_name || "Business Loan"}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition flex-shrink-0">
            <XMarkIcon className="h-5 w-5 sm:h-7 sm:w-7" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">

          {/* SECTION A: Identity */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <SectionHeader title="A. Onboarding & Identity" icon={ShieldCheckIcon} />
            <div className="p-3 sm:p-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              <Field label="First Name" value={app.first_name} />
              <Field label="Last Name" value={app.last_name} />
              <Field label="Mobile" value={app.mobile_no} badge="OTP Verified" badgeColor="green" />
              <Field label="Email" value={app.email} badge="Link Verified" badgeColor="green" />
              <Field label="Date of Birth" value={app.dob} />
              <Field label="Gender" value={app.gender === "M" ? "Male" : app.gender === "F" ? "Female" : "Other"} />
              <Field label="PAN Number" value={app.pan_number} badge="API Verified" badgeColor="blue" />
              <Field label="Aadhaar" value={app.aadhaar_number || "xxxx-xxxx-xxxx"} badge="API Verified" badgeColor="blue" />
            </div>
          </section>

          {/* SECTION B: Address */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <SectionHeader title="B. Profile & Address" icon={MapPinIcon} />
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <Field label="Income Type" value={app.income_type} highlight />
                <Field label="Borrower Type" value="Business" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 pt-3 sm:pt-4 border-t border-gray-100">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                    <MapPinIcon className="h-3.5 w-3.5" /> Residential Address
                  </h4>
                  <div className="text-xs sm:text-sm text-gray-800 leading-relaxed bg-gray-50 p-2.5 sm:p-3 rounded-lg border border-gray-100">
                    {app.res_address_line1}<br />
                    {app.res_address_line2 && <>{app.res_address_line2}<br /></>}
                    {app.res_city}, {app.res_state} - <strong>{app.res_pincode}</strong><br />
                    {app.res_country || "India"}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                    <BuildingOfficeIcon className="h-3.5 w-3.5" /> Business Address (Geo-Fence)
                  </h4>
                  <div className="text-xs sm:text-sm text-gray-800 leading-relaxed bg-gray-50 p-2.5 sm:p-3 rounded-lg border border-gray-100">
                    {app.office_address_line1 || "N/A"}<br />
                    {app.office_address_line2 && <>{app.office_address_line2}<br /></>}
                    {app.office_city}, {app.office_state} - <strong>{app.office_pincode}</strong>
                    {app.is_geo_limit_passed ? (
                      <div className="mt-2 text-xs text-green-600 font-bold flex items-center gap-1">
                        <CheckCircleIcon className="h-3.5 w-3.5" /> Location OK
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-red-600 font-bold">Negative Area</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION C: Financials */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <SectionHeader title="C. Financials" icon={BanknotesIcon} />
            <div className="p-3 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                  <div className="text-xs text-blue-600 font-bold uppercase">Loan Amount Requested</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-900 mt-1">
                    ₹{Number(app.requested_amount).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                  <div className="text-xs text-blue-600 font-bold uppercase">Tenure Requested</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-900 mt-1">{app.requested_tenure} Months</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 border-b pb-2">Business Details</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                  <Field label="Monthly Net Income" value={`₹${Number(app.monthly_income).toLocaleString()}`} />
                  <Field label="Annual Turnover" value={app.annual_turnover ? `₹${app.annual_turnover}` : "N/A"} />
                  <Field label="Business Name" value={app.business_name || "N/A"} />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION D: Bank */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <SectionHeader title="D. Bank & Disbursal" icon={BuildingOfficeIcon} />
            <div className="p-3 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              <Field label="Account Number" value={app.bank_account_number} />
              <Field label="IFSC Code" value={app.ifsc_code} />
              <Field label="Account Type" value={app.account_type} />
              <Field label="Mandate Type" value={app.mandate_type} />
              <Field label="Disbursement Consent" value={app.disbursement_consent ? "Given" : "Pending"} badge={app.disbursement_consent ? "Signed" : "Waiting"} badgeColor={app.disbursement_consent ? "green" : "orange"} />
              <Field label="Penny Drop" value={app.is_penny_drop_verified ? "Success" : "Pending"} badgeColor={app.is_penny_drop_verified ? "green" : "orange"} />
            </div>
          </section>

          {/* SECTION E: Documents */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <SectionHeader title="E. Document Uploads" icon={DocumentTextIcon} />
            <div className="p-3 sm:p-6 space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase">Business Documents</h4>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                <DocItem name="GST Registration Certificate" status="Verified" type="PDF" />
                <DocItem name="Business Address Proof" status="Verified" type="PDF" />
                <DocItem name="Bank Statement (Last 12 Months)" status="Pending Review" type="PDF" />
                <DocItem name="Financial Documents (ITR 3 Yrs + GST)" status="Pending Review" type="PDF" />
                <DocItem name="Business Proof (Trade License)" status="Pending Review" type="PDF" />
              </div>

              <div className="mt-4 sm:mt-6 border-t pt-3 sm:pt-4">
                <h4 className="text-xs font-bold text-orange-600 uppercase mb-3 flex items-center gap-2">
                  <VideoCameraIcon className="h-4 w-4" /> Mandatory: Self-Declaration Video
                </h4>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-orange-900 mb-1">
                      Video KYC Status:
                      <span className={`ml-2 font-bold ${app.is_video_kyc_verified ? "text-green-600" : "text-red-600"}`}>
                        {app.is_video_kyc_verified ? "VERIFIED" : "PENDING"}
                      </span>
                    </div>
                    <p className="text-xs text-orange-700">Required for unsecured business loans.</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleVideoAction("approve")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition">
                      Approve
                    </button>
                    <button onClick={() => handleVideoAction("reject")} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-xs font-medium transition">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="bg-white border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 z-10 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <input
              type="text"
              placeholder="Enter Credit Manager Remarks..."
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="flex gap-2 sm:gap-3">
              <button onClick={() => handleStatusChange("HOLD")} className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition text-sm">
                Hold
              </button>
              <button onClick={() => handleStatusChange("REJECTED")} className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition text-sm shadow-sm">
                Reject
              </button>
              <button onClick={() => handleStatusChange("SANCTIONED")} disabled={app.status === "SANCTIONED"} className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition text-sm shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60">
                <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Sanction</span>
                <span className="xs:hidden">OK</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// HELPERS
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="bg-gray-50 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-gray-200 flex items-center gap-2">
    <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
    <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
  </div>
);

const Field = ({ label, value, badge, badgeColor, highlight }) => (
  <div className={`flex flex-col ${highlight ? "bg-yellow-50 p-2 -m-2 rounded" : ""}`}>
    <span className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">{label}</span>
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{value || "-"}</span>
      {badge && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
          badgeColor === "green" ? "bg-green-100 text-green-700"
          : badgeColor === "blue" ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-600"
        }`}>
          {badge}
        </span>
      )}
    </div>
  </div>
);

const DocItem = ({ name, status, type }) => (
  <div className="flex justify-between items-center p-2.5 sm:p-3 border rounded-lg hover:bg-gray-50 transition gap-2">
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <div className="h-7 w-7 sm:h-8 sm:w-8 bg-red-50 text-red-600 rounded flex items-center justify-center text-[10px] font-bold border border-red-100 flex-shrink-0">
        {type}
      </div>
      <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{name}</span>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className={`text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full font-medium ${status === "Verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}>
        {status}
      </span>
      <button className="text-[10px] sm:text-xs text-primary-600 hover:underline font-medium">View</button>
    </div>
  </div>
);