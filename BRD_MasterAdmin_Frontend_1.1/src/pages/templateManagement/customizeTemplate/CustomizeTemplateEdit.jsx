import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CustomizeTemplateEdit = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "Retail Loan Template",
    type: "Loan",
    purpose: "Customer Eligibility",
    requirement: "KYC & Income Proof",
    fields: [
      "Customer Name",
      "PAN Number",
      "Monthly Income",
    ],
    status: "Active",
  });

  const allFields = [
    "Customer Name",
    "PAN Number",
    "Aadhaar Number",
    "Monthly Income",
    "Loan Amount",
    "Credit Score",
  ];

  const toggleField = (field) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.includes(field)
        ? prev.fields.filter((f) => f !== field)
        : [...prev.fields, field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved Template:", form);
    navigate(-1);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Edit Customize Template</h1>
            <p className="text-sm text-gray-500">
              Update template type, purpose and fields
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-6"
        >
          {/* BASIC DETAILS */}
          <Section title="Template Details">
            <Input
              label="Template Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Select
              label="Template Type"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              options={["Loan", "Credit", "Insurance"]}
            />

            <Input
              label="Purpose of Template"
              value={form.purpose}
              onChange={(e) =>
                setForm({ ...form, purpose: e.target.value })
              }
            />

            <Input
              label="Template Requirement"
              value={form.requirement}
              onChange={(e) =>
                setForm({ ...form, requirement: e.target.value })
              }
            />
          </Section>

          {/* FIELD MASTERS */}
          <Section title="Field Masters">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allFields.map((field) => (
                <label
                  key={field}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.fields.includes(field)}
                    onChange={() => toggleField(field)}
                  />
                  {field}
                </label>
              ))}
            </div>
          </Section>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl text-sm bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700"
            >
              <FiSave /> Save Template
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CustomizeTemplateEdit;

/* ---------------- UI HELPERS ---------------- */

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-sm font-semibold text-gray-700 mb-4">
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 rounded-xl bg-gray-50 outline-none text-sm"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full px-3 py-2 rounded-xl bg-gray-50 outline-none text-sm"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
