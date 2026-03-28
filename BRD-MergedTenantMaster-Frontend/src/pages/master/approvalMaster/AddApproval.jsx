import React, { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { approvalMasterService } from "../../../services/approvalMasterService";

/* ================= OPTIONS ================= */

const LEVELS = [
  { label: "L1", value: "L1" },
  { label: "L2", value: "L2" },
  { label: "L3", value: "L3" },
  { label: "L4", value: "L4" },
  { label: "FINAL", value: "FINAL" },
];

const TYPES = [
  { label: "Individual", value: "INDIVIDUAL" },
  { label: "Team", value: "TEAM" },
];

const STATUS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const PRODUCT_TYPES = [
  { label: "Secured Loan", value: "SECURED" },
  { label: "Unsecured Loan", value: "UNSECURED" },
];

const ALL_LOANS = [
  { label: "Personal Loan", value: "PERSONAL_LOAN" },
  { label: "Home Loan", value: "HOME_LOAN" },
  { label: "Car Loan", value: "CAR_LOAN" },
  { label: "Auto Loan", value: "AUTO_LOAN" },
  { label: "Business Loan", value: "BUSINESS_LOAN" },
  { label: "Education Loan", value: "EDUCATION_LOAN" },
  { label: "Gold Loan", value: "GOLD_LOAN" },
  { label: "Mortgage Loan", value: "MORTGAGE_LOAN" },
  { label: "Medical Loan", value: "MEDICAL_LOAN" },
  { label: "Loan Against Property", value: "LAP" },
  { label: "Loan Against Securities", value: "LAS" },
  { label: "Agricultural Loan", value: "AGRICULTURAL_LOAN" },
  { label: "Consumer Durable Loan", value: "CONSUMER_DURABLE_LOAN" },
  { label: "Working Capital Loan", value: "WORKING_CAPITAL_LOAN" },
  { label: "Microfinance Loan", value: "MICROFINANCE_LOAN" },
];

const PRODUCT_NAMES = {
  SECURED: [
    { label: "Home Loan", value: "HOME_LOAN" },
    { label: "Car Loan", value: "CAR_LOAN" },
    { label: "Auto Loan", value: "AUTO_LOAN" },
    { label: "Mortgage Loan", value: "MORTGAGE_LOAN" },
    { label: "Loan Against Property", value: "LAP" },
    { label: "Gold Loan", value: "GOLD_LOAN" },
    { label: "Loan Against Securities", value: "LAS" },
    { label: "Agricultural Loan", value: "AGRICULTURAL_LOAN" },
    { label: "Consumer Durable Loan", value: "CONSUMER_DURABLE_LOAN" },
  ],
  UNSECURED: [
    { label: "Personal Loan", value: "PERSONAL_LOAN" },
    { label: "Business Loan", value: "BUSINESS_LOAN" },
    { label: "Education Loan", value: "EDUCATION_LOAN" },
    { label: "Medical Loan", value: "MEDICAL_LOAN" },
    { label: "Consumer Durable Loan", value: "CONSUMER_DURABLE_LOAN" },
    { label: "Working Capital Loan", value: "WORKING_CAPITAL_LOAN" },
    { label: "Microfinance Loan", value: "MICROFINANCE_LOAN" },
    { label: "Payday Loan", value: "PAYDAY_LOAN" },
    { label: "Peer-to-Peer Loan", value: "P2P_LOAN" },
  ],
};

const REQUIRED_FIELDS = {
  level: "Level",
  type: "Type",
  product_type: "Product Type",
  product_name: "Product Name",
  sanction_name: "Sanction Name",
  rate_inc: "Rate Increase",
  rate_dec: "Rate Decrease",
  fees_inc: "Fees Increase",
  fees_dec: "Fees Decrease",
  tenure_inc: "Tenure Increase",
  tenure_dec: "Tenure Decrease",
  moratorium_interest: "Moratorium Interest",
  moratorium_period: "Moratorium Period",
  approval_range: "Approval Range",
  status: "Status",
};

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
      <option value="" disabled>
        {placeholder || "Select..."}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
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

export default function AddApproval({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    level: "",
    type: "",
    product_type: "",
    product_name: "",
    sanction_name: "",
    rate_inc: "",
    rate_dec: "",
    fees_inc: "",
    fees_dec: "",
    tenure_inc: "",
    tenure_dec: "",
    moratorium_interest: "",
    moratorium_period: "",
    approval_range: "",
    status: "ACTIVE",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (name, value) => {
    if (name === "product_type") {
      setForm((prev) => ({ ...prev, product_type: value, product_name: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    Object.entries(REQUIRED_FIELDS).forEach(([key, label]) => {
      if (!form[key] || form[key].toString().trim() === "") {
        errors[key] = `${label} is required`;
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await approvalMasterService.createApproval(form);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Save failed:", err);
      setError(
        err?.response?.data?.message || "Failed to save. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const productNameOptions = form.product_type
    ? PRODUCT_NAMES[form.product_type]
    : ALL_LOANS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* ---- HEADER ---- */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Approval</h2>
            <p className="text-sm text-gray-500 mt-0.5">Create a new approval rule</p>
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

          {/* BASIC DETAILS */}
          <Section title="Basic Details">
            <StyledSelect
              label="Level"
              value={form.level}
              options={LEVELS}
              placeholder="Select level"
              onChange={(e) => handleChange("level", e.target.value)}
              error={fieldErrors.level}
            />
            <StyledSelect
              label="Type"
              value={form.type}
              options={TYPES}
              placeholder="Select type"
              onChange={(e) => handleChange("type", e.target.value)}
              error={fieldErrors.type}
            />
            <StyledSelect
              label="Product Type"
              value={form.product_type}
              options={PRODUCT_TYPES}
              placeholder="Select product type"
              onChange={(e) => handleChange("product_type", e.target.value)}
              error={fieldErrors.product_type}
            />
            <StyledSelect
              label="Product Name"
              value={form.product_name}
              options={productNameOptions}
              placeholder="Select product name"
              onChange={(e) => handleChange("product_name", e.target.value)}
              error={fieldErrors.product_name}
            />
            <div className="md:col-span-2">
              <StyledInput
                label="Sanction Name"
                value={form.sanction_name}
                placeholder="e.g. Standard Sanction Policy"
                onChange={(e) => handleChange("sanction_name", e.target.value)}
                error={fieldErrors.sanction_name}
              />
            </div>
          </Section>

          {/* RATE & FEES */}
          <Section title="Rate & Fees">
            <StyledInput
              label="Rate Increase (%)"
              type="number"
              value={form.rate_inc}
              placeholder="e.g. 2.5"
              onChange={(e) => handleChange("rate_inc", e.target.value)}
              error={fieldErrors.rate_inc}
            />
            <StyledInput
              label="Rate Decrease (%)"
              type="number"
              value={form.rate_dec}
              placeholder="e.g. 1.0"
              onChange={(e) => handleChange("rate_dec", e.target.value)}
              error={fieldErrors.rate_dec}
            />
            <StyledInput
              label="Fees Increase"
              type="number"
              value={form.fees_inc}
              placeholder="e.g. 500"
              onChange={(e) => handleChange("fees_inc", e.target.value)}
              error={fieldErrors.fees_inc}
            />
            <StyledInput
              label="Fees Decrease"
              type="number"
              value={form.fees_dec}
              placeholder="e.g. 200"
              onChange={(e) => handleChange("fees_dec", e.target.value)}
              error={fieldErrors.fees_dec}
            />
          </Section>

          {/* TENURE & MORATORIUM */}
          <Section title="Tenure & Moratorium">
            <StyledInput
              label="Tenure Increase"
              type="number"
              value={form.tenure_inc}
              placeholder="e.g. 12 (months)"
              onChange={(e) => handleChange("tenure_inc", e.target.value)}
              error={fieldErrors.tenure_inc}
            />
            <StyledInput
              label="Tenure Decrease"
              type="number"
              value={form.tenure_dec}
              placeholder="e.g. 6 (months)"
              onChange={(e) => handleChange("tenure_dec", e.target.value)}
              error={fieldErrors.tenure_dec}
            />
            <StyledInput
              label="Moratorium Interest"
              type="number"
              value={form.moratorium_interest}
              placeholder="e.g. 3.5"
              onChange={(e) => handleChange("moratorium_interest", e.target.value)}
              error={fieldErrors.moratorium_interest}
            />
            <StyledInput
              label="Moratorium Period"
              type="number"
              value={form.moratorium_period}
              placeholder="e.g. 3 (months)"
              onChange={(e) => handleChange("moratorium_period", e.target.value)}
              error={fieldErrors.moratorium_period}
            />
          </Section>

          {/* APPROVAL CONFIG */}
          <Section title="Approval Configuration">
            <StyledInput
              label="Approval Range"
              type="number"
              value={form.approval_range}
              placeholder="e.g. 100000"
              onChange={(e) => handleChange("approval_range", e.target.value)}
              error={fieldErrors.approval_range}
            />
            <StyledSelect
              label="Status"
              value={form.status}
              options={STATUS}
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
            {saving ? "Saving..." : "Save Approval"}
          </button>
        </div>

      </div>
    </div>
  );
}