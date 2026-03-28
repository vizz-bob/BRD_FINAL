import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiUpload } from "react-icons/fi";

/* ===== SERVICES ===== */
import { bankingManagementService } from "../../../../services/eligibilityManagementService";

/* ===== SHARED UI ===== */
import {
  SubPageHeader,
  FormCard,
  InputField,
  SelectField,
  Button,
} from "../../../../components/master/Controls/SharedUIHelpers";

/* ===== OPTIONS ===== */
const BANK_ACCOUNT_TYPE_OPTIONS = [
  { label: "Savings", value: "Savings" },
  { label: "Current", value: "Current" },
  { label: "Overdraft", value: "Overdraft" },
  { label: "NODAL", value: "NODAL" },
  { label: "Escrow", value: "Escrow" },
];

const AVERAGE_BANKING_CRITERIA_OPTIONS = [
  { label: "Average Balance", value: "Average Balance" },
  { label: "Credits", value: "Credits" },
  { label: "Debits", value: "Debits" },
];

const AVERAGE_BALANCE_FREQUENCY_OPTIONS = [
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

/* ===== SECTION HEADER ===== */
const SectionHeader = ({ title }) => (
  <div className="md:col-span-2 mt-2">
    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
      {title}
    </h2>
    <hr />
  </div>
);

/* ===== TOGGLE FIELD ===== */
const ToggleField = ({ label, name, checked, onChange, required, helperText }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="flex items-center gap-3 mt-1">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange({ target: { name, value: !checked } })}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm text-gray-600">{checked ? "Enabled" : "Disabled"}</span>
    </div>
    {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
  </div>
);

/* ===== FILE UPLOAD FIELD ===== */
const FileUploadField = ({ label, name, onChange, helperText, accept }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange({ target: { name, value: file } });
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <label className="flex items-center gap-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
        <FiUpload className="text-gray-400 shrink-0" />
        <span className="text-sm text-gray-500 truncate">
          {fileName || "Click to upload PDF"}
        </span>
        <input
          type="file"
          name={name}
          accept={accept || ".pdf"}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
};

/* ===== READ-ONLY AUDIT FIELD ===== */
const AuditField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 min-h-[38px]">
      {value || <span className="italic text-gray-300">Auto-generated</span>}
    </div>
  </div>
);

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function BankingForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    // Core
    bank_account_type: "",
    average_banking_criteria: "",
    average_banking_from: "",
    average_banking_to: "",
    is_active: true,

    // Analysis & Frequency
    average_balance_frequency: "",
    account_aggregator_enabled: false,
    bank_statement_pdf: null,
  });

  // Audit fields — read-only, populated from API in edit mode
  const [audit, setAudit] = useState({
    version_number: "",
    user_id: "",
    created_at: "",
    updated_at: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= LOAD EDIT DATA ================= */
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchBankingRule = async () => {
      setLoading(true);
      try {
        const data = await bankingManagementService.retrieve(id);

        if (data) {
          setForm({
            bank_account_type:           data.bank_account_type || "",
            average_banking_criteria:    data.average_banking_criteria || "",
            average_banking_from:        data.average_banking_from || "",
            average_banking_to:          data.average_banking_to || "",
            is_active:                   data.is_active ?? true,
            average_balance_frequency:   data.average_balance_frequency || "",
            account_aggregator_enabled:  data.account_aggregator_enabled ?? false,
            bank_statement_pdf:          null, // File inputs are never pre-filled
          });

          setAudit({
            version_number: data.version_number || "",
            user_id:        data.user_id || "",
            created_at:     data.created_at || "",
            updated_at:     data.updated_at || "",
          });
        }
      } catch (error) {
        console.error("Failed to load banking rule", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankingRule();
  }, [isEdit, id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_active") {
      setForm((prev) => ({ ...prev, is_active: value === "Active" }));
      return;
    }

    if (name === "account_aggregator_enabled") {
      setForm((prev) => ({ ...prev, account_aggregator_enabled: Boolean(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Use FormData if a PDF is attached, otherwise send JSON
    const hasPdf = form.bank_statement_pdf instanceof File;

    let payload;
    if (hasPdf) {
      payload = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== undefined) payload.append(key, val);
      });
    } else {
      const { bank_statement_pdf, ...rest } = form;
      payload = rest;
    }

    try {
      if (isEdit && id) {
        await bankingManagementService.update(id, payload);
      } else {
        await bankingManagementService.create(payload);
      }
      navigate("/banking");
    } catch (error) {
      console.error("Error saving banking rule", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <SubPageHeader
        title={isEdit ? "Edit Banking Rule" : "Add Banking Rule"}
        subtitle="Define banking eligibility criteria"
        onBack={() => navigate(-1)}
      />

      <FormCard className="max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* ══ SECTION 1: Core Banking Eligibility ══ */}
          <SectionHeader title="Core Banking Eligibility" />

          <SelectField
            label="Bank Account Type"
            name="bank_account_type"
            value={form.bank_account_type}
            onChange={handleChange}
            options={BANK_ACCOUNT_TYPE_OPTIONS}
            placeholder="Select account type"
            required
          />

          <SelectField
            label="Average Banking Criteria"
            name="average_banking_criteria"
            value={form.average_banking_criteria}
            onChange={handleChange}
            options={AVERAGE_BANKING_CRITERIA_OPTIONS}
            placeholder="Select criteria"
            required
          />

          <InputField
            label="Average Banking From"
            name="average_banking_from"
            type="date"
            value={form.average_banking_from}
            onChange={handleChange}
            required
          />

          <InputField
            label="Average Banking To"
            name="average_banking_to"
            type="date"
            value={form.average_banking_to}
            onChange={handleChange}
            required
          />

          <SelectField
            label="Status"
            name="is_active"
            value={form.is_active ? "Active" : "Inactive"}
            onChange={handleChange}
            options={STATUS_OPTIONS}
            required
          />

          {/* ══ SECTION 2: Automated Analysis & Frequency ══ */}
          <SectionHeader title="Automated Analysis & Frequency" />

          <SelectField
            label="Average Balance Frequency"
            name="average_balance_frequency"
            value={form.average_balance_frequency}
            onChange={handleChange}
            options={AVERAGE_BALANCE_FREQUENCY_OPTIONS}
            placeholder="Select frequency"
          />

          <ToggleField
            label="Account Aggregator Enabled"
            name="account_aggregator_enabled"
            checked={form.account_aggregator_enabled}
            onChange={handleChange}
            helperText="Triggers Account Aggregator API to fetch statements securely"
          />

          <div className="md:col-span-2">
            <FileUploadField
              label="Upload Bank Statement (PDF)"
              name="bank_statement_pdf"
              onChange={handleChange}
              accept=".pdf"
              helperText="Manual fallback for PDF Statement Analyser if Account Aggregator API is not used"
            />
          </div>

          {/* ══ SECTION 3: Audit Information ══ */}
          <SectionHeader title="Audit Information" />

          <AuditField label="Version Number *" value={audit.version_number} />
          <AuditField label="User ID *"         value={audit.user_id} />
          <AuditField label="Created At *"      value={audit.created_at} />
          <AuditField label="Updated At *"      value={audit.updated_at} />

          {/* ══ ACTION ══ */}
          <div className="md:col-span-2 flex justify-end pt-4">
            <Button
              type="submit"
              icon={<FiSave />}
              label={loading ? "Saving..." : isEdit ? "Update Banking Rule" : "Save Banking Rule"}
              disabled={loading}
            />
          </div>
        </form>
      </FormCard>
    </>
  );
}