import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
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
  { label: "One-time", value: "One-time" },
  { label: "Monthly", value: "Monthly" },
  { label: "Annually", value: "Annually" },
];

const FEE_BASIS_OPTIONS = [
  { label: "Fixed", value: "Fixed" },
  { label: "Percentage", value: "Percentage" },
  { label: "Slab-based", value: "Slab" },
];

const RECOVERY_STAGE_OPTIONS = [
  { label: "Disbursement", value: "Disbursement" },
  { label: "Ongoing", value: "Ongoing" },
  { label: "Closure", value: "Closure" },
];

const RECOVERY_MODE_OPTIONS = [
  { label: "Direct Debit", value: "Direct Debit" },
  { label: "Auto-debit", value: "Auto-debit" },
  { label: "Cash", value: "Cash" },
];

const EditFees = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    frequency: "",
    basis: "",
    recovery_stage: "",
    recovery_mode: "",
    rate: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ================= LOAD FEE ================= */
  useEffect(() => {
    (async () => {
      try {
        const data = await feesService.getFee(id);
        setForm({
          name: data.name,
          frequency: data.fees_frequency,
          basis: data.basis_of_fees,
          recovery_stage: data.recovery_stage,
          recovery_mode: data.recovery_mode,
          rate: data.fees_rate,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Fee name is required";
    if (!v.frequency) e.frequency = "Fees frequency is required";
    if (!v.basis) e.basis = "Basis of fees is required";
    if (!v.recovery_stage) e.recovery_stage = "Recovery stage is required";
    if (!v.recovery_mode) e.recovery_mode = "Recovery mode is required";
    if (v.rate === "") e.rate = "Fees rate is required";
    else if (Number(v.rate) < 0) e.rate = "Fees rate cannot be negative";
    return e;
  };

  const hasErrors = useMemo(() => Object.keys(validate(form)).length > 0, [form]);

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
      frequency: true,
      basis: true,
      recovery_stage: true,
      recovery_mode: true,
      rate: true,
    });

    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        fees_frequency: form.frequency,
        basis_of_fees: form.basis,
        recovery_stage: form.recovery_stage,
        recovery_mode: form.recovery_mode,
        fees_rate: Number(form.rate),
      };
      await feesService.updateFee(id, payload);
      navigate("/fees");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500 text-sm">Loading fee details...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SubPageHeader
        title="Edit Fee"
        subtitle="Update fee configuration and recovery rules"
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
          />
          <SelectField
            label="Fees Frequency"
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            onBlur={handleBlur}
            options={FEE_FREQUENCY_OPTIONS}
          />
          <SelectField
            label="Basis of Fees"
            name="basis"
            value={form.basis}
            onChange={handleChange}
            onBlur={handleBlur}
            options={FEE_BASIS_OPTIONS}
          />
          <SelectField
            label="Recovery Stage"
            name="recovery_stage"
            value={form.recovery_stage}
            onChange={handleChange}
            onBlur={handleBlur}
            options={RECOVERY_STAGE_OPTIONS}
          />
          <SelectField
            label="Recovery Mode"
            name="recovery_mode"
            value={form.recovery_mode}
            onChange={handleChange}
            onBlur={handleBlur}
            options={RECOVERY_MODE_OPTIONS}
          />
          <InputField
            label="Fees Rate"
            name="rate"
            type="number"
            value={form.rate}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <div className="md:col-span-2 pt-4">
            <Button
              type="submit"
              fullWidth
              icon={<FiSave />}
              label={submitting ? "Updating..." : "Update Fee"}
              disabled={hasErrors || submitting}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditFees;
