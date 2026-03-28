import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CustomizeTemplateView = () => {
  const navigate = useNavigate();

  /* MOCK DATA */
  const template = {
    id: 1,
    name: "Retail Loan Template",
    type: "Loan",
    purpose: "Customer Eligibility",
    requirement: "KYC & Income Proof",
    status: "Active",
    fields: [
      "Customer Name",
      "PAN Number",
      "Aadhaar Number",
      "Monthly Income",
      "Loan Amount",
      "Credit Score",
    ],
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            >
              <FiArrowLeft />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Customize Template</h1>
              <p className="text-sm text-gray-500">
                View customized template configuration
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/customize-template/edit/${template.id}`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700"
          >
            <FiEdit3 /> Edit
          </button>
        </div>

        {/* TEMPLATE INFO */}
        <Card title="Template Information">
          <Info label="Template Name" value={template.name} />
          <Info label="Template Type" value={template.type} />
          <Info label="Purpose of Template" value={template.purpose} />
          <Info label="Template Requirement" value={template.requirement} />
          <Info
            label="Status"
            value={<StatusBadge status={template.status} />}
          />
        </Card>

        {/* FIELD MASTERS */}
        <Card title="Field Masters">
          <div className="flex flex-wrap gap-2">
            {template.fields.map((field, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {field}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CustomizeTemplateView;

/* ---------------- UI HELPERS ---------------- */

const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
    <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div className="text-sm text-gray-800">{value}</div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-3 py-1 text-xs rounded-full ${
      status === "Active"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    }`}
  >
    {status}
  </span>
);
