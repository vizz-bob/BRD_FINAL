import React, { useMemo, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  SubPageHeader,
  InputField,
  SelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

import { chargesService } from "../../../services/productManagementService";

const FREQUENCY_OPTIONS = [
  { label: "One-time", value: "ONE_TIME" },
  { label: "Recurring", value: "RECURRING" },
];

const BASIS_OPTIONS = [
  { label: "Fixed", value: "FIXED" },
  { label: "Slab", value: "SLAB" },
  { label: "Variable", value: "VARIABLE" },
];

const RECOVERY_STAGE_OPTIONS = [
  { label: "Onboarding", value: "ONBOARDING" },
  { label: "Post-disbursement", value: "POST_DISBURSEMENT" },
];

const RECOVERY_MODE_OPTIONS = [
  { label: "Auto", value: "AUTO" },
  { label: "Manual", value: "MANUAL" },
];

const AddCharge = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    charge_name: "",
    frequency: "",
    basis_of_recovery: "",
    recovery_stage: "",
    recovery_mode: "",
    rate_of_charges: "",
    is_active: true,
  });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (v) => {
    const e = {};
    if (!v.charge_name) e.charge_name = "Charge name is required";
    if (!v.frequency) e.frequency = "Frequency is required";
    if (!v.basis_of_recovery) e.basis_of_recovery = "Basis is required";
    if (!v.recovery_stage) e.recovery_stage = "Recovery stage is required";
    if (!v.recovery_mode) e.recovery_mode = "Recovery mode is required";
    if (v.rate_of_charges === "") e.rate_of_charges = "Rate is required";
    else if (+v.rate_of_charges < 0) e.rate_of_charges = "Rate cannot be negative";
    return e;
  };

  const errors = useMemo(() => validate(form), [form]);
  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleBlur = (e) => setTouched((p) => ({ ...p, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      charge_name: true,
      frequency: true,
      basis_of_recovery: true,
      recovery_stage: true,
      recovery_mode: true,
      rate_of_charges: true,
    });
    if (hasErrors) return;

    setSubmitting(true);
    try {
      await chargesService.createCharge({
        ...form,
        rate_of_charges: Number(form.rate_of_charges),
      });
      navigate("/charges/list");
    } catch (err) {
      console.error("Add charge error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <SubPageHeader
        title="Add Charge"
        subtitle="Define charges beyond interest and fees"
        onBack={() => navigate(-1)}
      />

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Charge Name"
            name="charge_name"
            value={form.charge_name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.charge_name && errors.charge_name ? "border-red-400" : ""}
          />
          <SelectField
            label="Frequency"
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            options={FREQUENCY_OPTIONS}
          />
          <SelectField
            label="Basis of Recovery"
            name="basis_of_recovery"
            value={form.basis_of_recovery}
            onChange={handleChange}
            options={BASIS_OPTIONS}
          />
          <SelectField
            label="Recovery Stage"
            name="recovery_stage"
            value={form.recovery_stage}
            onChange={handleChange}
            options={RECOVERY_STAGE_OPTIONS}
          />
          <SelectField
            label="Recovery Mode"
            name="recovery_mode"
            value={form.recovery_mode}
            onChange={handleChange}
            options={RECOVERY_MODE_OPTIONS}
          />
          <InputField
            label="Rate of Charges"
            type="number"
            name="rate_of_charges"
            value={form.rate_of_charges}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.rate_of_charges && errors.rate_of_charges ? "border-red-400" : ""}
          />
          <div className="md:col-span-2">
            <Button
              type="submit"
              fullWidth
              icon={<FiSave />}
              label={submitting ? "Saving..." : "Add Charge"}
              disabled={hasErrors || submitting}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddCharge;
