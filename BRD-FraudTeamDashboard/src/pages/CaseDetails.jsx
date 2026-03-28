import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import VerificationAccordion from "../components/cases/VerificationAccordion";
import RiskTag from "../components/ui/RiskTag";
import StatusTag from "../components/ui/StatusTag";
import AuditEvent from "../components/cases/AuditEvent";
import PatternTag from "../components/ui/PatternTag";
import BehaviorTag from "../components/ui/BehaviorTag";
import CaseTimeline from "../components/cases/CasesTimeline";

import { getCaseDetails, updateCaseStatus } from "../api/caseDetailsApi";

export default function CaseDetails() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    getCaseDetails(caseId).then(setCaseData);
  }, [caseId]);

  const actionMap = {
    APPROVED: "approve",
    UNDERWRITING: "underwriting",
    REJECTED: "reject",
    BLACKLISTED: "blacklist",
  };

  const handleAction = async (newStatus) => {
    try {
      const action = actionMap[newStatus];
      if (!action) return;
      const updatedCase = await updateCaseStatus(caseId, action);
      setCaseData(updatedCase);
      toast.success(`Case updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update case status");
    }
  };

  if (!caseData) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 lg:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-3 sm:mb-4">Home</h2>

      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">

        <button
          onClick={() => navigate("/cases")}
          className="px-3 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back to Cases
        </button>

        {/* Summary */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-6">
            Case #{caseData.id}
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-600 text-xs sm:text-sm">Name</p>
              <p className="text-sm sm:text-base font-medium text-gray-800">{caseData.applicant.name}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600 text-xs sm:text-sm">Mobile</p>
              <p className="text-sm sm:text-base text-gray-800">{caseData.applicant.mobile}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600 text-xs sm:text-sm">PAN</p>
              <p className="text-sm sm:text-base text-gray-800">{caseData.applicant.pan}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600 text-xs sm:text-sm">Status</p>
              <p className="text-sm sm:text-base text-blue-600 font-semibold">{caseData.workflow.status}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="overflow-x-auto">
          <CaseTimeline stage={caseData.progressStage} />
        </div>

        {/* Risk Engine */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          <div className="bg-white p-3 sm:p-4 shadow rounded-xl">
            <p className="text-xs text-gray-500 mb-1 sm:mb-2">Fraud Score</p>
            <RiskTag score={caseData.fraudEngine.fraudScore} />
          </div>
          <div className="bg-white p-3 sm:p-4 shadow rounded-xl">
            <p className="text-xs text-gray-500 mb-1 sm:mb-2">Synthetic ID</p>
            <StatusTag status={caseData.fraudEngine.syntheticId} />
          </div>
          <div className="bg-white p-3 sm:p-4 shadow rounded-xl">
            <p className="text-xs text-gray-500 mb-1 sm:mb-2">AML Screening</p>
            <StatusTag status={caseData.fraudEngine.aml} />
          </div>
          <div className="bg-white p-3 sm:p-4 shadow rounded-xl">
            <p className="text-xs text-gray-500 mb-1 sm:mb-2">Behavioral</p>
            <BehaviorTag level={caseData.fraudEngine.behavioral} />
          </div>
          <div className="bg-white p-3 sm:p-4 shadow rounded-xl col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 mb-1 sm:mb-2">Pattern Match</p>
            <PatternTag match={caseData.fraudEngine.pattern} />
          </div>
        </div>

        {/* Verifications */}
        <VerificationAccordion verifications={caseData.verifications} />

        {/* Actions */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={() => handleAction("APPROVED")}
              className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction("UNDERWRITING")}
              className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Underwriting
            </button>
            <button
              onClick={() => handleAction("REJECTED")}
              className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Reject
            </button>
            <button
              onClick={() => handleAction("BLACKLISTED")}
              className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Blacklist
            </button>
          </div>
        </div>

        {/* Audit */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Audit Trail</h2>
          <div className="space-y-2">
            {caseData.audit
              .slice()
              .reverse()
              .map((log) => (
                <AuditEvent key={log.id} action={log.action} ts={log.ts} />
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}