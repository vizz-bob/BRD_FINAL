import React, { useEffect, useState } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { repaymentsService } from "../../../../services/productManagementService";

const TYPE_OPTIONS = [{ label: "EMI", value: "EMI" }, { label: "Bullet", value: "BULLET" }, { label: "Step-up", value: "STEP_UP" }];
const FREQUENCY_OPTIONS = [{ label: "Monthly", value: "MONTHLY" }, { label: "Bi-weekly", value: "Bi-weekly" }];
const SEQUENCE_OPTIONS = [{ label: "Principal First", value: "PRINCIPAL_FIRST" }, { label: "Interest First", value: "INTEREST_FIRST" }];
const COLLECTION_MODE_OPTIONS = [{ label: "NACH", value: "NACH" }, { label: "Cash", value: "CASH" }, { label: "Online", value: "ONLINE" }];
const STATUS_OPTIONS = [{ label: "Active", value: "ACTIVE" }, { label: "Inactive", value: "INACTIVE" }];
const MONTH_OPTIONS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_OPTIONS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DATE_OPTIONS = ["1","5","10","15","20","25","30"];

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
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
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
const StyledMultiSelect = ({ label, values, options, onChange, hint }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <select multiple value={values}
      onChange={e => onChange(Array.from(e.target.selectedOptions).map(o => o.value))}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] transition-all">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <p className="mt-1 text-xs text-gray-400">{hint || "Hold Ctrl / Cmd to select multiple"}</p>
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

export default function EditRepayment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    repayment_type: "", frequency: "", limit_in_month: "",
    gap_between_disbursement_and_first_repayment: "", number_of_repayments: "",
    sequence_of_repayment_adjustment: "", repayment_months: [],
    repayment_days: [], repayment_dates: [], mode_of_collection: "",
    retry_attempts: "", retry_interval: "", status: "ACTIVE",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await repaymentsService.getRepayment(id);
        setForm({
          repayment_type: data.repayment_type || "",
          frequency: data.frequency || "",
          limit_in_month: data.limit_in_month || "",
          gap_between_disbursement_and_first_repayment: data.gap_between_disbursement_and_first_repayment || "",
          number_of_repayments: data.number_of_repayments || "",
          sequence_of_repayment_adjustment: data.sequence_of_repayment_adjustment || "",
          repayment_months: data.repayment_months || [],
          repayment_days: data.repayment_days || [],
          repayment_dates: data.repayment_dates || [],
          mode_of_collection: data.mode_of_collection || "",
          retry_attempts: data.retry_attempts || "",
          retry_interval: data.retry_interval || "",
          status: data.status || "ACTIVE",
        });
      } finally { setLoading(false); }
    })();
  }, [id]);

  const validate = (v) => {
    const e = {};
    if (!v.repayment_type) e.repayment_type = "Type is required";
    if (!v.frequency) e.frequency = "Frequency is required";
    if (!v.limit_in_month) e.limit_in_month = "Limit is required";
    if (!v.number_of_repayments) e.number_of_repayments = "Number is required";
    if (!v.sequence_of_repayment_adjustment) e.sequence_of_repayment_adjustment = "Sequence is required";
    if (!v.mode_of_collection) e.mode_of_collection = "Collection mode is required";
    return e;
  };

  const update = (name, value) => {
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
      await repaymentsService.updateRepayment(id, {
        ...form,
        limit_in_month: Number(form.limit_in_month),
        gap_between_disbursement_and_first_repayment: Number(form.gap_between_disbursement_and_first_repayment),
        number_of_repayments: Number(form.number_of_repayments),
        retry_attempts: Number(form.retry_attempts) || 0,
        retry_interval: Number(form.retry_interval) || 0,
      });
      navigate(-1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update. Please try again.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="px-8 py-6"><p className="text-gray-500">Loading repayment...</p></div>;

  return (
    <div className="px-8 py-6">
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center gap-4 mb-6 shadow-sm max-w-3xl">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Repayment Rule</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update repayment schedule and collection rules</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl space-y-8">
        <Section title="Repayment Details">
          <StyledSelect label="Repayment Type *" value={form.repayment_type} options={TYPE_OPTIONS}
            placeholder="Select type" onChange={e => update("repayment_type", e.target.value)} error={fieldErrors.repayment_type} />
          <StyledSelect label="Frequency *" value={form.frequency} options={FREQUENCY_OPTIONS}
            placeholder="Select frequency" onChange={e => update("frequency", e.target.value)} error={fieldErrors.frequency} />
          <StyledInput label="Limit in Months *" type="number" value={form.limit_in_month} placeholder="e.g. 12"
            onChange={e => update("limit_in_month", e.target.value)} error={fieldErrors.limit_in_month} />
          <StyledInput label="Gap Before First Repayment" type="number" value={form.gap_between_disbursement_and_first_repayment}
            placeholder="e.g. 1" onChange={e => update("gap_between_disbursement_and_first_repayment", e.target.value)} />
          <StyledInput label="No. of Repayments *" type="number" value={form.number_of_repayments} placeholder="e.g. 12"
            onChange={e => update("number_of_repayments", e.target.value)} error={fieldErrors.number_of_repayments} />
          <StyledSelect label="Repayment Sequence *" value={form.sequence_of_repayment_adjustment} options={SEQUENCE_OPTIONS}
            placeholder="Select sequence" onChange={e => update("sequence_of_repayment_adjustment", e.target.value)} error={fieldErrors.sequence_of_repayment_adjustment} />
          <StyledSelect label="Collection Mode *" value={form.mode_of_collection} options={COLLECTION_MODE_OPTIONS}
            placeholder="Select mode" onChange={e => update("mode_of_collection", e.target.value)} error={fieldErrors.mode_of_collection} />
          <StyledSelect label="Status *" value={form.status} options={STATUS_OPTIONS}
            onChange={e => update("status", e.target.value)} />
        </Section>
        <Section title="Repayment Schedule">
          <StyledMultiSelect label="Repayment Months" values={form.repayment_months} options={MONTH_OPTIONS}
            onChange={v => update("repayment_months", v)} hint="Select allowed repayment months" />
          <StyledMultiSelect label="Repayment Days" values={form.repayment_days} options={DAY_OPTIONS}
            onChange={v => update("repayment_days", v)} hint="Select allowed repayment days" />
          <div className="md:col-span-2">
            <StyledMultiSelect label="Repayment Dates" values={form.repayment_dates} options={DATE_OPTIONS}
              onChange={v => update("repayment_dates", v)} hint="Select allowed dates of month" />
          </div>
        </Section>
        <Section title="Retry Configuration">
          <StyledInput label="Retry Attempts" type="number" value={form.retry_attempts} placeholder="e.g. 3"
            onChange={e => update("retry_attempts", e.target.value)} />
          <StyledInput label="Retry Interval (Days)" type="number" value={form.retry_interval} placeholder="e.g. 7"
            onChange={e => update("retry_interval", e.target.value)} />
        </Section>
        {error && <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-all">
            <FiSave size={15} />{saving ? "Updating..." : "Update Repayment Rule"}
          </button>
        </div>
      </div>
    </div>
  );
}