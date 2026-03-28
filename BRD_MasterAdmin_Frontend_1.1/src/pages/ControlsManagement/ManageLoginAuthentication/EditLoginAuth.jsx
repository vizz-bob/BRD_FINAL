import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

const AUTH_TYPES = ["OTP", "PASSWORD", "BIOMETRIC"];

export default function EditLoginAuth() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    authentication_type: "",
    device_restriction: false,
    multi_factor_enabled: false,
    status: "ACTIVE",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchPolicy = async () => {
      const data =
        await controlsManagementService.login_auth.retrieve(id);

      if (data) {
        setForm({
          authentication_type: data.authentication_type,
          device_restriction: data.device_restriction,
          multi_factor_enabled: data.multi_factor_enabled,
          status: data.status,
        });
      }
      setLoading(false);
    };

    fetchPolicy();
  }, [id]);

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

    await controlsManagementService.login_auth.update(id, form);

    setLoading(false);
    navigate("/controls/login-auth");
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
          <h1 className="text-2xl font-bold">Edit Login Authentication</h1>
          <p className="text-gray-500 text-sm">
            Update authentication policy
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">
          Loading policy...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Select
            label="Authentication Type"
            name="auth_type"
            value={form.authentication_type}
            onChange={handleChange}
            options={AUTH_TYPES}
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
            name="mfa_enabled"
            checked={form.multi_factor_enabled}
            onChange={handleChange}
          />

          <div className="md:col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700"
            >
              <FiSave /> Update Policy
            </button>
          </div>
        </form>
      )}
    </MainLayout>
  );
}

/* ---------- REUSABLE ---------- */

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300"
    >
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
