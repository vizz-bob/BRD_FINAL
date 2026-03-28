import React, { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { moratoriumService } from "../../../../services/productManagementService";

/* ================= OPTIONS ================= */

const MORATORIUM_TYPE_OPTIONS = [
  { label: "Full", value: "FULL" },
  { label: "Interest-only", value: "INTEREST_ONLY" },
];

const PERIOD_UNIT_OPTIONS = [
  { label: "Day", value: "DAY" },
  { label: "Month", value: "MONTH" },
];

const EFFECT_OPTIONS = [
  { label: "Interest-only", value: "INTEREST_ONLY" },
  { label: "Deferred", value: "DEFERRED" },
];

const INTEREST_HANDLING_OPTIONS = [
  { label: "Recover During Moratorium", value: "RECOVER_DURING" },
  { label: "Accumulate & Pay Later", value: "ACCUMULATE" },
  { label: "Waive Off", value: "WAIVE" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
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

const StyledCheckbox = ({ label, checked, onChange }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
    />
    <span className="text-sm text-gray-700 font-medium">{label}</span>
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

export default function AddMoratorium({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    moratorium_type: "",
    period_value: "",
    period_unit: "MONTH",
    amount: "",
    effective_date: "",
    effect_of_moratorium: "",
    interest_handling: "",
    revised_interest_rate: "",
    interest_rationalisation: false,
    status: "ACTIVE",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = (v) => {
    const e = {};
    if (!v.moratorium_type) e.moratorium_type = "Moratorium type is required";
    if (!v.period_value || v.period_value <= 0) e.period_value = "Valid period is required";
    if (!v.amount || v.amount <= 0) e.amount = "Valid amount is required";
    if (!v.effective_date) e.effective_date = "Effective date is required";
    if (!v.effect_of_moratorium) e.effect_of_moratorium = "Effect is required";
    if (!v.interest_handling) e.interest_handling = "Interest handling is required";
    if (!v.status) e.status = "Status is required";
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
      await moratoriumService.createMoratorium({
        ...form,
        period_value: Number(form.period_value),
        amount: Number(form.amount),
        revised_interest_rate: form.revised_interest_rate
          ? Number(form.revised_interest_rate)
          : null,
      });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Add moratorium error:", err);
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
            <h2 className="text-xl font-bold text-gray-900">Add Moratorium</h2>
            <p className="text-sm text-gray-500 mt-0.5">Configure moratorium rules and interest impact</p>
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

          {/* MORATORIUM DETAILS */}
          <Section title="Moratorium Details">
            <StyledSelect
              label="Moratorium Type *"
              value={form.moratorium_type}
              options={MORATORIUM_TYPE_OPTIONS}
              placeholder="Select type"
              onChange={(e) => handleChange("moratorium_type", e.target.value)}
              error={fieldErrors.moratorium_type}
            />

            <StyledSelect
              label="Effect of Moratorium *"
              value={form.effect_of_moratorium}
              options={EFFECT_OPTIONS}
              placeholder="Select effect"
              onChange={(e) => handleChange("effect_of_moratorium", e.target.value)}
              error={fieldErrors.effect_of_moratorium}
            />

            <StyledInput
              label="Amount Under Moratorium *"
              type="number"
              value={form.amount}
              placeholder="e.g. 500000"
              onChange={(e) => handleChange("amount", e.target.value)}
              error={fieldErrors.amount}
            />

            <StyledInput
              label="Effective Date *"
              type="date"
              value={form.effective_date}
              onChange={(e) => handleChange("effective_date", e.target.value)}
              error={fieldErrors.effective_date}
            />

            {/* Period — value + unit side by side */}
            <div>
              <FormLabel>Period *</FormLabel>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={form.period_value}
                  onChange={(e) => handleChange("period_value", e.target.value)}
                  placeholder="e.g. 3"
                  className={`w-1/2 px-4 py-2.5 rounded-lg border text-sm text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${fieldErrors.period_value ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                <select
                  value={form.period_unit}
                  onChange={(e) => handleChange("period_unit", e.target.value)}
                  className="w-1/2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                    text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PERIOD_UNIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {fieldErrors.period_value && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.period_value}</p>
              )}
            </div>
          </Section>

          {/* INTEREST IMPACT */}
          <Section title="Interest Impact">
            <StyledSelect
              label="Interest Handling *"
              value={form.interest_handling}
              options={INTEREST_HANDLING_OPTIONS}
              placeholder="Select handling method"
              onChange={(e) => handleChange("interest_handling", e.target.value)}
              error={fieldErrors.interest_handling}
            />

            <StyledInput
              label="Revised Interest Rate (%)"
              type="number"
              value={form.revised_interest_rate}
              placeholder="e.g. 8.5 (optional)"
              onChange={(e) => handleChange("revised_interest_rate", e.target.value)}
              error={fieldErrors.revised_interest_rate}
            />

            <div className="md:col-span-2">
              <StyledCheckbox
                label="Waive / Rationalise Interest during Moratorium"
                checked={form.interest_rationalisation}
                onChange={() =>
                  handleChange("interest_rationalisation", !form.interest_rationalisation)
                }
              />
            </div>
          </Section>

          {/* CONFIGURATION */}
          <Section title="Configuration">
            <StyledSelect
              label="Status *"
              value={form.status}
              options={STATUS_OPTIONS}
              onChange={(e) => handleChange("status", e.target.value)}
              error={fieldErrors.status}
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
            {saving ? "Saving..." : "Add Moratorium"}
          </button>
        </div>

      </div>
    </div>
  );
}