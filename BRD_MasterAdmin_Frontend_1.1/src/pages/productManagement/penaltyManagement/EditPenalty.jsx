import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import {
  PageHeader,
  FormCard,
  InputField,
  SelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

import { penaltiesService } from "../../../services/productManagementService";

/* ================= OPTIONS ================= */

const FREQUENCY_OPTIONS = [
  { label: "One-time", value: "ONE_TIME" },
  { label: "Recurring", value: "RECURRING" },
];

const BASIS_OPTIONS = [
  { label: "Fixed", value: "FIXED" },
  { label: "Percentage", value: "PERCENTAGE" },
  { label: "Slab", value: "SLAB" },
];

const RECOVERY_STAGE_OPTIONS = [
  { label: "Missed EMI", value: "MISSED_EMI" },
  { label: "Post Default", value: "POST_DEFAULT" },
];

const RECOVERY_MODE_OPTIONS = [
  { label: "Auto", value: "AUTO" },
  { label: "Manual", value: "MANUAL" },
];

export default function EditPenalty() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    penalty_name: "",
    frequency: "",
    basis_of_recovery: "",
    recovery_stage: "",
    recovery_mode: "",
    rate_of_penalty: "",
  });

  /* ================= LOAD ================= */

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
        });
      } catch (err) {
        console.error("Load penalty error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ================= VALIDATION ================= */

  const errors = useMemo(() => {
    const e = {};
    if (!form.penalty_name) e.penalty_name = "Penalty name is required";
    if (!form.frequency) e.frequency = "Frequency is required";
    if (!form.basis_of_recovery) e.basis_of_recovery = "Basis is required";
    if (!form.recovery_stage) e.recovery_stage = "Recovery stage is required";
    if (!form.recovery_mode) e.recovery_mode = "Recovery mode is required";
    if (form.rate_of_penalty === "") e.rate_of_penalty = "Penalty rate is required";
    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasErrors) return;

    setSubmitting(true);
    try {
      await penaltiesService.updatePenalty(id, {
        ...form,
        rate_of_penalty: Number(form.rate_of_penalty),
      });
      navigate(-1);
    } catch (err) {
      console.error("Update penalty error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500 p-6">Loading penalty details...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Edit Penalty"
        subtitle="Update penalty rules and recovery logic"
        onBack={() => navigate(-1)}
      />

      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Penalty Name"
            name="penalty_name"
            value={form.penalty_name}
            onChange={handleChange}
            error={errors.penalty_name}
            required
          />

          <SelectField
            label="Frequency"
            name="frequency"
            value={form.frequency}
            options={FREQUENCY_OPTIONS}
            onChange={handleChange}
            error={errors.frequency}
            required
          />

          <SelectField
            label="Basis of Recovery"
            name="basis_of_recovery"
            value={form.basis_of_recovery}
            options={BASIS_OPTIONS}
            onChange={handleChange}
            error={errors.basis_of_recovery}
            required
          />

          <SelectField
            label="Recovery Stage"
            name="recovery_stage"
            value={form.recovery_stage}
            options={RECOVERY_STAGE_OPTIONS}
            onChange={handleChange}
            error={errors.recovery_stage}
            required
          />

          <SelectField
            label="Mode of Recovery"
            name="recovery_mode"
            value={form.recovery_mode}
            options={RECOVERY_MODE_OPTIONS}
            onChange={handleChange}
            error={errors.recovery_mode}
            required
          />

          <InputField
            label="Rate of Penalty"
            type="number"
            name="rate_of_penalty"
            value={form.rate_of_penalty}
            onChange={handleChange}
            error={errors.rate_of_penalty}
            required
          />

          <div className="pt-4">
            <Button
              type="submit"
              icon={<FiSave />}
              fullWidth
              disabled={hasErrors || submitting}
              label={submitting ? "Updating..." : "Update Penalty"}
            />
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
