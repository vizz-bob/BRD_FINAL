import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiSave } from "react-icons/fi";

import {
  SubPageHeader,
  SelectField,
  CheckboxGroup,
  Button,
  FormCard,
} from "../../../components/Controls/SharedUIHelpers";

import { controlsManagementService } from "../../../services/controlsManagementService";

export default function UpdateApplication() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    action_type: "",
    processing_mode: "",
    application_mode: "",
    re_application_allowed: false,
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      const data =
        await controlsManagementService.application_process.list();

      if (data?.length) {
        const record = data[0]; // usually single config row
        setForm({
          action_type: record.action_type || "",
          processing_mode: record.processing_mode || "",
          application_mode: record.application_mode || "",
          re_application_allowed: record.re_application_allowed || false,
          status: record.status || "ACTIVE",
        });
      }
    };

    fetchData();
  }, []);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data =
      await controlsManagementService.application_process.list();

    if (data?.length) {
      await controlsManagementService.application_process.update(
        data[0].id,
        form
      );
    }

    setLoading(false);
    navigate(-1);
  };

  return (
    <MainLayout>
      <SubPageHeader
        title="Update Application"
        subtitle="Configure application processing behavior"
        onBack={() => navigate(-1)}
      />

      <FormCard className="max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >
          <SelectField
            label="Action Type"
            name="action_type"
            value={form.action_type}
            onChange={handleChange}
            options={[
              "Submit",
              "Approve",
              "Reject",
              "Review",
            ]}
          />

          <SelectField
            label="Processing Mode"
            name="processing_mode"
            value={form.processing_mode}
            onChange={handleChange}
            options={[
              "Manual",
              "Auto",
              "Hybrid",
            ]}
          />

          <SelectField
            label="Application Mode"
            name="application_mode"
            value={form.application_mode}
            onChange={handleChange}
            options={[
              "Online",
              "Offline",
            ]}
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

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Re-Application Allowed
            </label>
            <input
              type="checkbox"
              checked={form.re_application_allowed}
              onChange={(e) =>
                setForm({
                  ...form,
                  re_application_allowed: e.target.checked,
                })
              }
              className="ml-3 scale-125"
            />
          </div>

          {/* ACTIONS */}
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button
              variant="outline"
              label="Cancel"
              onClick={() => navigate(-1)}
            />
            <Button
              type="submit"
              icon={<FiSave />}
              label={loading ? "Saving..." : "Save"}
              disabled={loading}
            />
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
