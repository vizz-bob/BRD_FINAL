import React, { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../../layout/MainLayout";
import {
  SubPageHeader,
  InputField,
  SelectField,
  FormCard,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

import { scoreCardManagementService } from "../../../services/eligibilityManagementService";

/* OPTIONS */
const RISK_IMPACT_OPTIONS = ["Low", "Medium", "High"];
const STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

export default function ScoreCardForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    impact_type: "",
    risk_impact: "",
    professionals: "",
    employees: "",
    groups: "",
    corporates: "",
    others: "",
    is_active: true,
  });

  /* ================= FETCH (EDIT) ================= */
  useEffect(() => {
    if (!isEdit) return;

    const fetchData = async () => {
      const data = await scoreCardManagementService.retrieve(id);
      if (!data) return;

      setForm({
        impact_type: data.impact_type,
        risk_impact: data.risk_impact,
        professionals: data.professionals_config?.score || "",
        employees: data.employees_config?.score || "",
        groups: data.groups_config?.score || "",
        corporates: data.corporates_config?.score || "",
        others: data.others_config?.score || "",
        is_active: data.is_active,
      });
    };

    fetchData();
  }, [id, isEdit]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      impact_type: form.impact_type,
      risk_impact: form.risk_impact,
      professionals_config: { score: Number(form.professionals) },
      employees_config: { score: Number(form.employees) },
      groups_config: { score: Number(form.groups) },
      corporates_config: { score: Number(form.corporates) },
      others_config: { score: Number(form.others) },
      is_active: form.is_active,
    };

    if (isEdit) {
      await scoreCardManagementService.update(id, payload);
    } else {
      await scoreCardManagementService.create(payload);
    }

    navigate("/score-card");
    setLoading(false);
  };

  return (
    <MainLayout>
      <SubPageHeader
        title={`${isEdit ? "Edit" : "Add"} Score Card`}
        subtitle="Configure score card rules"
        onBack={() => navigate(-1)}
      />

      <FormCard className="max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputField
            label="Impact Type"
            name="impact_type"
            value={form.impact_type}
            onChange={handleChange}
          />

          <SelectField
            label="Risk Impact"
            name="risk_impact"
            value={form.risk_impact}
            onChange={handleChange}
            options={RISK_IMPACT_OPTIONS}
          />

          <InputField
            label="Professionals Score"
            name="professionals"
            type="number"
            value={form.professionals}
            onChange={handleChange}
          />

          <InputField
            label="Employees Score"
            name="employees"
            type="number"
            value={form.employees}
            onChange={handleChange}
          />

          <InputField
            label="Groups Score"
            name="groups"
            type="number"
            value={form.groups}
            onChange={handleChange}
          />

          <InputField
            label="Corporates Score"
            name="corporates"
            type="number"
            value={form.corporates}
            onChange={handleChange}
          />

          <InputField
            label="Others Score"
            name="others"
            type="number"
            value={form.others}
            onChange={handleChange}
          />

          <SelectField
            label="Status"
            value={form.is_active}
            onChange={(v) =>
              setForm((p) => ({ ...p, is_active: v }))
            }
            options={STATUS_OPTIONS}
          />

          <div className="md:col-span-2">
            <Button
              type="submit"
              fullWidth
              icon={<FiSave />}
              label={isEdit ? "Update Score Card" : "Save Score Card"}
              disabled={loading}
            />
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
