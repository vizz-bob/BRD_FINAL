import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const ViewTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    // Fetch template by id (mocked)
    setTemplate({
      name: "Retail Loan Template",
      type: "Loan",
      version: "v1.0",
      uploaded_by: "Admin",
      status: "Active",
    });
  }, [id]);

  if (!template) return null;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Template Details</h1>
          <p className="text-sm text-gray-500">View all template information</p>
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl space-y-3">
        <DetailRow label="Template Name" value={template.name} />
        <DetailRow label="Type" value={template.type} />
        <DetailRow label="Version" value={template.version} />
        <DetailRow label="Uploaded By" value={template.uploaded_by} />
        <DetailRow
          label="Status"
          value={
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                template.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {template.status}
            </span>
          }
        />
      </div>
    </MainLayout>
  );
};

export default ViewTemplate;

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-100 py-2">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm text-gray-800">{value}</span>
  </div>
);
