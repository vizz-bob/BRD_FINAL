import React, { useMemo, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiSave } from "react-icons/fi";

import {
  SubPageHeader,
  InputField,
  SelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

import { feesService } from "../../../services/productManagementService";

/* ================= OPTIONS ================= */
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

const AddFees = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    fees_frequency: "",
    basis_of_fees: "",
    fees_recovery_stage: "",
    fees_recovery_mode: "",
    fees_rate: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ================= VALIDATION ================= */
  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Fee name is required";
    if (!v.fees_frequency) e.fees_frequency = "Fees frequency is required";
    if (!v.basis_of_fees) e.basis_of_fees = "Basis of fees is required";
    if (!v.fees_recovery_stage) e.fees_recovery_stage = "Recovery stage is required";
    if (!v.fees_recovery_mode) e.fees_recovery_mode = "Recovery mode is required";
    if (v.fees_rate === "") e.fees_rate = "Fees rate is required";
    else if (Number(v.fees_rate) < 0) e.fees_rate = "Fees rate cannot be negative";
    return e;
  };

  const hasErrors = useMemo(() => Object.keys(validate(form)).length > 0, [form]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) setErrors(validate(updated));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({
      name: true,
      fees_frequency: true,
      basis_of_fees: true,
      fees_recovery_stage: true,
      fees_recovery_mode: true,
      fees_rate: true,
    });

    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    try {
      // Directly pass form since field names match Django model
      await feesService.createFee({
        ...form,
        fees_rate: Number(form.fees_rate),
      });
      navigate("/fees/list");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <SubPageHeader
        title="Add Fee"
        subtitle="Define how fees are applied and recovered"
        onBack={() => navigate(-1)}
      />

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputField
            label="Fee Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
          />
          <SelectField
            label="Fees Frequency"
            name="fees_frequency"
            value={form.fees_frequency}
            onChange={handleChange}
            onBlur={handleBlur}
            options={FEE_FREQUENCY_OPTIONS}
            placeholder="Select Frequency"
            error={errors.fees_frequency}
          />
          <SelectField
            label="Basis of Fees"
            name="basis_of_fees"
            value={form.basis_of_fees}
            onChange={handleChange}
            onBlur={handleBlur}
            options={FEE_BASIS_OPTIONS}
            placeholder="Select Basis"
            error={errors.basis_of_fees}
          />
          <SelectField
            label="Recovery Stage"
            name="fees_recovery_stage"
            value={form.fees_recovery_stage}
            onChange={handleChange}
            onBlur={handleBlur}
            options={RECOVERY_STAGE_OPTIONS}
            placeholder="Select Stage"
            error={errors.fees_recovery_stage}
          />
          <SelectField
            label="Recovery Mode"
            name="fees_recovery_mode"
            value={form.fees_recovery_mode}
            onChange={handleChange}
            onBlur={handleBlur}
            options={RECOVERY_MODE_OPTIONS}
            placeholder="Select Mode"
            error={errors.fees_recovery_mode}
          />
          <InputField
            label="Fees Rate"
            name="fees_rate"
            type="number"
            value={form.fees_rate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.fees_rate}
          />

          <div className="md:col-span-2 pt-4">
            <Button
              type="submit"
              fullWidth
              icon={<FiSave />}
              label={submitting ? "Saving..." : "Add Fee"}
              disabled={hasErrors || submitting}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddFees;
