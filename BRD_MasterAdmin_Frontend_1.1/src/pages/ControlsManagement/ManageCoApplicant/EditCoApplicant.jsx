import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

const CO_APPLICANT_TYPES = ["Primary", "Secondary", "Guarantor"];
const RELATIONSHIPS = ["Spouse", "Parent", "Sibling", "Business Partner"];

export default function EditCoApplicant() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    co_applicant_type: "",
    relationship: "",
    is_active: true,
  });

  useEffect(() => {
    const fetchItem = async () => {
      const data = await controlsManagementService.co_applicants.retrieve(id);
      if (data) {
        setForm({
          co_applicant_type: data.co_applicant_type,
          relationship: data.relationship,
          is_active: data.is_active,
        });
      }
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const res = await controlsManagementService.co_applicants.update(id, form);

    setSaving(false);
    if (res) navigate("/controls/co-applicant");
  };

  if (loading) return <MainLayout><p className="text-center">Loading...</p></MainLayout>;

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Edit Co-Applicant</h1>
          <p className="text-gray-500 text-sm">
            Update co-applicant configuration
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Select
          label="Co-Applicant Type"
          name="co_applicant_type"
          value={form.co_applicant_type}
          onChange={handleChange}
          options={CO_APPLICANT_TYPES}
        />

        <Select
          label="Relationship"
          name="relationship"
          value={form.relationship}
          onChange={handleChange}
          options={RELATIONSHIPS}
        />

        <Select
          label="Status"
          name="is_active"
          value={form.is_active}
          onChange={handleChange}
          options={[
            { label: "Active", value: true },
            { label: "Inactive", value: false },
          ]}
        />

        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSave /> Update
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ---------- UI ---------- */

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300"
    >
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>{o}</option>
        ) : (
          <option key={o.label} value={o.value}>{o.label}</option>
        )
      )}
    </select>
  </div>
);
