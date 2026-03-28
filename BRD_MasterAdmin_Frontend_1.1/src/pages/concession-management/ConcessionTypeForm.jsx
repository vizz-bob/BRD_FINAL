import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import concessionManagementService from "../../services/concessionManagementService";

import {
  SubPageHeader,
  InputField,
  SelectField,
  TextAreaField,
  Button,
} from "../../components/Controls/SharedUIHelpers";

const APPLICABLE_ON = [
  { label: "Sanction", value: "Sanction" },
  { label: "Disbursement", value: "Disbursement" },
  { label: "Repayment", value: "Repayment" },
];

const STATUS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export default function ConcessionTypeForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    concession_type_name: "",
    applicable_on: "",
    description: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  /* ---------- LOAD (EDIT MODE) ---------- */
  useEffect(() => {
    if (!id) return;

    const fetchConcessionType = async () => {
      setFetching(true);
      try {
        const res = await concessionManagementService.getType(id);
        setForm({
          concession_type_name: res.concession_type_name || "",
          applicable_on: res.applicable_on || "",
          description: res.description || "",
          status: res.status || "Active",
        });
      } catch {
        setError("Failed to load concession type.");
      } finally {
        setFetching(false);
      }
    };

    fetchConcessionType();
  }, [id]);

  /* ---------- CHANGE HANDLER ---------- */
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      id
        ? await concessionManagementService.updateType(id, form)
        : await concessionManagementService.createType(form);

      navigate("/concession-management");
    } catch {
      setError("Failed to save concession type. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <SubPageHeader
        title={id ? "Edit Concession Type" : "Add Concession Type"}
        subtitle="Define where and how concessions apply"
        onBack={() => navigate(-1)}
      />

      {fetching ? (
        <p className="text-gray-500">Loading data...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputField
            label="Concession Type Name"
            value={form.concession_type_name}
            onChange={(e) =>
              handleChange("concession_type_name", e.target.value)
            }
            placeholder="e.g. Interest Rate"
          />

          <SelectField
            label="Applicable On"
            value={form.applicable_on}
            onChange={(e) => handleChange("applicable_on", e.target.value)}
            options={APPLICABLE_ON}
            placeholder="Select stage"
          />

          <SelectField
            label="Status"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={STATUS}
          />

          <TextAreaField
            label="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            maxLength={300}
            helperText="Brief description of concession type"
            className="md:col-span-2"
          />

          {error && (
            <div className="md:col-span-2 text-sm text-red-600">{error}</div>
          )}

          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              label={loading ? "Saving..." : "Save Type"}
              icon={<FiSave />}
              disabled={loading}
              variant="primary"
            />
          </div>
        </form>
      )}
    </MainLayout>
  );
}
