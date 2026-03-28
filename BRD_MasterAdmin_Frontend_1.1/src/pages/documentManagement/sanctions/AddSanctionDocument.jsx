import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// import { documentService } from "../../../services/documentService";

/* ---------------- CONSTANTS ---------------- */
const REQUIREMENT_TYPES = ["Mandatory", "Optional"];
const REQUIREMENT_STAGES = ["Pre-Sanction", "Post-Sanction"];
const REQUIREMENT_MODES = ["Physical", "Digital", "eSign"];

const initialForm = {
  document_type: "",
  requirement_type: "",
  requirement_stage: "",
  requirement_mode: "",
  status: "Active",
};

const AddSanctionDocument = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- VALIDATION ---------------- */
  const validate = (values) => {
    const err = {};

    if (!values.document_type.trim()) {
      err.document_type = "Document type is required";
    }

    if (!values.requirement_type) {
      err.requirement_type = "Requirement type is required";
    }

    if (!values.requirement_stage) {
      err.requirement_stage = "Requirement stage is required";
    }

    if (!values.requirement_mode) {
      err.requirement_mode = "Requirement mode is required";
    }

    return err;
  };

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const payload = {
        document_type: form.document_type,
        requirement_type: form.requirement_type,
        requirement_stage: form.requirement_stage,
        requirement_mode: form.requirement_mode,
        is_active: form.status === "Active",
      };

      /*
      await documentService.addSanctionDocument(payload);
      */

      navigate("/documents/sanction");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
        >
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Add Sanction Document
          </h1>
          <p className="text-sm text-gray-500">
            Define document requirements for loan sanction stage
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* DOCUMENT TYPE */}
          <FormField label="Document Type" error={errors.document_type}>
            <input
              type="text"
              name="document_type"
              value={form.document_type}
              onChange={handleChange}
              placeholder="e.g. KYC Document"
              className="mt-2 p-3 rounded-xl bg-gray-50 focus:bg-white shadow-sm outline-none"
            />
          </FormField>

          {/* REQUIREMENT TYPE */}
          <FormField
            label="Requirement Type"
            error={errors.requirement_type}
          >
            <select
              name="requirement_type"
              value={form.requirement_type}
              onChange={handleChange}
              className="mt-2 p-3 rounded-xl bg-gray-50 shadow-sm outline-none"
            >
              <option value="">Select Requirement Type</option>
              {REQUIREMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </FormField>

          {/* REQUIREMENT STAGE */}
          <FormField
            label="Requirement Stage"
            error={errors.requirement_stage}
          >
            <select
              name="requirement_stage"
              value={form.requirement_stage}
              onChange={handleChange}
              className="mt-2 p-3 rounded-xl bg-gray-50 shadow-sm outline-none"
            >
              <option value="">Select Stage</option>
              {REQUIREMENT_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormField>

          {/* REQUIREMENT MODE */}
          <FormField
            label="Requirement Mode"
            error={errors.requirement_mode}
          >
            <select
              name="requirement_mode"
              value={form.requirement_mode}
              onChange={handleChange}
              className="mt-2 p-3 rounded-xl bg-gray-50 shadow-sm outline-none"
            >
              <option value="">Select Mode</option>
              {REQUIREMENT_MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </FormField>

          {/* STATUS */}
          <FormField label="Status">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-2 p-3 rounded-xl bg-gray-50 shadow-sm outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </FormField>

          {/* SUBMIT */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white transition
                ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              <FiSave />
              {submitting ? "Saving..." : "Save Document"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddSanctionDocument;

/* ---------------- SMALL UI HELPER ---------------- */

const FormField = ({ label, error, children }) => (
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-medium">
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);
