import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import MainLayout from "../../../layout/MainLayout";

export default function ManageFees() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    agentCategory: "",
    feeType: "",
    feeValue: "",
    loanProduct: "",
    frequency: "",
  });

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Saving Fee Rule:", formData);
    // API: POST /agent-fees

    navigate(-1);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h2 className="text-xl font-semibold">Manage Agent Fees</h2>
          <p className="text-sm text-gray-500">
            Define commission or service fees for collection and legal agents
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Agent Category"
            name="agentCategory"
            value={formData.agentCategory}
            onChange={handleChange}
            options={["Collection", "Legal"]}
          />

          <Select
            label="Fee Type"
            name="feeType"
            value={formData.feeType}
            onChange={handleChange}
            options={["Fixed", "Percentage"]}
          />

          <Input
            label="Fee Value"
            name="feeValue"
            value={formData.feeValue}
            onChange={handleChange}
            placeholder="Amount or %"
          />

          <Input
            label="Linked Loan Product"
            name="loanProduct"
            value={formData.loanProduct}
            onChange={handleChange}
            placeholder="Loan product name"
          />

          <Select
            label="Frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            options={["Per Case", "Monthly"]}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl text-sm border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl text-sm bg-green-600 text-white hover:bg-green-700 transition"
          >
            Save Fees
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ---------------- REUSABLE UI ---------------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
