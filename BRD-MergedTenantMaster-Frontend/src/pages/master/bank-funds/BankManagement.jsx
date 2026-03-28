import React, { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import {
  SubPageHeader,
  FormCard,
  InputField,
  SelectField,
  Button,
} from "../../../components/master/Controls/SharedUIHelpers";

import { bankFundService } from "../../../services/bankFundService";

/* ─────────────────── DROPDOWN OPTIONS ─────────────────── */

const BANK_ACCOUNT_TYPE_OPTIONS = [
  { label: "Savings", value: "Savings" },
  { label: "Current", value: "Current" },
  { label: "Nodal", value: "Nodal" },
  { label: "Escrow", value: "Escrow" },
  { label: "Cash Credit", value: "Cash Credit" },
  { label: "Overdraft", value: "Overdraft" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

/* ─────────────────── HELPERS ─────────────────── */

const SectionHeader = ({ title }) => (
  <div className="md:col-span-2 mt-2">
    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
      {title}
    </h2>
    <hr />
  </div>
);

const AuditField = ({ label, value, required = false }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-500">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 min-h-[38px]">
      {value || <span className="italic text-gray-300">Auto-generated</span>}
    </div>
  </div>
);

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function BankManagementForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    bank_name: "",
    ifsc_code: "",
    branch: "",
    bank_account_type: "",
    status: "Active",
  });

  const [audit, setAudit] = useState({
    version_number: "",
    created_at: "",
    updated_at: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH (EDIT) ================= */
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchBank = async () => {
      setFetching(true);
      try {
        const data = await bankFundService.getBank(id);
        if (data) {
          setForm({
            bank_name:         data.bank_name || "",
            ifsc_code:         data.ifsc_code || "",
            branch:            data.branch || "",
            bank_account_type: data.bank_account_type || "",
            status:            data.status || "Active",
          });
          setAudit({
            version_number: data.version_number || "",
            created_at:     data.created_at || "",
            updated_at:     data.updated_at || "",
          });
        }
      } catch (err) {
        console.error("Failed to load bank details", err);
        setError("Failed to load bank details.");
      } finally {
        setFetching(false);
      }
    };

    fetchBank();
  }, [isEdit, id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      bank_name:         form.bank_name.trim(),
      ifsc_code:         form.ifsc_code.trim().toUpperCase(),
      branch:            form.branch.trim(),
      bank_account_type: form.bank_account_type,
      status:            form.status,
    };

    try {
      if (isEdit && id) {
        await bankFundService.updateBank(id, payload);
      } else {
        await bankFundService.createBank(payload);
      }
      navigate("/bank-management");
    } catch (err) {
      console.error("Save error:", err.response?.data || err);
      setError("Failed to save bank details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <SubPageHeader
        title={isEdit ? "Edit Bank" : "Add Bank"}
        subtitle="Manage operational banks and account types"
        onBack={() => navigate(-1)}
      />

      {fetching ? (
        <p className="text-gray-500">Loading bank details...</p>
      ) : (
        <FormCard className="max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* ══ SECTION 1: Bank Details ══ */}
            <SectionHeader title="Bank Details" />

            <InputField
              label="Bank Name"
              name="bank_name"
              value={form.bank_name}
              onChange={handleChange}
              placeholder="e.g. State Bank of India"
              required
            />

            <InputField
              label="IFSC Code"
              name="ifsc_code"
              value={form.ifsc_code}
              onChange={handleChange}
              placeholder="e.g. SBIN0001234"
              required
            />

            <InputField
              label="Branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              placeholder="e.g. Connaught Place, New Delhi"
              required
            />

            <SelectField
              label="Bank Account Type"
              name="bank_account_type"
              value={form.bank_account_type}
              onChange={handleChange}
              options={BANK_ACCOUNT_TYPE_OPTIONS}
              placeholder="Select account type"
              required
            />

            {/* ══ SECTION 2: Status ══ */}
            <SectionHeader title="Status" />

            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={STATUS_OPTIONS}
              required
            />

            {/* ══ SECTION 3: Audit Information ══ */}
            <SectionHeader title="Audit Information" />

            <AuditField label="Version Number" value={audit.version_number} required />
            <AuditField label="Created At"     value={audit.created_at}     required />
            <AuditField label="Updated At"     value={audit.updated_at}     required />

            {/* ══ ERROR ══ */}
            {error && (
              <div className="md:col-span-2 text-sm text-red-600">{error}</div>
            )}

            {/* ══ ACTION ══ */}
            <div className="md:col-span-2 flex justify-end pt-2">
              <Button
                type="submit"
                icon={<FiSave />}
                label={loading ? "Saving..." : isEdit ? "Update Bank" : "Save Bank"}
                disabled={loading}
              />
            </div>
          </form>
        </FormCard>
      )}
    </>
  );
}