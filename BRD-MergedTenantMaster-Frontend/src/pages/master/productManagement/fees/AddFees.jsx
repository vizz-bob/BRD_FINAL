import React, { useState, useMemo } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { feesService } from "../../../../services/productManagementService";

/* ================= OPTIONS ================= */

const FEE_FREQUENCY_OPTIONS = [
  { label: "One-time", value: "ONE_TIME" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Annually", value: "ANNUALLY" },
];

const FEE_BASIS_OPTIONS = [
  { label: "Fixed", value: "FIXED" },
  { label: "Percentage", value: "PERCENTAGE" },
  { label: "Slab-based", value: "SLAB" },
];

const RECOVERY_STAGE_OPTIONS = [
  { label: "Disbursement", value: "DISBURSEMENT" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Closure", value: "CLOSURE" },
];

const RECOVERY_MODE_OPTIONS = [
  { label: "Direct Debit", value: "DIRECT_DEBIT" },
  { label: "Auto-debit", value: "AUTO_DEBIT" },
  { label: "Cash", value: "CASH" },
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

const StyledInput = ({ label, type = "text", value, onChange, onBlur, placeholder, error }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
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

const AddFees = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    fees_frequency: "",
    basis_of_fees: "",
    fees_recovery_stage: "",
    fees_recovery_mode: "",
    fees_rate: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (v) => {
    const e = {};
    if (!v.name?.trim()) e.name = "Fee name is required";
    if (!v.fees_frequency) e.fees_frequency = "Fees frequency is required";
    if (!v.basis_of_fees) e.basis_of_fees = "Basis of fees is required";
    if (!v.fees_recovery_stage) e.fees_recovery_stage = "Recovery stage is required";
    if (!v.fees_recovery_mode) e.fees_recovery_mode = "Recovery mode is required";
    if (v.fees_rate === "") e.fees_rate = "Fees rate is required";
    else if (Number(v.fees_rate) < 0) e.fees_rate = "Fees rate cannot be negative";
    return e;
  };

  const handleChange = (name, value) => {
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) {
      setFieldErrors(validate(updated));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors(validate(form));
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    setFieldErrors(validationErrors);
    setTouched({
      name: true,
      fees_frequency: true,
      basis_of_fees: true,
      fees_recovery_stage: true,
      fees_recovery_mode: true,
      fees_rate: true,
    });

    if (Object.keys(validationErrors).length) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await feesService.createFee({
        ...form,
        fees_rate: Number(form.fees_rate),
      });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to create fee:", err?.response?.data || err);
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
            <h2 className="text-xl font-bold text-gray-900">Add Fee</h2>
            <p className="text-sm text-gray-500 mt-0.5">Define how fees are applied and recovered</p>
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

          <Section title="Fee Details">
            <StyledInput
              label="Fee Name *"
              value={form.name}
              placeholder="e.g. Processing Fee"
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              error={fieldErrors.name}
            />

            <StyledSelect
              label="Fees Frequency *"
              value={form.fees_frequency}
              options={FEE_FREQUENCY_OPTIONS}
              placeholder="Select frequency"
              onChange={(e) => handleChange("fees_frequency", e.target.value)}
              error={fieldErrors.fees_frequency}
            />

            <StyledSelect
              label="Basis of Fees *"
              value={form.basis_of_fees}
              options={FEE_BASIS_OPTIONS}
              placeholder="Select basis"
              onChange={(e) => handleChange("basis_of_fees", e.target.value)}
              error={fieldErrors.basis_of_fees}
            />

            <StyledInput
              label="Fees Rate *"
              type="number"
              value={form.fees_rate}
              placeholder="e.g. 2.5"
              onChange={(e) => handleChange("fees_rate", e.target.value)}
              onBlur={() => handleBlur("fees_rate")}
              error={fieldErrors.fees_rate}
            />
          </Section>

          <Section title="Recovery Details">
            <StyledSelect
              label="Recovery Stage *"
              value={form.fees_recovery_stage}
              options={RECOVERY_STAGE_OPTIONS}
              placeholder="Select stage"
              onChange={(e) => handleChange("fees_recovery_stage", e.target.value)}
              error={fieldErrors.fees_recovery_stage}
            />

            <StyledSelect
              label="Recovery Mode *"
              value={form.fees_recovery_mode}
              options={RECOVERY_MODE_OPTIONS}
              placeholder="Select mode"
              onChange={(e) => handleChange("fees_recovery_mode", e.target.value)}
              error={fieldErrors.fees_recovery_mode}
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
            {saving ? "Saving..." : "Add Fee"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddFees;