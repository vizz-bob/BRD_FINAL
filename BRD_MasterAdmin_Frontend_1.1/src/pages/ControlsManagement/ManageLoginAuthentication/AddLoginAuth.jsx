import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

const AUTH_TYPES = ["OTP", "PASSWORD", "BIOMETRIC"];

export default function AddLoginAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    authentication_type: "",
    device_restriction: false,
    multi_factor_enabled: false,
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await controlsManagementService.login_auth.create(form);

    setLoading(false);
    navigate("/controls/login-auth");
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Add Login Authentication</h1>
          <p className="text-gray-500 text-sm">
            Configure authentication policy
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Select
          label="Authentication Type"
          name="authentication_type"
          value={form.authentication_type}
          onChange={handleChange}
          options={AUTH_TYPES}
          required
        />

        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={["ACTIVE", "INACTIVE"]}
        />

        <Toggle
          label="Device Restriction"
          name="device_restriction"
          checked={form.device_restriction}
          onChange={handleChange}
        />

        <Toggle
          label="Multi-Factor Authentication"
          name="multi_factor_enabled"
          checked={form.multi_factor_enabled}
          onChange={handleChange}
        />

        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => navigate("/controls/login-auth")}
            className="px-5 py-3 rounded-xl border text-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2 disabled:opacity-60"
          >
            <FiSave /> {loading ? "Saving..." : "Save Policy"}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ---------- REUSABLE ---------- */

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
      required
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

const Toggle = ({ label, ...props }) => (
  <label className="flex items-center justify-between bg-gray-50 border rounded-xl p-4 cursor-pointer">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <input type="checkbox" {...props} className="w-5 h-5 accent-blue-600" />
  </label>
);
