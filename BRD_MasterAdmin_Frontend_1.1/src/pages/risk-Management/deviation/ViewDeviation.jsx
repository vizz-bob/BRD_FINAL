import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function ViewDeviation() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [deviation, setDeviation] = useState(null);

  /* ---------------- LOAD DEVIATION (MOCK) ---------------- */
  useEffect(() => {
    // TEMP MOCK (replace with API later)
    const mockDeviation = {
     
      deviation_type: "Income",
      justification:
        "Seasonal income variation observed in borrower profile.",
      approving_authority: "Branch Manager",
      impact_level: "Medium",
      status: "Active",
      created_by: "Loan Officer",
      created_at: "2025-09-10T11:30:00",
      updated_by: "Risk Manager",
      updated_at: "2025-09-14T15:45:00",
    };

    setDeviation(mockDeviation);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading deviation details...
        </p>
      </MainLayout>
    );
  }

  if (!deviation) {
    return (
      <MainLayout>
        <p className="text-sm text-red-500">
          Deviation record not found
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
              Deviation Details
            </h1>
            <p className="text-sm text-gray-500">
              View deviation information and approval context
            </p>
          </div>
        </div>

     
      </div>

      {/* DETAILS SECTIONS */}
      <div className="space-y-6 max-w-4xl">
        {/* BASIC DETAILS */}
        <Section title="Deviation Information">
         
          <Detail
            label="Deviation Type"
            value={deviation.deviation_type}
          />
          <Detail
            label="Impact Level"
            value={
              <ImpactBadge value={deviation.impact_level} />
            }
          />
          <Detail
            label="Approving Authority"
            value={deviation.approving_authority}
          />
          <Detail
            label="Justification"
            value={deviation.justification}
            full
          />
        </Section>

        {/* STATUS */}
        <Section title="Status">
          <Detail
            label="Current Status"
            value={<StatusBadge value={deviation.status} />}
          />
        </Section>

        {/* AUDIT DETAILS */}
        <Section title="Audit Information">
          <Detail label="Created By" value={deviation.created_by} />
          <Detail
            label="Created On"
            value={formatDate(deviation.created_at)}
          />
          <Detail
            label="Last Updated By"
            value={deviation.updated_by}
          />
          <Detail
            label="Last Updated On"
            value={formatDate(deviation.updated_at)}
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

const ImpactBadge = ({ value }) => {
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
