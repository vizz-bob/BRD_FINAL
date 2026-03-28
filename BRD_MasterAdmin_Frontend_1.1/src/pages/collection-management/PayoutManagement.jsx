import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function PayoutManagement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    payout_type: "",
    agent_name: "",
    commission_rate: "",
    fixed_amount: "",
    payout_cycle: "",
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

    const payload = {
      payout_type: formData.payout_type,
      agent_name: formData.agent_name,
      payout_cycle: formData.payout_cycle,
      status: formData.status,
      commission_rate:
        formData.payout_type === "Commission"
          ? formData.commission_rate
          : null,
      fixed_amount:
        formData.payout_type === "Fixed"
          ? formData.fixed_amount
          : null,
    };

    console.log("Payout Scheme:", payload);

    // API later
    // await payoutService.create(payload);

    navigate("/collection-management/payouts");
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
          Payout Management
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm max-w-3xl space-y-6"
      >
        {/* PAYOUT TYPE */}
        <Select
          label="Payout Type"
          name="payout_type"
          value={formData.payout_type}
          onChange={handleChange}
          options={["Commission", "Fixed"]}
          required
        />

        {/* AGENT / PARTNER */}
        <Select
          label="Agent / Partner Name"
          name="agent_name"
          value={formData.agent_name}
          onChange={handleChange}
          options={[
            "Rahul Verma",
            "Suresh Kumar",
            "XYZ Collection Partner",
          ]}
          required
        />

        {/* COMMISSION RATE */}
        {formData.payout_type === "Commission" && (
          <Input
            label="Commission Rate (%)"
            name="commission_rate"
            type="number"
            value={formData.commission_rate}
            onChange={handleChange}
            placeholder="e.g. 5"
            required
          />
        )}

        {/* FIXED AMOUNT */}
        {formData.payout_type === "Fixed" && (
          <Input
            label="Fixed Amount (₹)"
            name="fixed_amount"
            type="number"
            value={formData.fixed_amount}
            onChange={handleChange}
            placeholder="e.g. 1000"
            required
          />
        )}

        {/* PAYOUT CYCLE */}
        <Select
          label="Payout Cycle"
          name="payout_cycle"
          value={formData.payout_cycle}
          onChange={handleChange}
          options={["Weekly", "Monthly"]}
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
            <FiSave /> Save Payout
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
        {checked ? "Enabled" : "Disabled"}
      </span>
    </label>
  </div>
);
