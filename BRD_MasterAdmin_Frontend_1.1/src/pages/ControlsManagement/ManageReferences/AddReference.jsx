import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiSave } from "react-icons/fi";

import {
  SubPageHeader,
  InputField,
  SelectField,
  Button,
  FormCard,
} from "../../../components/Controls/SharedUIHelpers";

import { controlsManagementService } from "../../../services/controlsManagementService";

export default function AddReference() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reference_type: "",
    reference_role: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(form)

    const res = await controlsManagementService.references.create(form);

    if (res) {
      navigate("/controls/references");
    }

    setLoading(false);
  };

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <SubPageHeader
        title="Add Reference"
        subtitle="Define reference type and role"
        onBack={() => navigate(-1)}
      />

      {/* ================= FORM ================= */}
      <FormCard className="max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <SelectField
            label="Reference Type"
            name="reference_type"
            value={form.reference_type}
            onChange={handleChange}
            required
            options={[
              { label: "Personal", value: "Personal" },
              { label: "Professional", value: "Professional" },
              { label: "Emergency", value: "Emergency" },
            ]}
          />

          <InputField
            label="Reference Role"
            name="reference_role"
            value={form.reference_role}
            onChange={handleChange}
            placeholder="Guarantor, Employer, Emergency Contact"
          />

          <SelectField
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
          />

          {/* ================= ACTIONS ================= */}
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="outline"
              onClick={() => navigate(-1)}
            />
            <Button
              type="submit"
              label={loading ? "Saving..." : "Save"}
              icon={<FiSave />}
              disabled={loading}
            />
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
