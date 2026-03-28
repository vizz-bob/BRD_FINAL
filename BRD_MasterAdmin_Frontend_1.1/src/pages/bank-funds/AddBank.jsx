import React, { useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  PageHeader,
  FormCard,
  InputField,
  SelectField,
  Button,
} from "../../components/Controls/SharedUIHelpers";

import { bankFundService } from "../../services/bankFundService";

const ACCOUNT_TYPE_OPTIONS = [
  { label: "Savings", value: "Savings" },
  { label: "Current", value: "Current" },
  { label: "NODAL", value: "NODAL" },
  { label: "Escrow", value: "Escrow" },
];

const getValue = (v) => {
  if (typeof v === "string") return v;
  if (v?.target?.value) return v.target.value;
  return "";
};

export default function AddBank() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    bank_name: "",
    ifsc_code: "",
    branch: "",
    bank_account_type: "",
  });

  const errors = useMemo(() => {
    const e = {};
    if (!String(form.bank_name).trim()) e.bank_name = "Bank name is required";
    if (!String(form.ifsc_code).trim()) e.ifsc_code = "IFSC code is required";
    if (!String(form.branch).trim()) e.branch = "Branch is required";
    if (!form.bank_account_type) e.bank_account_type = "Account type is required";
    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasErrors || submitting) return;

    setSubmitting(true);
    try {
      await bankFundService.createBank({
        bank_name: String(form.bank_name).trim(),
        ifsc_code: String(form.ifsc_code).trim().toUpperCase(),
        branch: String(form.branch).trim(),
        bank_account_type: String(form.bank_account_type).trim(),
      });
      navigate(-1);
    } catch (err) {
      console.error("Create bank failed:", err);
      alert("Failed to create bank. Please check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Add Bank"
        subtitle="Register a new operational bank"
        onBack={() => navigate(-1)}
      />

      <FormCard>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputField
            label="Bank Name"
            value={form.bank_name}
            onChange={(v) => update("bank_name", getValue(v))}
            error={errors.bank_name}
            required
          />

          <InputField
            label="IFSC Code"
            value={form.ifsc_code}
            onChange={(v) => update("ifsc_code", getValue(v).toUpperCase())}
            error={errors.ifsc_code}
            required
          />

          <InputField
            label="Branch"
            value={form.branch}
            onChange={(v) => update("branch", getValue(v))}
            error={errors.branch}
            required
          />

          <SelectField
            label="Account Type"
            value={form.bank_account_type}
            onChange={(v) => update("bank_account_type", getValue(v))}
            options={ACCOUNT_TYPE_OPTIONS}
            error={errors.bank_account_type}
            required
          />

          <div className="md:col-span-2">
            <Button
              type="submit"
              icon={<FiSave />}
              fullWidth
              disabled={hasErrors || submitting}
            >
              {submitting ? "Saving..." : "Create Bank"}
            </Button>
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
