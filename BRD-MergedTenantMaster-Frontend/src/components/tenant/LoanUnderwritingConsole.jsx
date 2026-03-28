import React, { useState, useEffect } from "react";
import {
  ChartPieIcon,
  DocumentMagnifyingGlassIcon,
  VideoCameraIcon,
  CheckBadgeIcon,
  BanknotesIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  CalculatorIcon,
  IdentificationIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { loanApplicationAPI } from "../../services/loanApplicationService";
import LoanApplicationDetail from "./LoanApplicationDetail";

/**
 * --------------------------------------------------------------------------
 * LOAN UNDERWRITING CONSOLE (ADMIN SIDE)
 * --------------------------------------------------------------------------
 * A comprehensive dashboard for Credit Managers to review, verify, and
 * sanction personal loan applications.
 */

export default function LoanUnderwritingConsole({ appId, onClose }) {
  // ------------------------------------------------------------------------
  // 1. STATE & DATA
  // ------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState("snapshot");
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoError, setVideoError] = useState("");

  // Simulated Fetch
  useEffect(() => {
    // In a real app, fetch data from API using appId
    // Mocking Data for "Ankur Sati" based on User Context
    setTimeout(() => {
      setAppData({
        id: "PL-2025-8839",
        status: "UNDERWRITING",
        personal: {
          name: "Ankur Sati",
          dob: "1995-08-12",
          mobile: "9876543210",
          pan: "ABCDE1234F",
          score: 768,
        },
        financial: {
          requested_amount: 500000,
          tenure: 24,
          income: 85000,
          obligations: 15000,
          type: "Salaried",
        },
        kyc: {
          video_verified: false,
          penny_drop: true,
          docs_verified: true,
        },
        documents: [
          {
            id: "doc1",
            name: "PAN Card",
            type: "PDF",
            status: "Verified",
            uploaded_at: "2025-12-01",
          },
          {
            id: "doc2",
            name: "Address Proof (Electricity Bill)",
            type: "PDF",
            status: "Pending",
            uploaded_at: "2025-12-02",
          },
          {
            id: "doc3",
            name: "Bank Statement (12 months)",
            type: "PDF",
            status: "Pending",
            uploaded_at: "2025-12-02",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [appId]);

  // ------------------------------------------------------------------------
  // 2. LOGIC & CALCULATIONS (PHASE 5)
  // ------------------------------------------------------------------------
  const calculateMetrics = () => {
    if (!appData) return {};
    const monthlyIncome = appData.financial.income;
    const existingObligations = appData.financial.obligations;

    // Proposed EMI (Mock calc @ 14% ROI)
    const P = appData.financial.requested_amount;
    const r = 14 / 1200;
    const n = appData.financial.tenure;
    const proposedEMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const totalObligations = existingObligations + proposedEMI;
    const foir = (totalObligations / monthlyIncome) * 100;
    const netCashFlow = monthlyIncome - totalObligations - 15000; // 15k living exp

    return {
      proposedEMI: Math.round(proposedEMI),
      foir: foir.toFixed(2),
      netCashFlow: Math.round(netCashFlow),
      isRisky: foir > 60,
    };
  };

  const metrics = calculateMetrics();

  // ------------------------------------------------------------------------
  // 3. ACTION HANDLERS
  // ------------------------------------------------------------------------
  const handleDecision = async (decision) => {
    if (!remarks) {
      alert("Please enter remarks before taking a decision.");
      return;
    }
    setProcessingAction(true);
    try {
      // Simulate API call to backend
      await new Promise((r) => setTimeout(r, 1500));

      let newStatus = appData.status;
      if (decision === "SANCTION") newStatus = "SANCTIONED";
      if (decision === "REJECT") newStatus = "REJECTED";
      if (decision === "HOLD") newStatus = "HOLD";

      setAppData((prev) => ({ ...prev, status: newStatus }));
      alert(`Application ${decision} successfully.`);
    } catch (e) {
      alert("Action Failed");
    } finally {
      setProcessingAction(false);
    }
  };

  const verifyVideo = (approved) => {
    setAppData((prev) => ({
      ...prev,
      kyc: { ...prev.kyc, video_verified: approved },
    }));
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setVideoDuration(0);
    setVideoError("");
  };

  const handleAcceptVideo = () => {
    if (!videoUrl) {
      setVideoError("Please upload a video before accepting.");
      return;
    }
    if (videoDuration < 60) {
      setVideoError("Video must be at least 60 seconds long to be accepted.");
      return;
    }
    // mark verified
    verifyVideo(true);
    alert("Video accepted and verified.");
  };

  const toggleDocumentStatus = (docId, newStatus) => {
    setAppData((prev) => ({
      ...prev,
      documents: prev.documents.map((d) =>
        d.id === docId ? { ...d, status: newStatus } : d
      ),
      kyc: {
        ...prev.kyc,
        docs_verified: prev.documents.every((d) =>
          d.id === docId ? newStatus === "Verified" : d.status === "Verified"
        ),
      },
    }));
  };

  // ------------------------------------------------------------------------
  // 4. RENDER HELPERS
  // ------------------------------------------------------------------------
  const StatusBadge = ({ status }) => {
    const colors = {
      NEW: "bg-blue-100 text-blue-700",
      UNDERWRITING: "bg-yellow-100 text-yellow-700",
      SANCTIONED: "bg-primary-100 text-primary-700",
      DISBURSED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold border ${
          colors[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        activeTab === id
          ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );

  // ------------------------------------------------------------------------
  // 5. MAIN RENDER
  // ------------------------------------------------------------------------
  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading Console...</div>
    );

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex overflow-hidden font-sans">
      {/* --- SIDEBAR NAVIGATION --- */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {appData.personal.name}
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-1">
            ID: {appData.id}
          </p>
          <div className="mt-3">
            <StatusBadge status={appData.status} />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <TabButton id="snapshot" icon={ChartPieIcon} label="Risk Snapshot" />
          <TabButton
            id="details"
            icon={IdentificationIcon}
            label="Application Details"
          />
          <TabButton
            id="documents"
            icon={DocumentMagnifyingGlassIcon}
            label="Document Review"
          />
          <TabButton id="video" icon={VideoCameraIcon} label="Video KYC" />
          <div className="pt-4 mt-4 border-t border-gray-100">
            <TabButton
              id="decision"
              icon={CheckBadgeIcon}
              label="Final Decision"
            />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Exit Console
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* VIEW: SNAPSHOT (Calculations) */}
        {activeTab === "snapshot" && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900">
              Underwriting Snapshot
            </h1>

            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-xs text-gray-500 uppercase font-bold">
                  CIBIL Score
                </div>
                <div className="text-3xl font-extrabold text-green-600 mt-2">
                  {appData.personal.score}
                </div>
                <div className="text-xs text-green-700 mt-1">Excellent</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-xs text-gray-500 uppercase font-bold">
                  Proposed EMI
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">
                  ₹{metrics.proposedEMI.toLocaleString()}
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-xs text-gray-500 uppercase font-bold">
                  Net Cash Flow
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-2">
                  ₹{metrics.netCashFlow.toLocaleString()}
                </div>
              </div>
              <div
                className={`p-5 rounded-xl border shadow-sm ${
                  metrics.isRisky
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="text-xs text-gray-500 uppercase font-bold">
                  FOIR %
                </div>
                <div
                  className={`text-3xl font-extrabold mt-2 ${
                    metrics.isRisky ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {metrics.foir}%
                </div>
                <div className="text-xs mt-1 font-medium">
                  {metrics.isRisky ? "High Risk" : "Within Limits"}
                </div>
              </div>
            </div>

            {/* Automated Checks Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-800">
                Automated Knock-Out Checks
              </div>
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-gray-50">
                  {[
                    { check: "Age Check (21-60)", status: "Pass" },
                    { check: "Geo-Fencing (Negative Area)", status: "Pass" },
                    { check: "Internal Dedupe", status: "Pass" },
                    {
                      check: "Penny Drop Verification",
                      status: appData.kyc.penny_drop ? "Pass" : "Fail",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-3">{row.check}</td>
                      <td className="px-6 py-3 text-right">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: VIDEO KYC (Phase 7) */}
        {activeTab === "video" && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Video KYC Verification
            </h1>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video (MP4/WEBM)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="w-full"
                />
                {videoError && (
                  <div className="text-xs text-red-600 mt-2">{videoError}</div>
                )}
              </div>

              {videoUrl && (
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    onLoadedMetadata={(e) =>
                      setVideoDuration(Math.floor(e.target.duration))
                    }
                  />
                  <div className="absolute left-4 top-4 bg-white/80 text-black px-3 py-1 rounded text-xs font-medium">
                    Duration: {videoDuration}s
                  </div>
                </div>
              )}

              <div className="mt-2 grid grid-cols-2 gap-6">
                <button
                  onClick={handleAcceptVideo}
                  className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${
                    appData.kyc.video_verified
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "border-gray-200 hover:border-green-400 text-gray-600"
                  }`}
                >
                  <CheckBadgeIcon className="h-6 w-6" /> Accept Video
                </button>
                <button
                  onClick={() => {
                    setVideoFile(null);
                    setVideoUrl(null);
                    setVideoDuration(0);
                    verifyVideo(false);
                  }}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-600 hover:text-red-700 flex items-center justify-center gap-2 font-bold transition-all"
                >
                  <XCircleIcon className="h-6 w-6" /> Reject Video
                </button>
              </div>

              <div className="text-xs text-gray-500">
                Script to read aloud: "My name is [Full Name]. I confirm this
                video is my self-declaration for loan application."
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DOCUMENT REVIEW */}
        {activeTab === "documents" && (
          <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Document Review
            </h1>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-700">
                Uploaded Documents
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {appData.documents && appData.documents.length > 0 ? (
                  appData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary-50 text-primary-700 rounded flex items-center justify-center text-xs font-bold border border-primary-100">
                          {doc.type}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {doc.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Uploaded: {doc.uploaded_at}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            doc.status === "Verified"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {doc.status}
                        </span>
                        <button
                          onClick={() =>
                            toggleDocumentStatus(doc.id, "Verified")
                          }
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-md"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() =>
                            toggleDocumentStatus(doc.id, "Rejected")
                          }
                          className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-md"
                        >
                          Reject
                        </button>
                        <button className="text-xs text-primary-600 hover:underline">
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    No documents uploaded.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DETAILS (Application Details) */}
        {activeTab === "details" &&
          (() => {
            // Map the console's appData shape to the flat `app` shape expected by LoanApplicationDetail
            const names = appData.personal.name?.split(" ") || ["", ""];
            const mappedApp = {
              application_id: appData.id,
              first_name: names[0] || "",
              last_name: names.slice(1).join(" ") || "",
              status: appData.status,
              product_name: "Personal Loan",
              income_type: appData.financial.type,
              requested_amount: appData.financial.requested_amount,
              requested_tenure: appData.financial.tenure,
              monthly_income: appData.financial.income,
              employment_type: appData.financial.employment_type || "Private",
              employer_name: appData.financial.employer_name || "",
              annual_turnover: appData.financial.annual_turnover || null,
              business_name: appData.financial.business_name || "",
              is_video_kyc_verified: appData.kyc.video_verified,
              is_penny_drop_verified: appData.kyc.penny_drop,
              res_address_line1: appData.res_address_line1 || "",
              res_address_line2: appData.res_address_line2 || "",
              res_city: appData.res_city || "",
              res_state: appData.res_state || "",
              res_pincode: appData.res_pincode || "",
              res_country: appData.res_country || "",
              office_address_line1: appData.office_address_line1 || "",
              office_city: appData.office_city || "",
              office_pincode: appData.office_pincode || "",
              is_geo_limit_passed: appData.is_geo_limit_passed || false,
              pan_number: appData.personal.pan || "",
              aadhaar_number: appData.personal.aadhaar || "",
              mobile_no: appData.personal.mobile || "",
              email: appData.personal.email || "",
              dob: appData.personal.dob || "",
              gender: appData.personal.gender || "",
              bank_account_number: appData.bank_account_number || "",
              ifsc_code: appData.ifsc_code || "",
              account_type: appData.account_type || "",
              mandate_type: appData.mandate_type || "",
              disbursement_consent: appData.disbursement_consent || false,
            };

            return (
              <div className="animate-fade-in">
                <LoanApplicationDetail
                  app={mappedApp}
                  onClose={() => setActiveTab("snapshot")}
                />
              </div>
            );
          })()}

        {/* VIEW: DECISION (Phase 5/6) */}
        {activeTab === "decision" && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Final Credit Decision
            </h1>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
              <h3 className="font-bold text-gray-800 mb-4">
                Summary of Verifications
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Credit Score & Financials</span>
                  <span
                    className={
                      metrics.isRisky
                        ? "text-red-600 font-bold"
                        : "text-green-600 font-bold"
                    }
                  >
                    {metrics.isRisky ? "High Risk" : "Safe"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Document Verification</span>
                  <span className="text-green-600 font-bold">Verified</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Video KYC</span>
                  <span
                    className={
                      appData.kyc.video_verified
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {appData.kyc.video_verified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Credit Manager Remarks
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-32"
                placeholder="Enter detailed justification for approval or rejection..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <button
                  onClick={() => handleDecision("HOLD")}
                  disabled={processingAction}
                  className="py-3 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Hold Case
                </button>
                <button
                  onClick={() => handleDecision("REJECT")}
                  disabled={processingAction}
                  className="py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDecision("SANCTION")}
                  disabled={processingAction || !appData.kyc.video_verified}
                  className="py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!appData.kyc.video_verified ? "Video KYC Pending" : ""}
                >
                  Sanction Loan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
