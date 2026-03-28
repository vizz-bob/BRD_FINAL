import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function ViewOther() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);

  /* ---------------- LOAD PARAMETER (MOCK) ---------------- */

  useEffect(() => {
    // TEMP MOCK (replace with API later)
    const mockItem = {
      id: `OTH-${id}`,
      parameter_name: "Temporary High-Risk PIN",
      parameter_value: "302019",
      valid_from: "2025-09-01",
      valid_to: "2025-09-30",
      status: "Active",
      created_by: "Risk Manager",
      created_at: "2025-09-01T10:15:00",
      updated_by: "Compliance Head",
      updated_at: "2025-09-10T17:40:00",
    };

    setItem(mockItem);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading parameter details...
        </p>
      </MainLayout>
    );
  }

  if (!item) {
    return (
      <MainLayout>
        <p className="text-sm text-red-500">
          Parameter not found
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
              Custom Risk Parameter
            </h1>
            <p className="text-sm text-gray-500">
              View temporary or conditional risk configuration
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(`/risk-management/others/${id}/edit`)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiEdit /> Edit Parameter
        </button>
      </div>

      {/* DETAILS */}
      <div className="space-y-6 max-w-4xl">
        {/* PARAMETER DETAILS */}
        <Section title="Parameter Details">
          <Detail label="Parameter ID" value={item.id} />
          <Detail label="Parameter Name" value={item.parameter_name} />
          <Detail label="Parameter Value" value={item.parameter_value} />
          <Detail label="Valid From" value={item.valid_from} />
          <Detail label="Valid To" value={item.valid_to} />
          <Detail
            label="Status"
            value={<StatusBadge value={item.status} />}
          />
        </Section>

        {/* AUDIT INFO */}
        <Section title="Audit Information">
          <Detail label="Created By" value={item.created_by} />
          <Detail
            label="Created On"
            value={formatDate(item.created_at)}
          />
          <Detail label="Last Updated By" value={item.updated_by} />
          <Detail
            label="Last Updated On"
            value={formatDate(item.updated_at)}
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
