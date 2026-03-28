import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import {
  SubPageHeader,
  InputField,
  SelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

import { interestService } from "../../../services/productManagementService";

/* ---------------- OPTIONS ---------------- */
const BENCHMARK_TYPE_OPTIONS = [
  { label: "MCLR", value: "MCLR" },
  { label: "RBI Rate", value: "RBI_RATE" },
  { label: "Base Rate", value: "BASE_RATE" },
];

const BENCHMARK_FREQUENCY_OPTIONS = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Quarterly", value: "QUARTERLY" },
];

const INTEREST_TYPE_OPTIONS = [
  { label: "Fixed", value: "FIXED" },
  { label: "Floating", value: "FLOATING" },
];

const ACCRUAL_STAGE_OPTIONS = [
  { label: "Pre-EMI", value: "PRE_EMI" },
  { label: "Post-EMI", value: "POST_EMI" },
];

const ACCRUAL_METHOD_OPTIONS = [
  { label: "Simple", value: "SIMPLE" },
  { label: "Compound", value: "COMPOUND" },
];

const EditInterest = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    benchmark_type: "",
    benchmark_frequency: "",
    benchmark_rate: "",
    mark_up: "",
    interest_type: "",
    accrual_stage: "",
    accrual_method: "",
    interest_rate: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const data = await interestService.getInterest(id);
        setForm({
          benchmark_type: data.benchmark_type,
          benchmark_frequency: data.benchmark_frequency,
          benchmark_rate: data.benchmark_rate,
          mark_up: data.mark_up,
          interest_type: data.interest_type,
          accrual_stage: data.accrual_stage,
          accrual_method: data.accrual_method,
          interest_rate: data.interest_rate,
          is_active: data.is_active,
        });
      } catch (err) {
        console.error("Failed to load interest:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const validate = (v) => {
    const e = {};
    if (!v.benchmark_type) e.benchmark_type = "Required";
    if (!v.benchmark_frequency) e.benchmark_frequency = "Required";
    if (v.benchmark_rate === "") e.benchmark_rate = "Required";
    if (v.mark_up === "") e.mark_up = "Required";
    if (!v.interest_type) e.interest_type = "Required";
    if (!v.accrual_stage) e.accrual_stage = "Required";
    if (!v.accrual_method) e.accrual_method = "Required";
    if (v.interest_rate === "") e.interest_rate = "Required";
    return e;
  };

  const hasErrors = useMemo(() => Object.keys(validate(form)).length > 0, [form]);

  const handleChange = (name) => (e) => {
    setForm((p) => ({ ...p, [name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(form);
    setErrors(err);
    if (Object.keys(err).length) return;

    setSubmitting(true);
    try {
      await interestService.updateInterest(id, form);
      navigate(-1);
    } catch (err) {
      console.error("Failed to update interest:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500">Loading interest configuration...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SubPageHeader
        title="Edit Interest Configuration"
        subtitle="Update benchmark and interest calculation rules"
        onBack={() => navigate(-1)}
      />

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 text-sm font-semibold text-gray-600">
            Benchmark Configuration
          </div>

          <SelectField
            label="Benchmark Type"
            value={form.benchmark_type}
            onChange={handleChange("benchmark_type")}
            options={BENCHMARK_TYPE_OPTIONS}
          />

          <SelectField
            label="Benchmark Frequency"
            value={form.benchmark_frequency}
            onChange={handleChange("benchmark_frequency")}
            options={BENCHMARK_FREQUENCY_OPTIONS}
          />

          <InputField
            label="Benchmark Rate (%)"
            type="number"
            value={form.benchmark_rate}
            onChange={handleChange("benchmark_rate")}
          />

          <InputField
            label="Mark Up (%)"
            type="number"
            value={form.mark_up}
            onChange={handleChange("mark_up")}
          />

          <div className="md:col-span-2 text-sm font-semibold text-gray-600 mt-4">
            Interest Configuration
          </div>

          <SelectField
            label="Interest Type"
            value={form.interest_type}
            onChange={handleChange("interest_type")}
            options={INTEREST_TYPE_OPTIONS}
          />

          <SelectField
            label="Accrual Stage"
            value={form.accrual_stage}
            onChange={handleChange("accrual_stage")}
            options={ACCRUAL_STAGE_OPTIONS}
          />

          <SelectField
            label="Accrual Method"
            value={form.accrual_method}
            onChange={handleChange("accrual_method")}
            options={ACCRUAL_METHOD_OPTIONS}
          />

          <InputField
            label="Interest Rate (% p.a.)"
            type="number"
            value={form.interest_rate}
            onChange={handleChange("interest_rate")}
          />

          <div className="md:col-span-2">
            <Button
              type="submit"
              fullWidth
              icon={<FiSave />}
              label={submitting ? "Updating..." : "Update Interest"}
              disabled={hasErrors || submitting}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditInterest;
