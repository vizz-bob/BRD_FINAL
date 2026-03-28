import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import {
  PageHeader,
  FormCard,
  InputField,
  SelectField,
  MultiSelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";
import { repaymentsService } from "../../../services/productManagementService";

const FREQUENCY_OPTIONS = ["Weekly", "Monthly", "Quarterly"];
const SEQUENCE_OPTIONS = ["Ascending", "Descending"];
const COLLECTION_MODE_OPTIONS = ["Cash", "Bank Transfer", "UPI"];

const MONTHS_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS_OPTIONS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

const EditRepayment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: "",
    frequency: "",
    limit_in_month: "",
    gap_first_repayment: "",
    no_of_repayments: "",
    sequence: "",
    repayment_months: [],
    repayment_days: [],
    repayment_dates: [],
    collection_mode: "",
  });

  // Fetch repayment details
  useEffect(() => {
    const fetchRepayment = async () => {
      setLoading(true);
      try {
        const data = await repaymentsService.getRepayment(id);
        setForm({
          type: data.repayment_type || "",
          frequency: data.frequency || "",
          limit_in_month: data.limit_in_month || "",
          gap_first_repayment: data.gap_between_disbursement_and_first_repayment || "",
          no_of_repayments: data.number_of_repayments || "",
          sequence: data.sequence_of_repayment_adjustment || "",
          repayment_months: data.repayment_months || [],
          repayment_days: data.repayment_days || [],
          repayment_dates: data.repayment_dates || [],
          collection_mode: data.mode_of_collection || "",
        });
      } catch (err) {
        console.error("Failed to fetch repayment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepayment();
  }, [id]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await repaymentsService.updateRepayment(id, {
        repayment_type: form.type,
        frequency: form.frequency,
        limit_in_month: Number(form.limit_in_month),
        gap_between_disbursement_and_first_repayment: Number(form.gap_first_repayment),
        number_of_repayments: Number(form.no_of_repayments),
        sequence_of_repayment_adjustment: form.sequence,
        repayment_months: form.repayment_months,
        repayment_days: form.repayment_days,
        repayment_dates: form.repayment_dates,
        mode_of_collection: form.collection_mode,
      });
      navigate("/repayments");
    } catch (err) {
      console.error("Failed to update repayment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Edit Repayment Configuration"
        subtitle="Modify the repayment settings"
        backButton={{
          label: "Back",
          icon: <FiArrowLeft />,
          onClick: () => navigate("/repayments"),
        }}
      />
      <FormCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Repayment Type"
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
          />
          <SelectField
            label="Frequency"
            options={FREQUENCY_OPTIONS}
            value={form.frequency}
            onChange={(val) => handleChange("frequency", val)}
          />
          <InputField
            label="Limit in Month"
            type="number"
            value={form.limit_in_month}
            onChange={(e) => handleChange("limit_in_month", e.target.value)}
          />
          <InputField
            label="Gap Between Disbursement & First Repayment"
            type="number"
            value={form.gap_first_repayment}
            onChange={(e) => handleChange("gap_first_repayment", e.target.value)}
          />
          <InputField
            label="Number of Repayments"
            type="number"
            value={form.no_of_repayments}
            onChange={(e) => handleChange("no_of_repayments", e.target.value)}
          />
          <SelectField
            label="Sequence of Repayment Adjustment"
            options={SEQUENCE_OPTIONS}
            value={form.sequence}
            onChange={(val) => handleChange("sequence", val)}
          />
          <MultiSelectField
            label="Repayment Months"
            options={MONTHS_OPTIONS}
            value={form.repayment_months}
            onChange={(val) => handleChange("repayment_months", val)}
          />
          <MultiSelectField
            label="Repayment Days"
            options={DAYS_OPTIONS}
            value={form.repayment_days}
            onChange={(val) => handleChange("repayment_days", val)}
          />
          <MultiSelectField
            label="Repayment Dates"
            options={DAYS_OPTIONS}
            value={form.repayment_dates}
            onChange={(val) => handleChange("repayment_dates", val)}
          />
          <SelectField
            label="Mode of Collection"
            options={COLLECTION_MODE_OPTIONS}
            value={form.collection_mode}
            onChange={(val) => handleChange("collection_mode", val)}
          />
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            label="Save Changes"
            icon={<FiSave />}
            onClick={handleSubmit}
            fullWidth
            size="md"
            disabled={loading}
          />
          <Button
            label="Cancel"
            onClick={() => navigate("/repayments")}
            variant="secondary"
            fullWidth
            size="md"
          />
        </div>
      </FormCard>
    </MainLayout>
  );
};

export default EditRepayment;
