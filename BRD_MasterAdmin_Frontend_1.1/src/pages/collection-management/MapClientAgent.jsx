import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function MapClientAgent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client_name: "",
    agent_name: "",
    mapping_type: "",
    region: "",
    status: true,
  });

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Client–Agent Mapping:", formData);

    // API later
    // await collectionService.mapClientAgent(formData);

    navigate("/collection-management/client-agent-mapping");
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft />
        </button>

        <h1 className="text-xl font-semibold">
          Map Client with Collection Agent
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm max-w-3xl space-y-6"
      >
        {/* CLIENT */}
        <Select
          label="Client Name"
          name="client_name"
          value={formData.client_name}
          onChange={handleChange}
          options={[
            "ABC Finance",
            "XYZ Lending",
            "PQR Microfinance",
          ]}
          required
        />

        {/* AGENT */}
        <Select
          label="Agent Name"
          name="agent_name"
          value={formData.agent_name}
          onChange={handleChange}
          options={[
            "Rahul Verma",
            "Suresh Kumar",
            "Ankit Sharma",
          ]}
          required
        />

        {/* MAPPING TYPE */}
        <Select
          label="Mapping Type"
          name="mapping_type"
          value={formData.mapping_type}
          onChange={handleChange}
          options={["Primary", "Secondary"]}
          required
        />

        {/* REGION */}
        <Input
          label="Region"
          name="region"
          value={formData.region}
          onChange={handleChange}
          placeholder="e.g. South Delhi, Jaipur Zone"
          required
        />

        {/* STATUS */}
        <Toggle
          label="Status"
          name="status"
          checked={formData.status}
          onChange={handleChange}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-gray-100 rounded-xl text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
          >
            <FiSave /> Save Mapping
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ---------------- REUSABLE UI ---------------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      {...props}
      className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      {...props}
      className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

/* -------- FINTECH TOGGLE -------- */

const Toggle = ({ label, name, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">
      {label}
    </span>

    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />

      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors">
        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
      </div>

      <span className="ml-3 text-xs font-medium text-gray-600">
        {checked ? "Active" : "Inactive"}
      </span>
    </label>
  </div>
);
