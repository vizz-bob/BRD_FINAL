import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import {
  PageHeader,
  InputField,
  SelectField,
  Button,
  FormCard,
} from "../../components/Controls/SharedUIHelpers";

import { bankFundService } from "../../services/bankFundService";

const ACCOUNT_TYPE_OPTIONS = [
  { label: "Savings", value: "Savings" },
  { label: "Current", value: "Current" },
  { label: "NODAL", value: "NODAL" },
  { label: "Escrow", value: "Escrow" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const getValue = (v) => {
  if (typeof v === "string") return v;
  if (v?.target?.value) return v.target.value;
  return "";
};

export default function EditBank() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    bank_name: "",
    ifsc_code: "",
    branch: "",
    bank_account_type: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- FETCH BANK ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await bankFundService.getBank(id);
        setForm({
          bank_name: data.bank_name || "",
          ifsc_code: data.ifsc_code || "",
          branch: data.branch || "",
          bank_account_type: data.bank_account_type || "",
          status: data.status || "Active",
        });
      } catch (err) {
        console.error("Failed to load bank:", err);
        alert("Failed to load bank details.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  /* ---------------- VALIDATION ---------------- */
  const errors = useMemo(() => {
    const e = {};
    if (!String(form.bank_name).trim()) e.bank_name = "Bank name is required";
    if (!String(form.ifsc_code).trim()) e.ifsc_code = "IFSC code is required";
    if (!String(form.branch).trim()) e.branch = "Branch is required";
    if (!form.bank_account_type)
      e.bank_account_type = "Account type is required";
    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasErrors || submitting) return;

    setSubmitting(true);
    try {
      await bankFundService.updateBank(id, {
        bank_name: String(form.bank_name).trim(),
        ifsc_code: String(form.ifsc_code).trim().toUpperCase(),
        branch: String(form.branch).trim(),
        bank_account_type: String(form.bank_account_type).trim(),
        status: String(form.status),
      });
      alert("Bank updated successfully!");
      navigate("/bank-management");
    } catch (err) {
      console.error("Update bank failed:", err);
      alert("Failed to update bank. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <MainLayout>
        <p className="text-gray-500">Loading bank details...</p>
      </MainLayout>
    );

  return (
    <MainLayout>
      <PageHeader
        title="Edit Bank"
        subtitle="Update bank details and account type"
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

          <SelectField
            label="Status"
            value={form.status}
            onChange={(v) => update("status", getValue(v))}
            options={STATUS_OPTIONS}
          />

          <div className="md:col-span-2">
            <Button
              type="submit"
              icon={<FiSave />}
              fullWidth
              disabled={hasErrors || submitting}
            >
              {submitting ? "Updating..." : "Update Bank"}
            </Button>
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
