import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function ViewMitigation() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [mitigation, setMitigation] = useState(null);

  /* ---------------- LOAD MITIGATION (MOCK) ---------------- */
  useEffect(() => {
    // TEMP MOCK (API later)
    const mockMitigation = {
      id: `MIT-${id}`,
      mitigation_type: "Collateral",
      mitigation_action:
        "Collect property documents and register lien as collateral.",
      associated_risks: [
        "Credit Risk – Unstable income source",
        "Operational Risk – Document mismatch",
      ],
      effectiveness_score: 85,
      status: "Active",
      created_by: "System Admin",
      created_at: "2025-09-14T11:20:00",
      updated_by: "Risk Manager",
      updated_at: "2025-09-18T16:10:00",
    };

    setMitigation(mockMitigation);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading mitigation details...
        </p>
      </MainLayout>
    );
  }

  if (!mitigation) {
    return (
      <MainLayout>
        <p className="text-sm text-red-500">
          Mitigation record not found
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
              Risk Mitigation Details
            </h1>
            <p className="text-sm text-gray-500">
              View mitigation configuration and audit information
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(
              `/risk-management/mitigation/${id}/edit`
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiEdit /> Edit Mitigation
        </button>
      </div>

      {/* DETAILS SECTIONS */}
      <div className="space-y-6 max-w-4xl">
        {/* BASIC DETAILS */}
        <Section title="Mitigation Information">
          <Detail label="Mitigation ID" value={mitigation.id} />
          <Detail
            label="Mitigation Type"
            value={mitigation.mitigation_type}
          />
          <Detail
            label="Effectiveness Score"
            value={`${mitigation.effectiveness_score}%`}
          />
          <Detail
            label="Mitigation Action"
            value={mitigation.mitigation_action}
            full
          />
        </Section>

        {/* ASSOCIATED RISKS */}
        <Section title="Associated Risks">
          <Detail
            label="Linked Risks"
            value={
              <ul className="list-disc pl-4 space-y-1">
                {mitigation.associated_risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            }
            full
          />
        </Section>

        {/* STATUS */}
        <Section title="Status">
          <Detail
            label="Current Status"
            value={<StatusBadge value={mitigation.status} />}
          />
        </Section>

        {/* AUDIT DETAILS */}
        <Section title="Audit Information">
          <Detail label="Created By" value={mitigation.created_by} />
          <Detail
            label="Created On"
            value={formatDate(mitigation.created_at)}
          />
          <Detail label="Last Updated By" value={mitigation.updated_by} />
          <Detail
            label="Last Updated On"
            value={formatDate(mitigation.updated_at)}
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
