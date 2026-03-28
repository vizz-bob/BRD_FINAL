import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave } from "react-icons/fi";

import MainLayout from "../../../layout/MainLayout";
import {
  SubPageHeader,
  FormCard,
  InputField,
  SelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

import { eligibilityManagementService } from "../../../services/eligibilityManagementService";

const EligibilityForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    applicant_type: "",
    category: "",
    income_type: "",
    other_income: "",
    margin: "",
    salary: "",
    salary_receipt_mode: "",
    update_turnover: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  /* ================= FETCH FOR EDIT ================= */
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchEligibility = async () => {
      try {
        setLoading(true);
        const data = await eligibilityManagementService.retrieve(id);

        setForm({
          applicant_type: data.applicant_type ?? "",
          category: data.category ?? "",
          income_type: data.income_type ?? "",
          other_income: data.other_income ?? "",
          margin: data.margin ?? "",
          salary: data.salary ?? "",
          salary_receipt_mode: data.salary_receipt_mode ?? "",
          update_turnover: data.update_turnover ?? "",
          is_active: data.is_active ?? true,
        });

        console.log(form)
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibility();
  }, [isEdit, id]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_active") {
      setForm((prev) => ({ ...prev, is_active: value === "true" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /** 🔑 DRF-COMPATIBLE PAYLOAD */
    const payload = {
      applicant_type: form.applicant_type.trim(),
      category: form.category.trim(),
      income_type: form.income_type.trim(),

      other_income: form.other_income === "" ? null : form.other_income,
      margin: form.margin, // STRING ✔
      salary: form.salary === "" ? null : form.salary,

      salary_receipt_mode: form.salary_receipt_mode.trim(),
      update_turnover:
        form.update_turnover === "" ? null : form.update_turnover,

      is_active: form.is_active,
    };

    try {
      setLoading(true);

      if (isEdit && id) {
        await eligibilityManagementService.partialUpdate(id, payload);
      } else {
        await eligibilityManagementService.create(payload);
      }

      navigate("/eligibility");
    } catch (err) {
      console.error(
        "Save error:",
        err.response?.data || err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <SubPageHeader
        title={isEdit ? "Edit Eligibility" : "Add Eligibility"}
        subtitle="Configure eligibility rules"
        onBack={() => navigate(-1)}
      />

      <FormCard className="max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputField label="Applicant Type" name="applicant_type" value={form.applicant_type} onChange={handleChange} required />
          <InputField label="Category" name="category" value={form.category} onChange={handleChange} required />
          <InputField label="Income Type" name="income_type" value={form.income_type} onChange={handleChange} required />

          <InputField label="Other Income" name="other_income" type="number" step="0.01" value={form.other_income} onChange={handleChange} />
          <InputField label="Margin (%)" name="margin" type="number" step="0.01" value={form.margin} onChange={handleChange} required />
          <InputField label="Salary" name="salary" type="number" step="0.01" value={form.salary} onChange={handleChange} />

          <InputField label="Salary Receipt Mode" name="salary_receipt_mode" value={form.salary_receipt_mode} onChange={handleChange} required />
          <InputField label="Update Turnover" name="update_turnover" type="number" step="0.01" value={form.update_turnover} onChange={handleChange} />

          <SelectField
            label="Status"
            name="is_active"
            value={form.is_active ? "true" : "false"}
            onChange={handleChange}
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          />

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" label={isEdit ? "Update" : "Create"} icon={<FiSave />} size="lg" disabled={loading} />
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
};

export default EligibilityForm;
