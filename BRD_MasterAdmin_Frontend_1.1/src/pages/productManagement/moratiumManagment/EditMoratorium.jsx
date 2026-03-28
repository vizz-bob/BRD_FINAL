import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import {
  SubPageHeader,
  InputField,
  SelectField,
  CheckboxGroup,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

import { moratoriumService } from "../../../services/productManagementService";

/* ================= OPTIONS ================= */

const MORATORIUM_TYPE_OPTIONS = [
  { label: "Full", value: "FULL" },
  { label: "Interest-only", value: "INTEREST_ONLY" },
];

const PERIOD_UNIT_OPTIONS = [
  { label: "Day", value: "DAY" },
  { label: "Month", value: "MONTH" },
];

const EFFECT_OPTIONS = [
  { label: "Interest-only", value: "INTEREST_ONLY" },
  { label: "Deferred", value: "DEFERRED" },
];

export default function EditMoratorium() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    moratorium_type: "",
    period_value: "",
    period_unit: "MONTH",
    amount: "",
    effect_of_moratorium: "",
    interest_rationalisation: false,
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    (async () => {
      try {
        const data = await moratoriumService.getMoratorium(id);
        setForm(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ================= VALIDATION ================= */
  const hasErrors = useMemo(() => {
    if (!form.moratorium_type) return true;
    if (!form.period_value || form.period_value <= 0) return true;
    if (!form.amount || form.amount <= 0) return true;
    if (!form.effect_of_moratorium) return true;
    return false;
  }, [form]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasErrors) return;

    setSubmitting(true);
    try {
      await moratoriumService.updateMoratorium(id, {
        ...form,
        period_value: Number(form.period_value),
        amount: Number(form.amount),
      });
      navigate(-1);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center py-6 text-gray-500">
          Loading moratorium details...
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SubPageHeader
        title="Edit Moratorium"
        subtitle="Update moratorium configuration and interest impact"
        onBack={() => navigate(-1)}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <SelectField
          label="Moratorium Type"
          name="moratorium_type"
          value={form.moratorium_type}
          onChange={handleChange}
          options={MORATORIUM_TYPE_OPTIONS}
          required
        />

        <div className="flex gap-4">
          <InputField
            label="Period"
            type="number"
            name="period_value"
            value={form.period_value}
            onChange={handleChange}
            required
          />
          <SelectField
            label="Unit"
            name="period_unit"
            value={form.period_unit}
            onChange={handleChange}
            options={PERIOD_UNIT_OPTIONS}
          />
        </div>

        <InputField
          label="Amount Under Moratorium"
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <SelectField
          label="Effect of Moratorium"
          name="effect_of_moratorium"
          value={form.effect_of_moratorium}
          onChange={handleChange}
          options={EFFECT_OPTIONS}
          required
        />

        <div className="md:col-span-2">
          <CheckboxGroup
            label="Interest Treatment"
            values={form.interest_rationalisation ? ["YES"] : []}
            options={[
              {
                label: "Waive / Rationalise Interest during Moratorium",
                value: "YES",
              },
            ]}
            onChange={() =>
              setForm((p) => ({
                ...p,
                interest_rationalisation: !p.interest_rationalisation,
              }))
            }
          />
        </div>

        <div className="md:col-span-2">
          <Button
            type="submit"
            label={submitting ? "Updating..." : "Update Moratorium"}
            icon={<FiSave />}
            fullWidth
            disabled={hasErrors || submitting}
          />
        </div>
      </form>
    </MainLayout>
  );
}
