import React, { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { interestService } from "../../../../services/productManagementService";

/* ================= OPTIONS ================= */

const BENCHMARK_TYPE_OPTIONS = [
  { label: "MCLR", value: "MCLR" },
  { label: "RBI Rate", value: "RBI_RATE" },
  { label: "Base Rate", value: "BASE_RATE" },
];

const BENCHMARK_FREQUENCY_OPTIONS = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Quarterly", value: "QUARTERLY" },
];

const INTEREST_TYPE_OPTIONS = [
  { label: "Fixed", value: "FIXED" },
  { label: "Floating", value: "FLOATING" },
];

const ACCRUAL_STAGE_OPTIONS = [
  { label: "Pre-EMI", value: "PRE_EMI" },
  { label: "Post-EMI", value: "POST_EMI" },
];

const ACCRUAL_METHOD_OPTIONS = [
  { label: "Simple", value: "SIMPLE" },
  { label: "Compound", value: "COMPOUND" },
];

/* ================= FIELD COMPONENTS ================= */

const FormLabel = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

const StyledSelect = ({ label, value, options, placeholder, onChange, error }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800
        bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        hover:border-gray-400 transition-all duration-150
        ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
    >
      <option value="" disabled>{placeholder || "Select..."}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const StyledInput = ({ label, type = "text", value, onChange, placeholder, error }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || ""}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800
        placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
        focus:border-transparent hover:border-gray-400 transition-all duration-150
        ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

/* ================= MAIN MODAL COMPONENT ================= */

const AddInterest = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    benchmark_type: "",
    benchmark_frequency: "",
    benchmark_rate: "",
    mark_up: "",
    interest_type: "",
    accrual_stage: "",
    accrual_method: "",
    interest_rate: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = (v) => {
    const e = {};
    if (!v.benchmark_type) e.benchmark_type = "Benchmark type is required";
    if (!v.benchmark_frequency) e.benchmark_frequency = "Benchmark frequency is required";
    if (v.benchmark_rate === "") e.benchmark_rate = "Benchmark rate is required";
    if (v.mark_up === "") e.mark_up = "Mark up is required";
    if (!v.interest_type) e.interest_type = "Interest type is required";
    if (!v.accrual_stage) e.accrual_stage = "Accrual stage is required";
    if (!v.accrual_method) e.accrual_method = "Accrual method is required";
    if (v.interest_rate === "") e.interest_rate = "Interest rate is required";
    return e;
  };

  const handleChange = (name, value) => {
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (fieldErrors[name]) {
      setFieldErrors(validate(updated));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await interestService.createInterest(form);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to create interest:", err);
      setError(err?.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* ---- HEADER ---- */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Interest Configuration</h2>
            <p className="text-sm text-gray-500 mt-0.5">Define benchmark and interest calculation rules</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* ---- SCROLLABLE BODY ---- */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-8">

          {/* BENCHMARK CONFIGURATION */}
          <Section title="Benchmark Configuration">
            <StyledSelect
              label="Benchmark Type *"
              value={form.benchmark_type}
              options={BENCHMARK_TYPE_OPTIONS}
              placeholder="Select benchmark type"
              onChange={(e) => handleChange("benchmark_type", e.target.value)}
              error={fieldErrors.benchmark_type}
            />

            <StyledSelect
              label="Benchmark Frequency *"
              value={form.benchmark_frequency}
              options={BENCHMARK_FREQUENCY_OPTIONS}
              placeholder="Select frequency"
              onChange={(e) => handleChange("benchmark_frequency", e.target.value)}
              error={fieldErrors.benchmark_frequency}
            />

            <StyledInput
              label="Benchmark Rate (%) *"
              type="number"
              value={form.benchmark_rate}
              placeholder="e.g. 6.5"
              onChange={(e) => handleChange("benchmark_rate", e.target.value)}
              error={fieldErrors.benchmark_rate}
            />

            <StyledInput
              label="Mark Up (%) *"
              type="number"
              value={form.mark_up}
              placeholder="e.g. 2.0"
              onChange={(e) => handleChange("mark_up", e.target.value)}
              error={fieldErrors.mark_up}
            />
          </Section>

          {/* INTEREST CONFIGURATION */}
          <Section title="Interest Configuration">
            <StyledSelect
              label="Interest Type *"
              value={form.interest_type}
              options={INTEREST_TYPE_OPTIONS}
              placeholder="Select interest type"
              onChange={(e) => handleChange("interest_type", e.target.value)}
              error={fieldErrors.interest_type}
            />

            <StyledSelect
              label="Accrual Stage *"
              value={form.accrual_stage}
              options={ACCRUAL_STAGE_OPTIONS}
              placeholder="Select accrual stage"
              onChange={(e) => handleChange("accrual_stage", e.target.value)}
              error={fieldErrors.accrual_stage}
            />

            <StyledSelect
              label="Accrual Method *"
              value={form.accrual_method}
              options={ACCRUAL_METHOD_OPTIONS}
              placeholder="Select accrual method"
              onChange={(e) => handleChange("accrual_method", e.target.value)}
              error={fieldErrors.accrual_method}
            />

            <StyledInput
              label="Interest Rate (% p.a.) *"
              type="number"
              value={form.interest_rate}
              placeholder="e.g. 12.5"
              onChange={(e) => handleChange("interest_rate", e.target.value)}
              error={fieldErrors.interest_rate}
            />
          </Section>
        </div>

        {/* ---- ERROR BANNER ---- */}
        {error && (
          <div className="mx-8 mb-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ---- FOOTER ---- */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium
              text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-600
              hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
              text-white text-sm font-semibold shadow-sm transition-all"
          >
            <FiSave size={15} />
            {saving ? "Saving..." : "Add Interest"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddInterest;