import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave } from "react-icons/fi";

import {
  SubPageHeader,
  InputField,
  SelectField,
  Button,
  FormCard,
} from "../../../components/Controls/SharedUIHelpers";

import { controlsManagementService } from "../../../services/controlsManagementService";

export default function EditReference() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    reference_type: "",
    reference_role: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchReference = async () => {
      const data = await controlsManagementService.references.retrieve(id);
      if (data) {
        setForm({
          reference_type: data.reference_type || "",
          reference_role: data.reference_role || "",
          status: data.status || "Active",
        });
      }
    };

    fetchReference();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await controlsManagementService.references.update(id, form);

    if (res) {
      navigate("/controls/references");
    }

    setLoading(false);
  };

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <SubPageHeader
        title="Edit Reference"
        subtitle="Update reference configuration"
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
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
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
              label={loading ? "Updating..." : "Update"}
              icon={<FiSave />}
              disabled={loading}
            />
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
