import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function ViewRisk() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [risk, setRisk] = useState(null);

  /* ---------------- LOAD RISK (MOCK) ---------------- */
  useEffect(() => {
    // TEMP MOCK (replace with API later)
    const mockRisk = {
      id: `RISK-${id}`,
      category: "Credit Risk",
      parameter: "Unstable income source",
      severity: "High",
      trigger_event: "Mismatch in income documents",
      status: "Active",
      created_by: "System Admin",
      created_at: "2025-09-12T10:30:00",
      updated_by: "Risk Manager",
      updated_at: "2025-09-15T14:45:00",
    };

    setRisk(mockRisk);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">Loading risk details...</p>
      </MainLayout>
    );
  }

  if (!risk) {
    return (
      <MainLayout>
        <p className="text-sm text-red-500">Risk not found</p>
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
            <h1 className="text-xl font-semibold">Risk Details</h1>
            <p className="text-sm text-gray-500">
              Complete risk definition and audit information
            </p>
          </div>
        </div>

     
      </div>

      {/* DETAILS SECTIONS */}
      <div className="space-y-6 max-w-4xl">
        {/* BASIC DETAILS */}
        <Section title="Risk Information">
          <Detail label="Risk ID" value={risk.id} />
          <Detail label="Risk Category" value={risk.category} />
          <Detail
            label="Risk Severity"
            value={<SeverityBadge value={risk.severity} />}
          />
          <Detail
            label="Risk Parameter"
            value={risk.parameter}
            full
          />
          <Detail
            label="Risk Trigger Event"
            value={risk.trigger_event || "-"}
            full
          />
        </Section>

        {/* STATUS */}
        <Section title="Status">
          <Detail
            label="Current Status"
            value={
              <StatusBadge value={risk.status} />
            }
          />
        </Section>

        {/* AUDIT DETAILS */}
        <Section title="Audit Information">
          <Detail label="Created By" value={risk.created_by} />
          <Detail
            label="Created On"
            value={formatDate(risk.created_at)}
          />
          <Detail label="Last Updated By" value={risk.updated_by} />
          <Detail
            label="Last Updated On"
            value={formatDate(risk.updated_at)}
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

const SeverityBadge = ({ value }) => {
  const colors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[value]}`}
    >
      {value}
    </span>
  );
};

const StatusBadge = ({ value }) => {
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
