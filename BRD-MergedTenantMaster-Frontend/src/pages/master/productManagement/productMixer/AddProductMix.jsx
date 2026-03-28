import React, { useEffect, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import {
  productManagementService,
  productMixService,
} from "../../../../services/productManagementService";

/* ================= OPTIONS ================= */

const CATEGORY_OPTIONS = [
  { label: "Loan", value: "Loan" },
  { label: "Credit", value: "Credit" },
];

const TYPE_OPTIONS = [
  { label: "Personal Loan", value: "Personal Loan" },
  { label: "Home Loan", value: "Home Loan" },
  { label: "Car Loan", value: "Car Loan" },
  { label: "Auto Loan", value: "Auto Loan" },
  { label: "Business Loan", value: "Business Loan" },
  { label: "Education Loan", value: "Education Loan" },
  { label: "Gold Loan", value: "Gold Loan" },
  { label: "Mortgage Loan", value: "Mortgage Loan" },
  { label: "Medical Loan", value: "Medical Loan" },
  { label: "Loan Against Property", value: "Loan Against Property" },
  { label: "Loan Against Securities", value: "Loan Against Securities" },
  { label: "Agricultural Loan", value: "Agricultural Loan" },
  { label: "Consumer Durable Loan", value: "Consumer Durable Loan" },
  { label: "Working Capital Loan", value: "Working Capital Loan" },
  { label: "Microfinance Loan", value: "Microfinance Loan" },
];

const PERIOD_UNITS = [
  { label: "Days", value: "DAYS" },
  { label: "Months", value: "MONTHS" },
  { label: "Years", value: "YEARS" },
];

const FACILITIES_OPTIONS = [
  { label: "Insurance", value: "Insurance" },
  { label: "Top-up", value: "Top-up" },
  { label: "Balance Transfer", value: "Balance Transfer" },
  { label: "Overdraft", value: "Overdraft" },
  { label: "Credit Shield", value: "Credit Shield" },
  { label: "Personal Accident Cover", value: "Personal Accident Cover" },
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
        hover:border-gray-400 transition-all duration-150 min-h-[110px]
        ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
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

const AddProductMix = ({ onClose, onSuccess }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    category: "",
    type: "",
    name: "",
    amount: "",
    periodValue: "",
    periodUnit: "MONTHS",
    facilities: [],
    selectedProducts: [],
    status: "ACTIVE",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productManagementService.getProducts();
        if (!Array.isArray(data)) return;
        setAllProducts(
          data.map((p) => ({ label: p.product_name, value: p.id }))
        );
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.category) errors.category = "Category is required";
    if (!form.type) errors.type = "Product type is required";
    if (!form.name) errors.name = "Product mix name is required";
    if (!form.amount) errors.amount = "Amount is required";
    if (!form.periodValue) errors.periodValue = "Period value is required";
    if (!form.periodUnit) errors.periodUnit = "Period unit is required";
    if (!form.selectedProducts.length) errors.selectedProducts = "Select at least one product";
    if (!form.status) errors.status = "Status is required";
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
      const payload = {
        product_category: form.category,
        product_type: form.type,
        product_mix_name: form.name,
        product_mix_amount: parseFloat(form.amount),
        product_period_value: parseInt(form.periodValue, 10),
        product_period_unit: form.periodUnit,
        product_facilities: form.facilities,
        products: form.selectedProducts,
        status: form.status,
      };
      await productMixService.createProductMix(payload);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to create product mix:", err?.response?.data || err);
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
            <h2 className="text-xl font-bold text-gray-900">Add Product Mix</h2>
            <p className="text-sm text-gray-500 mt-0.5">Create a bundled product offering</p>
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

          {/* PRODUCT DETAILS */}
          <Section title="Product Details">
            <StyledSelect
              label="Product Category *"
              value={form.category}
              options={CATEGORY_OPTIONS}
              placeholder="Select category"
              onChange={(e) => handleChange("category", e.target.value)}
              error={fieldErrors.category}
            />

            <StyledSelect
              label="Product Type *"
              value={form.type}
              options={TYPE_OPTIONS}
              placeholder="Select product type"
              onChange={(e) => handleChange("type", e.target.value)}
              error={fieldErrors.type}
            />

            <StyledInput
              label="Product Mix Name *"
              value={form.name}
              placeholder="e.g. Home + Insurance Bundle"
              onChange={(e) => handleChange("name", e.target.value)}
              error={fieldErrors.name}
            />

            <StyledInput
              label="Product Amount *"
              type="number"
              value={form.amount}
              placeholder="e.g. 500000"
              onChange={(e) => handleChange("amount", e.target.value)}
              error={fieldErrors.amount}
            />
          </Section>

          {/* PERIOD CONFIGURATION */}
          <Section title="Period Configuration">
            <StyledInput
              label="Period Value *"
              type="number"
              value={form.periodValue}
              placeholder="e.g. 12"
              onChange={(e) => handleChange("periodValue", e.target.value)}
              error={fieldErrors.periodValue}
            />

            <StyledSelect
              label="Period Unit *"
              value={form.periodUnit}
              options={PERIOD_UNITS}
              onChange={(e) => handleChange("periodUnit", e.target.value)}
              error={fieldErrors.periodUnit}
            />
          </Section>

          {/* PRODUCTS & FACILITIES */}
          <Section title="Products & Facilities">
            <div className="md:col-span-2">
              <StyledMultiSelect
                label="Select Products *"
                values={form.selectedProducts}
                options={allProducts}
                onChange={(vals) => handleChange("selectedProducts", vals)}
                error={fieldErrors.selectedProducts}
                hint="Hold Ctrl / Cmd to select multiple products"
              />
            </div>

            <div className="md:col-span-2">
              <StyledMultiSelect
                label="Product Facilities"
                values={form.facilities}
                options={FACILITIES_OPTIONS}
                onChange={(vals) => handleChange("facilities", vals)}
                hint="Optional — Hold Ctrl / Cmd to select multiple facilities"
              />
            </div>
          </Section>

          {/* STATUS */}
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
            {saving ? "Saving..." : "Add Product Mix"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddProductMix;