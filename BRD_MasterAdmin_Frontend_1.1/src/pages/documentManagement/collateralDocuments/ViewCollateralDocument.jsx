import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

// import { documentService } from "../../../services/documentService";

const ViewCollateralDocument = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD COLLATERAL DOCUMENT ---------------- */
  useEffect(() => {
    (async () => {
      try {
        /*
        const data = await documentService.getCollateralDocumentById(id);
        setDocument(data);
        */

        // TEMP MOCK DATA
        setDocument({
          id,
          collateral_category: "Immovable",
          collateral_type: "Property",
          security_coverage_type: "Full",
          mode_of_collateral: "Registered",
          collateral_details: "Residential flat located in Pune",
          loan_to_collateral_value: 75,
          is_active: true,
          created_at: "2025-01-15",
          updated_at: "2025-02-10",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500">Loading collateral document...</p>
      </MainLayout>
    );
  }

  if (!document) {
    return (
      <MainLayout>
        <p className="text-gray-500">Collateral document not found.</p>
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
              Collateral Document Details
            </h1>
            <p className="text-sm text-gray-500">
              View collateral configuration and coverage mapping
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(`/documents/collateral/${id}/edit`)
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FiEdit /> Edit
        </button>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-2xl p-8 shadow-md max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <Info label="Collateral Category" value={document.collateral_category} />
          <Info label="Collateral Type" value={document.collateral_type} />
          <Info label="Security Coverage Type" value={document.security_coverage_type} />
          <Info label="Mode of Collateral" value={document.mode_of_collateral} />

          <Info
            label="Loan to Collateral Value (%)"
            value={`${document.loan_to_collateral_value}%`}
          />

          <Info
            label="Status"
            value={document.is_active ? "Active" : "Inactive"}
            badge
          />

          <div className="md:col-span-2">
            <Info
              label="Collateral Details"
              value={document.collateral_details}
              multiline
            />
          </div>

          <Info label="Created On" value={document.created_at} />
          <Info label="Last Updated" value={document.updated_at} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ViewCollateralDocument;

/* ---------------- SMALL UI HELPERS ---------------- */

const Info = ({ label, value, badge, multiline }) => (
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
    ) : multiline ? (
      <p className="font-medium text-gray-800 leading-relaxed">
        {value}
      </p>
    ) : (
      <p className="font-medium text-gray-800">{value}</p>
    )}
  </div>
);
