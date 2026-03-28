import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function ViewRCU() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [rcu, setRcu] = useState(null);

  /* ---------------- LOAD RCU (MOCK) ---------------- */
  useEffect(() => {
    // TEMP MOCK (replace with API later)
    const mockRCU = {
      id: `RCU-${id}`,
      rcu_trigger: "Mismatch in documents",
      investigation_status: "In Progress",
      risk_type: "Operational",
      action_taken:
        "Requested fresh documents and escalated to verification team.",
      status: "Active",
      created_by: "RCU Analyst",
      created_at: "2025-09-12T10:20:00",
      updated_by: "RCU Manager",
      updated_at: "2025-09-15T16:45:00",
    };

    setRcu(mockRCU);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading RCU case details...
        </p>
      </MainLayout>
    );
  }

  if (!rcu) {
    return (
      <MainLayout>
        <p className="text-sm text-red-500">
          RCU case not found
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
              RCU Case Details
            </h1>
            <p className="text-sm text-gray-500">
              View investigation status and actions taken
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(`/risk-management/rcu/${id}/edit`)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiEdit /> Edit RCU Case
        </button>
      </div>

      {/* DETAILS */}
      <div className="space-y-6 max-w-4xl">
        {/* RCU DETAILS */}
        <Section title="RCU Information">
          <Detail label="RCU Case ID" value={rcu.id} />
          <Detail label="RCU Trigger" value={rcu.rcu_trigger} />
          <Detail
            label="Risk Type"
            value={rcu.risk_type}
          />
          <Detail
            label="Investigation Status"
            value={
              <StatusBadge value={rcu.investigation_status} />
            }
          />
          <Detail
            label="Action Taken"
            value={rcu.action_taken}
            full
          />
        </Section>

        {/* STATUS */}
        <Section title="Case Status">
          <Detail
            label="Current Status"
            value={<ActiveBadge value={rcu.status} />}
          />
        </Section>

        {/* AUDIT */}
        <Section title="Audit Information">
          <Detail label="Created By" value={rcu.created_by} />
          <Detail
            label="Created On"
            value={formatDate(rcu.created_at)}
          />
          <Detail label="Last Updated By" value={rcu.updated_by} />
          <Detail
            label="Last Updated On"
            value={formatDate(rcu.updated_at)}
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
  const colors = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Closed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[value]}`}
    >
      {value}
    </span>
  );
};

const ActiveBadge = ({ value }) => {
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
