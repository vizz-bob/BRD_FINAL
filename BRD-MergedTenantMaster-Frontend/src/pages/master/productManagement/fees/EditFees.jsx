import React, { useEffect, useState } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { feesService } from "../../../../services/productManagementService";

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

export default function EditFees() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    name: "", fees_frequency: "", basis_of_fees: "",
    fees_recovery_stage: "", fees_recovery_mode: "", fees_rate: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await feesService.getFee(id);
        setForm({
          name: data.name || "",
          fees_frequency: data.fees_frequency || "",
          basis_of_fees: data.basis_of_fees || "",
          fees_recovery_stage: data.fees_recovery_stage || "",
          fees_recovery_mode: data.fees_recovery_mode || "",
          fees_rate: data.fees_rate ?? "",
        });
      } finally { setLoading(false); }
    })();
  }, [id]);

  const validate = (v) => {
    const e = {};
    if (!v.name?.trim()) e.name = "Fee name is required";
    if (!v.fees_frequency) e.fees_frequency = "Frequency is required";
    if (!v.basis_of_fees) e.basis_of_fees = "Basis is required";
    if (!v.fees_recovery_stage) e.fees_recovery_stage = "Recovery stage is required";
    if (!v.fees_recovery_mode) e.fees_recovery_mode = "Recovery mode is required";
    if (v.fees_rate === "") e.fees_rate = "Rate is required";
    else if (Number(v.fees_rate) < 0) e.fees_rate = "Rate cannot be negative";
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
      await feesService.updateFee(id, { ...form, fees_rate: Number(form.fees_rate) });
      navigate(-1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update. Please try again.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="px-8 py-6"><p className="text-gray-500">Loading fee...</p></div>;

  return (
    <div className="px-8 py-6">
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center gap-4 mb-6 shadow-sm max-w-2xl">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Fee</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update fee configuration and recovery rules</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl space-y-8">
        <Section title="Fee Details">
          <StyledInput label="Fee Name *" value={form.name} placeholder="e.g. Processing Fee"
            onChange={e => handleChange("name", e.target.value)} error={fieldErrors.name} />
          <StyledSelect label="Fees Frequency *" value={form.fees_frequency} options={FEE_FREQUENCY_OPTIONS}
            onChange={e => handleChange("fees_frequency", e.target.value)} error={fieldErrors.fees_frequency} />
          <StyledSelect label="Basis of Fees *" value={form.basis_of_fees} options={FEE_BASIS_OPTIONS}
            onChange={e => handleChange("basis_of_fees", e.target.value)} error={fieldErrors.basis_of_fees} />
          <StyledInput label="Fees Rate *" type="number" value={form.fees_rate} placeholder="e.g. 2.5"
            onChange={e => handleChange("fees_rate", e.target.value)} error={fieldErrors.fees_rate} />
        </Section>
        <Section title="Recovery Details">
          <StyledSelect label="Recovery Stage *" value={form.fees_recovery_stage} options={RECOVERY_STAGE_OPTIONS}
            onChange={e => handleChange("fees_recovery_stage", e.target.value)} error={fieldErrors.fees_recovery_stage} />
          <StyledSelect label="Recovery Mode *" value={form.fees_recovery_mode} options={RECOVERY_MODE_OPTIONS}
            onChange={e => handleChange("fees_recovery_mode", e.target.value)} error={fieldErrors.fees_recovery_mode} />
        </Section>
        {error && <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-all">
            <FiSave size={15} />{saving ? "Updating..." : "Update Fee"}
          </button>
        </div>
      </div>
    </div>
  );
}