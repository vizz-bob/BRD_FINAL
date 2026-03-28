import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

// import { documentService } from "../../../services/documentService";

const ViewSanctionDocument = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD DOCUMENT ---------------- */
  useEffect(() => {
    (async () => {
      try {
        /*
        const data = await documentService.getSanctionDocumentById(id);
        setDocument(data);
        */

        // TEMP MOCK DATA
        setDocument({
          id,
          document_type: "KYC Document",
          requirement_type: "Mandatory",
          requirement_stage: "Pre-Sanction",
          requirement_mode: "Digital",
          is_active: true,
          created_at: "2025-01-12",
          updated_at: "2025-02-05",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500">Loading document details...</p>
      </MainLayout>
    );
  }

  if (!document) {
    return (
      <MainLayout>
        <p className="text-gray-500">Document not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
          >
            <FiArrowLeft className="text-gray-700 text-xl" />
          </button>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Sanction Document Details
            </h1>
            <p className="text-sm text-gray-500">
              View document configuration for sanction stage
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(`/documents/sanction/${id}/edit`)
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FiEdit /> Edit
        </button>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-2xl p-8 shadow-md max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <Info label="Document Type" value={document.document_type} />
          <Info label="Requirement Type" value={document.requirement_type} />
          <Info label="Requirement Stage" value={document.requirement_stage} />
          <Info label="Requirement Mode" value={document.requirement_mode} />

          <Info
            label="Status"
            value={
              document.is_active ? "Active" : "Inactive"
            }
            badge
          />

          <Info label="Created On" value={document.created_at} />
          <Info label="Last Updated" value={document.updated_at} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ViewSanctionDocument;

/* ---------------- SMALL UI HELPERS ---------------- */

const Info = ({ label, value, badge }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    {badge ? (
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          value === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {value}
      </span>
    ) : (
      <p className="font-medium text-gray-800">{value}</p>
    )}
  </div>
);
