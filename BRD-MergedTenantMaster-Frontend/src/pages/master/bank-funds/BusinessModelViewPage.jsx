import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { bankFundService } from "../../../services/bankFundService";

const BusinessModelViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModel() {
      try {
        const data = await bankFundService.getBusinessModel(id);
        setModel(data);
      } catch (err) {
        console.error("Failed to fetch business model:", err);
        alert("Error fetching business model");
      } finally {
        setLoading(false);
      }
    }
    fetchModel();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!model) return null;

  return (
    <div className="max-w-4xl">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/business-model")}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Business Model Details</h1>
            <p className="text-gray-500 text-sm">View model configuration</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/business-model/edit/${id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiEdit3 /> Edit
        </button>
      </div>

      {/* MODEL DETAILS CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-5 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b pb-2">
          Model Details
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ViewField label="Model Name"                    value={model.model_name} />
          <ViewField label="Model Type"                    value={model.model_type} />
          <ViewField
            label="Revenue Share / Margin Value"
            value={model.revenue_value ? `${model.revenue_value}%` : "—"}
          />
          <ViewField
            label="Status"
            value={
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  model.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {model.status}
              </span>
            }
          />

          {model.description && (
            <div className="md:col-span-2">
              <ViewField label="Model Description" value={model.description} />
            </div>
          )}

          {model.linked_partners?.length > 0 && (
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Linked Partners / DSA
              </p>
              <div className="flex flex-wrap gap-2">
                {model.linked_partners.map((p, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {p.name || p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AUDIT FIELDS CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            System Audit Fields
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#eab308",
                display: "inline-block",
              }}
            />
            Auto-Generated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuditField label="Version Number *" value={model.version_number || "—"} />
          <AuditField label="User ID *"        value={model.created_by     || "—"} />
          <AuditField label="Created At *"     value={model.created_at     || "—"} />
          <AuditField label="Updated At *"     value={model.updated_at     || "—"} />
        </div>

        <p className="text-xs text-gray-400">
          These fields are immutable and maintained for regulatory compliance
          and audit traceability.
        </p>
      </div>
    </div>
  );
};

export default BusinessModelViewPage;

/* ---------------- HELPERS ---------------- */
const ViewField = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
  </div>
);

const AuditField = ({ label, value }) => (
  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-sm font-medium text-gray-700">{value}</p>
  </div>
);