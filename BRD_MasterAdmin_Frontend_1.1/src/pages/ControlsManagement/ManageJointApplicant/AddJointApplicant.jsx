import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function AddJointApplicant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    joint_applicant_type: "",
    approval_workflow: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const payload = {
      joint_applicant_type: form.joint_applicant_type,
      approval_workflow: form.approval_workflow,
      status: form.status,
    };

    console.log("Payload to send:", payload);

    const res = await controlsManagementService.joint_applicants.create(
      payload
    );

    setLoading(false);

      navigate("/controls/joint-applicant"); // success
    
  };

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
          <h1 className="text-2xl font-bold">Add Joint Applicant</h1>
          <p className="text-gray-500 text-sm">
            Configure joint applicant behavior
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Select
          label="Joint Applicant Type"
          name="joint_applicant_type"
          value={form.joint_applicant_type}
          onChange={handleChange}
          options={["Co-Borrower", "Partner"]}
          error={errors.joint_applicant_type}
        />

        <Select
          label="Approval Workflow"
          name="approval_workflow"
          value={form.approval_workflow}
          onChange={handleChange}
          options={["Single Approval", "Dual Approval"]}
          error={errors.approval_workflow}
        />

        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={["ACTIVE", "INACTIVE"]}
        />

        <div className="md:col-span-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-xl border"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2"
          >
            <FiSave /> {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

const Select = ({ label, options, error, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className={`mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 ${
        error ? "border-red-500" : ""
      }`}
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
