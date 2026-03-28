import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function ViewFraud() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [fraud, setFraud] = useState(null);

  /* ---------------- LOAD FRAUD (MOCK) ---------------- */
  useEffect(() => {
    // TEMP MOCK (replace with API later)
    const mockFraud = {
    
      fraud_category: "Documentation Fraud",
      modus_operandi:
        "Forged income statements and altered bank statements were submitted during loan verification.",
      fraud_status: "Confirmed",
      reporting_authority: "Compliance Team",
      case_status: "Active",
      created_by: "Risk Analyst",
      created_at: "2025-09-11T10:15:00",
      updated_by: "Compliance Head",
      updated_at: "2025-09-16T14:40:00",
    };

    setFraud(mockFraud);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading fraud case details...
        </p>
      </MainLayout>
    );
  }

  if (!fraud) {
    return (
      <MainLayout>
        <p className="text-sm text-red-500">
          Fraud case not found
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1 className="text-xl font-semibold">
              Fraud Case Details
            </h1>
            <p className="text-sm text-gray-500">
              View fraud information, status, and audit trail
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(`/risk-management/fraud/${id}/edit`)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiEdit /> Edit Fraud Case
        </button>
      </div>

      {/* DETAILS */}
      <div className="space-y-6 max-w-4xl">
        {/* FRAUD DETAILS */}
        <Section title="Fraud Information">
        
          <Detail
            label="Fraud Category"
            value={fraud.fraud_category}
          />
          <Detail
            label="Fraud Status"
            value={<FraudStatusBadge value={fraud.fraud_status} />}
          />
          <Detail
            label="Reporting Authority"
            value={fraud.reporting_authority}
          />
          <Detail
            label="Modus Operandi"
            value={fraud.modus_operandi}
            full
          />
        </Section>

        {/* CASE STATUS */}
        <Section title="Case Status">
          <Detail
            label="Current Status"
            value={<CaseStatusBadge value={fraud.case_status} />}
          />
        </Section>

        {/* AUDIT */}
        <Section title="Audit Information">
          <Detail label="Created By" value={fraud.created_by} />
          <Detail
            label="Created On"
            value={formatDate(fraud.created_at)}
          />
          <Detail label="Last Updated By" value={fraud.updated_by} />
          <Detail
            label="Last Updated On"
            value={formatDate(fraud.updated_at)}
          />
        </Section>
      </div>
    </MainLayout>
  );
}

/* ---------------- HELPERS ---------------- */

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h2 className="text-sm font-semibold text-gray-700 mb-4">
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Detail = ({ label, value, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div className="text-sm font-medium text-gray-900">
      {value}
    </div>
  </div>
);

const FraudStatusBadge = ({ value }) => {
  const colors = {
    Suspected: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-red-100 text-red-700",
    Cleared: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[value]}`}
    >
      {value}
    </span>
  );
};

const CaseStatusBadge = ({ value }) => {
  const isActive = value === "Active";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {value}
    </span>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString();
};
