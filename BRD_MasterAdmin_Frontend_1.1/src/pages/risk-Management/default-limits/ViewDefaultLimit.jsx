import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function ViewDefaultLimit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(null);

  /* ---------------- LOAD DEFAULT LIMIT (MOCK) ---------------- */

  useEffect(() => {
    // TEMP MOCK (replace with API later)
    const mockLimit = {
      id: `DL-${id}`,
      acceptable_npa: 5,
      default_threshold_days: 90,
      default_trigger: "EMI Missed",
      default_impact_score: 80,
      status: "Active",
      created_by: "Risk Manager",
      created_at: "2025-09-14T10:45:00",
      updated_by: "Compliance Head",
      updated_at: "2025-09-20T16:30:00",
    };

    setLimit(mockLimit);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading default limit details...
        </p>
      </MainLayout>
    );
  }

  if (!limit) {
    return (
      <MainLayout>
        <p className="text-sm text-red-500">
          Default limit record not found
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
              Default Limit Details
            </h1>
            <p className="text-sm text-gray-500">
              View NPA thresholds, default triggers, and impact
              scores
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(
              `/risk-management/default-limits/${id}/edit`
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiEdit /> Edit Default Limit
        </button>
      </div>

      {/* DETAILS */}
      <div className="space-y-6 max-w-4xl">
        {/* DEFAULT CONFIGURATION */}
        <Section title="Default Configuration">
          <Detail label="Default Limit ID" value={limit.id} />
          <Detail
            label="Acceptable NPA"
            value={`${limit.acceptable_npa}%`}
          />
          <Detail
            label="Default Threshold"
            value={`${limit.default_threshold_days} days`}
          />
          <Detail
            label="Default Trigger"
            value={limit.default_trigger}
          />
          <Detail
            label="Default Impact Score"
            value={limit.default_impact_score}
          />
          <Detail
            label="Status"
            value={<StatusBadge value={limit.status} />}
          />
        </Section>

        {/* AUDIT */}
        <Section title="Audit Information">
          <Detail label="Created By" value={limit.created_by} />
          <Detail
            label="Created On"
            value={formatDate(limit.created_at)}
          />
          <Detail label="Last Updated By" value={limit.updated_by} />
          <Detail
            label="Last Updated On"
            value={formatDate(limit.updated_at)}
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

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div className="text-sm font-medium text-gray-900">
      {value}
    </div>
  </div>
);

const StatusBadge = ({ value }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      value === "Active"
        ? "bg-green-100 text-green-700"
        : "bg-gray-200 text-gray-600"
    }`}
  >
    {value}
  </span>
);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString();
};
