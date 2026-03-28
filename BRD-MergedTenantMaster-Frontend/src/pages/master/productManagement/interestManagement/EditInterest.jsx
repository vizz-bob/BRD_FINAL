import React, { useEffect, useState } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { interestService } from "../../../../services/productManagementService";

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

const FormLabel = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{children}</label>
);
const StyledSelect = ({ label, value, options, placeholder, onChange, error }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <select value={value} onChange={onChange}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        hover:border-gray-400 transition-all duration-150
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
      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800
        placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
        focus:border-transparent hover:border-gray-400 transition-all duration-150
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

export default function EditInterest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    benchmark_type: "", benchmark_frequency: "", benchmark_rate: "",
    mark_up: "", interest_type: "", accrual_stage: "", accrual_method: "", interest_rate: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await interestService.getInterest(id);
        setForm({
          benchmark_type: data.benchmark_type || "",
          benchmark_frequency: data.benchmark_frequency || "",
          benchmark_rate: data.benchmark_rate ?? "",
          mark_up: data.mark_up ?? "",
          interest_type: data.interest_type || "",
          accrual_stage: data.accrual_stage || "",
          accrual_method: data.accrual_method || "",
          interest_rate: data.interest_rate ?? "",
        });
      } finally { setLoading(false); }
    })();
  }, [id]);

  const validate = (v) => {
    const e = {};
    if (!v.benchmark_type) e.benchmark_type = "Required";
    if (!v.benchmark_frequency) e.benchmark_frequency = "Required";
    if (v.benchmark_rate === "") e.benchmark_rate = "Required";
    if (v.mark_up === "") e.mark_up = "Required";
    if (!v.interest_type) e.interest_type = "Required";
    if (!v.accrual_stage) e.accrual_stage = "Required";
    if (!v.accrual_method) e.accrual_method = "Required";
    if (v.interest_rate === "") e.interest_rate = "Required";
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
      await interestService.updateInterest(id, form);
      navigate(-1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update. Please try again.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="px-8 py-6"><p className="text-gray-500">Loading interest configuration...</p></div>;

  return (
    <div className="px-8 py-6">
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center gap-4 mb-6 shadow-sm max-w-2xl">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Interest Configuration</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update benchmark and interest calculation rules</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl space-y-8">
        <Section title="Benchmark Configuration">
          <StyledSelect label="Benchmark Type *" value={form.benchmark_type} options={BENCHMARK_TYPE_OPTIONS}
            onChange={e => handleChange("benchmark_type", e.target.value)} error={fieldErrors.benchmark_type} />
          <StyledSelect label="Benchmark Frequency *" value={form.benchmark_frequency} options={BENCHMARK_FREQUENCY_OPTIONS}
            onChange={e => handleChange("benchmark_frequency", e.target.value)} error={fieldErrors.benchmark_frequency} />
          <StyledInput label="Benchmark Rate (%) *" type="number" value={form.benchmark_rate} placeholder="e.g. 6.5"
            onChange={e => handleChange("benchmark_rate", e.target.value)} error={fieldErrors.benchmark_rate} />
          <StyledInput label="Mark Up (%) *" type="number" value={form.mark_up} placeholder="e.g. 2.0"
            onChange={e => handleChange("mark_up", e.target.value)} error={fieldErrors.mark_up} />
        </Section>
        <Section title="Interest Configuration">
          <StyledSelect label="Interest Type *" value={form.interest_type} options={INTEREST_TYPE_OPTIONS}
            onChange={e => handleChange("interest_type", e.target.value)} error={fieldErrors.interest_type} />
          <StyledSelect label="Accrual Stage *" value={form.accrual_stage} options={ACCRUAL_STAGE_OPTIONS}
            onChange={e => handleChange("accrual_stage", e.target.value)} error={fieldErrors.accrual_stage} />
          <StyledSelect label="Accrual Method *" value={form.accrual_method} options={ACCRUAL_METHOD_OPTIONS}
            onChange={e => handleChange("accrual_method", e.target.value)} error={fieldErrors.accrual_method} />
          <StyledInput label="Interest Rate (% p.a.) *" type="number" value={form.interest_rate} placeholder="e.g. 12.5"
            onChange={e => handleChange("interest_rate", e.target.value)} error={fieldErrors.interest_rate} />
        </Section>
        {error && <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-all">
            <FiSave size={15} />{saving ? "Updating..." : "Update Interest"}
          </button>
        </div>
      </div>
    </div>
  );
}