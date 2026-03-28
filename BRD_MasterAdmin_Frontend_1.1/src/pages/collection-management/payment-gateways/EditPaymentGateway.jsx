import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPaymentGateway() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    api_key: "",
    api_secret: "",
    mode: "Test",
    transaction_fee: "",
    status: true,
  });

  /* ---------------- LOAD GATEWAY (API LATER) ---------------- */
  useEffect(() => {
    // MOCK FETCH (replace with API)
    const mockGateway = {
      id,
      name: "Razorpay",
      api_key: "rzp_live_xxxxx",
      api_secret: "********",
      mode: "Live",
      transaction_fee: 2.5,
      status: true,
    };

    setFormData({
      name: mockGateway.name,
      api_key: mockGateway.api_key,
      api_secret: mockGateway.api_secret,
      mode: mockGateway.mode,
      transaction_fee: mockGateway.transaction_fee,
      status: mockGateway.status,
    });

    setLoading(false);
  }, [id]);

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

    console.log("Update Gateway:", { id, ...formData });

    // API call later
    // await gatewayService.update(id, formData);

    navigate("/collection-management/payment-gateways");
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading payment gateway details...
        </p>
      </MainLayout>
    );
  }

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
          Edit Payment Gateway
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Gateway Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="API Key"
            name="api_key"
            value={formData.api_key}
            onChange={handleChange}
            required
          />

          <Input
            label="API Secret"
            name="api_secret"
            type="password"
            value={formData.api_secret}
            onChange={handleChange}
            required
          />

          <Select
            label="Mode"
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            options={["Test", "Live"]}
          />

          <Input
            label="Transaction Fee (%)"
            name="transaction_fee"
            type="number"
            value={formData.transaction_fee}
            onChange={handleChange}
            required
          />

          {/* STATUS TOGGLE */}
          <Toggle
            label="Status"
            name="status"
            checked={formData.status}
            onChange={handleChange}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
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
            <FiSave /> Update Gateway
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
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

/* -------- FINTECH-STYLE TOGGLE -------- */

const Toggle = ({ label, name, checked, onChange }) => (
  <div className="flex items-center justify-between mt-4">
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
