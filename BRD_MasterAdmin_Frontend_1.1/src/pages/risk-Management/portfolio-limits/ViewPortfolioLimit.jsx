import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function ViewPortfolioLimit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(null);

  /* ---------------- LOAD LIMIT (MOCK) ---------------- */

  useEffect(() => {
    // TEMP MOCK (replace with API later)
    const mockLimit = {
      id: `PL-${id}`,
      product_limit: 500000000,
      geo_limit: 200000000,
      borrower_segment_limit: 150000000,
      threshold_alert: 80,
      status: "Active",
      created_by: "Risk Manager",
      created_at: "2025-09-12T11:20:00",
      updated_by: "Compliance Head",
      updated_at: "2025-09-18T16:10:00",
    };

    setLimit(mockLimit);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading portfolio limit details...
        </p>
      </MainLayout>
    );
  }

  if (!limit) {
    return (
      <MainLayout>
        <p className="text-sm text-red-500">
          Portfolio limit record not found
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
              Portfolio Limit Details
            </h1>
            <p className="text-sm text-gray-500">
              View exposure limits and threshold configuration
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(
              `/risk-management/portfolio-limits/${id}/edit`
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiEdit /> Edit Portfolio Limit
        </button>
      </div>

      {/* DETAILS */}
      <div className="space-y-6 max-w-4xl">
        {/* LIMIT DETAILS */}
        <Section title="Limit Configuration">
          <Detail
            label="Portfolio Limit ID"
            value={limit.id}
          />
          <Detail
            label="Product Limit"
            value={`₹${limit.product_limit.toLocaleString()}`}
          />
          <Detail
            label="Geo Limit"
            value={`₹${limit.geo_limit.toLocaleString()}`}
          />
          <Detail
            label="Borrower Segment Limit"
            value={`₹${limit.borrower_segment_limit.toLocaleString()}`}
          />
          <Detail
            label="Threshold Alert"
            value={`${limit.threshold_alert}%`}
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
          <Detail
            label="Last Updated By"
            value={limit.updated_by}
          />
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
