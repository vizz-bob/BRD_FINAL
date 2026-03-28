import React, { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { repaymentsService } from "../../../../services/productManagementService";

/* ================= OPTIONS ================= */

const TYPE_OPTIONS = [
  { label: "EMI", value: "EMI" },
  { label: "Bullet", value: "BULLET" },
  { label: "Step-up", value: "STEP_UP" },
];

const FREQUENCY_OPTIONS = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Bi-weekly", value: "Bi-weekly" },
];

const SEQUENCE_OPTIONS = [
  { label: "Principal First", value: "PRINCIPAL_FIRST" },
  { label: "Interest First", value: "INTEREST_FIRST" },
];

const COLLECTION_MODE_OPTIONS = [
  { label: "NACH", value: "NACH" },
  { label: "Cash", value: "CASH" },
  { label: "Online", value: "ONLINE" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_OPTIONS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const DATE_OPTIONS = ["1", "5", "10", "15", "20", "25", "30"];

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
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
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

const StyledMultiSelect = ({ label, values, options, onChange, error, hint }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <select
      multiple
      value={values}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
        onChange(selected);
      }}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800
        bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        hover:border-gray-400 transition-all duration-150 min-h-[100px]
        ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <p className="mt-1 text-xs text-gray-400">{hint || "Hold Ctrl / Cmd to select multiple"}</p>
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

export default function AddRepayment({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    repayment_type: "",
    frequency: "",
    limit_in_month: "",
    gap_between_disbursement_and_first_repayment: "",
    number_of_repayments: "",
    sequence_of_repayment_adjustment: "",
    repayment_months: [],
    repayment_days: [],
    repayment_dates: [],
    mode_of_collection: "",
    retry_attempts: "",
    retry_interval: "",
    status: "ACTIVE",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = (v) => {
    const e = {};
    if (!v.repayment_type) e.repayment_type = "Repayment type is required";
    if (!v.frequency) e.frequency = "Frequency is required";
    if (!v.limit_in_month || v.limit_in_month <= 0) e.limit_in_month = "Valid limit required";
    if (!v.number_of_repayments || v.number_of_repayments <= 0) e.number_of_repayments = "Valid number required";
    if (!v.sequence_of_repayment_adjustment) e.sequence_of_repayment_adjustment = "Sequence is required";
    if (!v.mode_of_collection) e.mode_of_collection = "Collection mode is required";
    if (!v.status) e.status = "Status is required";
    return e;
  };

  const update = (key, value) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (fieldErrors[key]) {
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
      const payload = {
        repayment_type: form.repayment_type,
        frequency: form.frequency,
        limit_in_month: Number(form.limit_in_month),
        gap_between_disbursement_and_first_repayment: Number(form.gap_between_disbursement_and_first_repayment),
        number_of_repayments: Number(form.number_of_repayments),
        sequence_of_repayment_adjustment: form.sequence_of_repayment_adjustment,
        repayment_months: form.repayment_months,
        repayment_days: form.repayment_days,
        repayment_dates: form.repayment_dates,
        mode_of_collection: form.mode_of_collection,
        is_active: form.status === "ACTIVE",
      };
      console.log("DEBUG: Payload being sent:", JSON.stringify(payload, null, 2));
      await repaymentsService.createRepayment(payload);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to create repayment:", err);
      console.error("Error response data:", err?.response?.data);
      console.error("Error status:", err?.response?.status);
      console.error("Error headers:", err?.response?.headers);
      setError(err?.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* ---- HEADER ---- */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Repayment Rule</h2>
            <p className="text-sm text-gray-500 mt-0.5">Define repayment schedule and collection rules</p>
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

          {/* REPAYMENT DETAILS */}
          <Section title="Repayment Details">
            <StyledSelect
              label="Repayment Type *"
              value={form.repayment_type}
              options={TYPE_OPTIONS}
              placeholder="Select type"
              onChange={(e) => update("repayment_type", e.target.value)}
              error={fieldErrors.repayment_type}
            />

            <StyledSelect
              label="Frequency *"
              value={form.frequency}
              options={FREQUENCY_OPTIONS}
              placeholder="Select frequency"
              onChange={(e) => update("frequency", e.target.value)}
              error={fieldErrors.frequency}
            />

            <StyledInput
              label="Limit in Months *"
              type="number"
              value={form.limit_in_month}
              placeholder="e.g. 12"
              onChange={(e) => update("limit_in_month", e.target.value)}
              error={fieldErrors.limit_in_month}
            />

            <StyledInput
              label="Gap Before First Repayment (Months)"
              type="number"
              value={form.gap_between_disbursement_and_first_repayment}
              placeholder="e.g. 1"
              onChange={(e) => update("gap_between_disbursement_and_first_repayment", e.target.value)}
              error={fieldErrors.gap_between_disbursement_and_first_repayment}
            />

            <StyledInput
              label="No. of Repayments *"
              type="number"
              value={form.number_of_repayments}
              placeholder="e.g. 12"
              onChange={(e) => update("number_of_repayments", e.target.value)}
              error={fieldErrors.number_of_repayments}
            />

            <StyledSelect
              label="Repayment Sequence *"
              value={form.sequence_of_repayment_adjustment}
              options={SEQUENCE_OPTIONS}
              placeholder="Select sequence"
              onChange={(e) => update("sequence_of_repayment_adjustment", e.target.value)}
              error={fieldErrors.sequence_of_repayment_adjustment}
            />

            <StyledSelect
              label="Collection Mode *"
              value={form.mode_of_collection}
              options={COLLECTION_MODE_OPTIONS}
              placeholder="Select mode"
              onChange={(e) => update("mode_of_collection", e.target.value)}
              error={fieldErrors.mode_of_collection}
            />

            <StyledSelect
              label="Status *"
              value={form.status}
              options={STATUS_OPTIONS}
              onChange={(e) => update("status", e.target.value)}
              error={fieldErrors.status}
            />
          </Section>

          {/* REPAYMENT SCHEDULE */}
          <Section title="Repayment Schedule">
            <StyledMultiSelect
              label="Repayment Months"
              values={form.repayment_months}
              options={MONTH_OPTIONS}
              onChange={(v) => update("repayment_months", v)}
              hint="Select allowed repayment months"
            />

            <StyledMultiSelect
              label="Repayment Days"
              values={form.repayment_days}
              options={DAY_OPTIONS}
              onChange={(v) => update("repayment_days", v)}
              hint="Select allowed repayment days"
            />

            <div className="md:col-span-2">
              <StyledMultiSelect
                label="Repayment Dates"
                values={form.repayment_dates}
                options={DATE_OPTIONS}
                onChange={(v) => update("repayment_dates", v)}
                hint="Select allowed repayment dates of month"
              />
            </div>
          </Section>

          {/* RETRY CONFIGURATION */}
          <Section title="Retry Configuration">
            <StyledInput
              label="Retry Attempts"
              type="number"
              value={form.retry_attempts}
              placeholder="e.g. 3"
              onChange={(e) => update("retry_attempts", e.target.value)}
              error={fieldErrors.retry_attempts}
            />

            <StyledInput
              label="Retry Interval (Days)"
              type="number"
              value={form.retry_interval}
              placeholder="e.g. 7"
              onChange={(e) => update("retry_interval", e.target.value)}
              error={fieldErrors.retry_interval}
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
            {saving ? "Saving..." : "Add Repayment Rule"}
          </button>
        </div>

      </div>
    </div>
  );
}