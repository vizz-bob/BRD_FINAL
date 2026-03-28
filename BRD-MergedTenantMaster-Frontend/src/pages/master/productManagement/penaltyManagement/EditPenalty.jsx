import React, { useEffect, useState } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { penaltiesService } from "../../../../services/productManagementService";

const FREQUENCY_OPTIONS = [{ label: "One-time", value: "ONE_TIME" }, { label: "Recurring", value: "RECURRING" }];
const BASIS_OPTIONS = [{ label: "Fixed", value: "FIXED" }, { label: "Percentage", value: "PERCENTAGE" }, { label: "Slab", value: "SLAB" }];
const RECOVERY_STAGE_OPTIONS = [{ label: "Missed EMI", value: "MISSED_EMI" }, { label: "Post Default", value: "POST_DEFAULT" }];
const RECOVERY_MODE_OPTIONS = [{ label: "Auto", value: "AUTO" }, { label: "Manual", value: "MANUAL" }];
const STATUS_OPTIONS = [{ label: "Active", value: "ACTIVE" }, { label: "Inactive", value: "INACTIVE" }];
const TAX_OPTIONS = [
  { label: "None", value: "NONE" }, { label: "GST (18%)", value: "GST_18" },
  { label: "GST (12%)", value: "GST_12" }, { label: "Surcharge (2%)", value: "SURCHARGE_2" },
];
const SEQUENCE_OPTIONS = [
  { label: "Penalty First", value: "PENALTY_FIRST" }, { label: "Charges First", value: "CHARGES_FIRST" },
  { label: "Interest First", value: "INTEREST_FIRST" }, { label: "Principal First", value: "PRINCIPAL_FIRST" },
];

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

export default function EditPenalty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    penalty_name: "", frequency: "", basis_of_recovery: "",
    recovery_stage: "", recovery_mode: "", rate_of_penalty: "",
    tax_mapping: "NONE", sequence_of_adjustment: "PENALTY_FIRST", status: "ACTIVE",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await penaltiesService.getPenalty(id);
        setForm({
          penalty_name: data.penalty_name || "",
          frequency: data.frequency || "",
          basis_of_recovery: data.basis_of_recovery || "",
          recovery_stage: data.recovery_stage || "",
          recovery_mode: data.recovery_mode || "",
          rate_of_penalty: data.rate_of_penalty ?? "",
          tax_mapping: data.tax_mapping || "NONE",
          sequence_of_adjustment: data.sequence_of_adjustment || "PENALTY_FIRST",
          status: data.status || "ACTIVE",
        });
      } finally { setLoading(false); }
    })();
  }, [id]);

  const validate = (v) => {
    const e = {};
    if (!v.penalty_name?.trim()) e.penalty_name = "Penalty name is required";
    if (!v.frequency) e.frequency = "Frequency is required";
    if (!v.basis_of_recovery) e.basis_of_recovery = "Basis is required";
    if (!v.recovery_stage) e.recovery_stage = "Recovery stage is required";
    if (!v.recovery_mode) e.recovery_mode = "Recovery mode is required";
    if (v.rate_of_penalty === "") e.rate_of_penalty = "Rate is required";
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
      await penaltiesService.updatePenalty(id, { ...form, rate_of_penalty: Number(form.rate_of_penalty) });
      navigate(-1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update. Please try again.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="px-8 py-6"><p className="text-gray-500">Loading penalty...</p></div>;

  return (
    <div className="px-8 py-6">
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center gap-4 mb-6 shadow-sm max-w-2xl">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Penalty</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update penalty rules and recovery logic</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl space-y-8">
        <Section title="Penalty Details">
          <StyledInput label="Penalty Name *" value={form.penalty_name} placeholder="e.g. Late Payment Fee"
            onChange={e => handleChange("penalty_name", e.target.value)} error={fieldErrors.penalty_name} />
          <StyledSelect label="Frequency *" value={form.frequency} options={FREQUENCY_OPTIONS}
            onChange={e => handleChange("frequency", e.target.value)} error={fieldErrors.frequency} />
          <StyledSelect label="Basis of Recovery *" value={form.basis_of_recovery} options={BASIS_OPTIONS}
            onChange={e => handleChange("basis_of_recovery", e.target.value)} error={fieldErrors.basis_of_recovery} />
          <StyledInput label="Rate of Penalty *" type="number" value={form.rate_of_penalty} placeholder="e.g. 2.5"
            onChange={e => handleChange("rate_of_penalty", e.target.value)} error={fieldErrors.rate_of_penalty} />
        </Section>
        <Section title="Recovery Details">
          <StyledSelect label="Recovery Stage *" value={form.recovery_stage} options={RECOVERY_STAGE_OPTIONS}
            onChange={e => handleChange("recovery_stage", e.target.value)} error={fieldErrors.recovery_stage} />
          <StyledSelect label="Recovery Mode *" value={form.recovery_mode} options={RECOVERY_MODE_OPTIONS}
            onChange={e => handleChange("recovery_mode", e.target.value)} error={fieldErrors.recovery_mode} />
          <StyledSelect label="Tax Mapping" value={form.tax_mapping} options={TAX_OPTIONS}
            onChange={e => handleChange("tax_mapping", e.target.value)} />
          <StyledSelect label="Sequence of Adjustment" value={form.sequence_of_adjustment} options={SEQUENCE_OPTIONS}
            onChange={e => handleChange("sequence_of_adjustment", e.target.value)} />
        </Section>
        <Section title="Configuration">
          <StyledSelect label="Status *" value={form.status} options={STATUS_OPTIONS}
            onChange={e => handleChange("status", e.target.value)} error={fieldErrors.status} />
        </Section>
        {error && <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-all">
            <FiSave size={15} />{saving ? "Updating..." : "Update Penalty"}
          </button>
        </div>
      </div>
    </div>
  );
}