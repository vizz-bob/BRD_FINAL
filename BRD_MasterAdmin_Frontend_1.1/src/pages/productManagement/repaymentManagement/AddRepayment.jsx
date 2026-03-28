import React, { useMemo, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { PageHeader, FormCard, InputField, SelectField, MultiSelectField, Button } from "../../../components/Controls/SharedUIHelpers";
import { repaymentsService } from "../../../services/productManagementService";

const TYPE_OPTIONS = ["EMI", "Bullet", "Step-up"];
const FREQUENCY_OPTIONS = ["Monthly", "Bi-weekly"];
const SEQUENCE_OPTIONS = ["Principal First", "Interest First"];
const COLLECTION_MODE_OPTIONS = ["NACH", "Cash", "Online"];
const MONTH_OPTIONS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_OPTIONS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DATE_OPTIONS = ["1","5","10","15","20","25","30"];

export default function AddRepayment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    repayment_type: "",
    frequency: "",
    limit_in_month: "",
    gap_between_disbursement_and_first_repayment: "",
    number_of_repayments: "",
    sequence_of_repayment_adjustment: "",
    repayment_months: [],
    repayment_days: [],
    repayment_dates: [],
    mode_of_collection: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (v) => {
    const e = {};
    if (!v.repayment_type) e.repayment_type = "Required";
    if (!v.frequency) e.frequency = "Required";
    if (!v.limit_in_month || v.limit_in_month <= 0) e.limit_in_month = "Invalid";
    if (v.gap_between_disbursement_and_first_repayment < 0) e.gap_between_disbursement_and_first_repayment = "Invalid";
    if (!v.number_of_repayments || v.number_of_repayments <= 0) e.number_of_repayments = "Invalid";
    if (!v.sequence_of_repayment_adjustment) e.sequence_of_repayment_adjustment = "Required";
    if (!v.mode_of_collection) e.mode_of_collection = "Required";
    return e;
  };

  const hasErrors = useMemo(() => Object.keys(validate(form)).length > 0, [form]);

  const update = (key, value) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    setErrors(validate(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    try {
      await repaymentsService.createRepayment(form);
      navigate("/repayment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Add Repayment Rule" onBack={() => navigate(-1)} />

      <FormCard>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Repayment Type" value={form.repayment_type} options={TYPE_OPTIONS} error={errors.repayment_type} onChange={v => update("repayment_type", v)} />
          <SelectField label="Frequency" value={form.frequency} options={FREQUENCY_OPTIONS} error={errors.frequency} onChange={v => update("frequency", v)} />
          <InputField label="Limit in Months" type="number" value={form.limit_in_month} error={errors.limit_in_month} onChange={v => update("limit_in_month", Number(v))} />
          <InputField label="Gap before First Repayment (Months)" type="number" value={form.gap_between_disbursement_and_first_repayment} error={errors.gap_between_disbursement_and_first_repayment} onChange={v => update("gap_between_disbursement_and_first_repayment", Number(v))} />
          <InputField label="No. of Repayments" type="number" value={form.number_of_repayments} error={errors.number_of_repayments} onChange={v => update("number_of_repayments", Number(v))} />
          <SelectField label="Repayment Sequence" value={form.sequence_of_repayment_adjustment} options={SEQUENCE_OPTIONS} error={errors.sequence_of_repayment_adjustment} onChange={v => update("sequence_of_repayment_adjustment", v)} />
          <MultiSelectField label="Repayment Months" options={MONTH_OPTIONS} values={form.repayment_months} onChange={v => update("repayment_months", v)} />
          <MultiSelectField label="Repayment Days" options={DAY_OPTIONS} values={form.repayment_days} onChange={v => update("repayment_days", v)} />
          <MultiSelectField label="Repayment Dates" options={DATE_OPTIONS} values={form.repayment_dates} onChange={v => update("repayment_dates", v)} />
          <SelectField label="Collection Mode" value={form.mode_of_collection} options={COLLECTION_MODE_OPTIONS} error={errors.mode_of_collection} onChange={v => update("mode_of_collection", v)} />

          <div className="md:col-span-2">
            <Button type="submit" fullWidth disabled={hasErrors || submitting}>
              {submitting ? "Saving..." : "Add Repayment Rule"}
            </Button>
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
