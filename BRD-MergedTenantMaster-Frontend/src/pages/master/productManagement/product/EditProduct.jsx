import React, { useEffect, useState } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { productManagementService } from "../../../../services/productManagementService";

const CATEGORY_OPTIONS = [{ label: "Loan", value: "Loan" }, { label: "Credit", value: "Credit" }];
const PRODUCT_TYPE_OPTIONS = [
  { label: "Personal Loan", value: "Personal Loan" }, { label: "Home Loan", value: "Home Loan" },
  { label: "Car Loan", value: "Car Loan" }, { label: "Auto Loan", value: "Auto Loan" },
  { label: "Business Loan", value: "Business Loan" }, { label: "Education Loan", value: "Education Loan" },
  { label: "Gold Loan", value: "Gold Loan" }, { label: "Mortgage Loan", value: "Mortgage Loan" },
  { label: "Medical Loan", value: "Medical Loan" }, { label: "Loan Against Property", value: "Loan Against Property" },
  { label: "Agricultural Loan", value: "Agricultural Loan" }, { label: "Working Capital Loan", value: "Working Capital Loan" },
  { label: "Microfinance Loan", value: "Microfinance Loan" },
];
const PERIOD_UNITS = [{ label: "Days", value: "DAYS" }, { label: "Months", value: "MONTHS" }, { label: "Years", value: "YEARS" }];

const FormLabel = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{children}</label>
);
const StyledSelect = ({ label, value, options, placeholder, onChange, error }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <select value={value} onChange={onChange}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all
        ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}>
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
const StyledInput = ({ label, type = "text", value, onChange, placeholder, error }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder || ""}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 placeholder-gray-400 bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all
        ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`} />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
const Section = ({ title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    category: "", type: "", amount: "", periodValue: "", periodUnit: "MONTHS",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await productManagementService.getProduct(id);
        setForm({
          category: data.product_category || "",
          type: data.product_type || "",
          amount: data.product_amount || "",
          periodValue: data.product_period_value || "",
          periodUnit: data.product_period_unit || "MONTHS",
        });
      } finally { setLoading(false); }
    })();
  }, [id]);

  const validate = (v) => {
    const e = {};
    if (!v.category) e.category = "Category is required";
    if (!v.type) e.type = "Product type is required";
    if (!v.amount) e.amount = "Amount is required";
    if (!v.periodValue) e.periodValue = "Period value is required";
    return e;
  };

  const handleChange = (name, value) => {
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (fieldErrors[name]) setFieldErrors(validate(updated));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length) { setError("Please fill in all required fields."); return; }
    setError(""); setSaving(true);
    try {
      await productManagementService.updateProduct(id, {
        product_category: form.category,
        product_type: form.type,
        product_name: form.type,
        product_amount: parseFloat(form.amount),
        product_period_value: parseInt(form.periodValue, 10),
        product_period_unit: form.periodUnit,
      });
      navigate(-1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update. Please try again.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="px-8 py-6"><p className="text-gray-500">Loading product...</p></div>;

  return (
    <div className="px-8 py-6">
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center gap-4 mb-6 shadow-sm max-w-2xl">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update product configuration</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl space-y-8">
        <Section title="Product Details">
          <StyledSelect label="Product Category *" value={form.category} options={CATEGORY_OPTIONS}
            placeholder="Select category" onChange={e => handleChange("category", e.target.value)} error={fieldErrors.category} />
          <StyledSelect label="Product Type *" value={form.type} options={PRODUCT_TYPE_OPTIONS}
            placeholder="Select product type" onChange={e => handleChange("type", e.target.value)} error={fieldErrors.type} />
          <StyledInput label="Product Amount *" type="number" value={form.amount} placeholder="e.g. 500000"
            onChange={e => handleChange("amount", e.target.value)} error={fieldErrors.amount} />
        </Section>
        <Section title="Period Configuration">
          <StyledInput label="Period Value *" type="number" value={form.periodValue} placeholder="e.g. 12"
            onChange={e => handleChange("periodValue", e.target.value)} error={fieldErrors.periodValue} />
          <StyledSelect label="Period Unit *" value={form.periodUnit} options={PERIOD_UNITS}
            onChange={e => handleChange("periodUnit", e.target.value)} />
        </Section>
        {error && <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-all">
            <FiSave size={15} />{saving ? "Updating..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
}