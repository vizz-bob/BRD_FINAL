import React, { useEffect, useState } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { escalationMasterService } from "../../../services/approvalMasterService";
import axiosInstance from "../../../utils/axiosInstance";

/* ================= FIELD COMPONENTS ================= */

const FormLabel = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

const StyledSelect = ({ label, value, options, placeholder, onChange, error }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800
        bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        hover:border-gray-400 transition-all duration-150
        ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
    >
      <option value="" disabled>{placeholder || "Select..."}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const StyledInput = ({ label, type = "text", value, onChange, placeholder, error }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || ""}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800
        placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
        focus:border-transparent hover:border-gray-400 transition-all duration-150
        ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

/* ================= MAIN COMPONENT ================= */

export function EscalationPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [loadingEscalations, setLoadingEscalations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    escalation_level: "",
    escalation_time: "",
    escalation_manager: "",
    escalation_to: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    fetchUsers();
    fetchEscalations();
  }, []);

  const fetchEscalations = async () => {
    setLoadingEscalations(true);
    try {
      const data = await escalationMasterService.getEscalations();
      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];
      setEscalations(rows);
    } catch (err) {
      console.error("Failed to fetch escalations:", err);
    } finally {
      setLoadingEscalations(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Escalation model expects users.User PK values, so load from users/users endpoint.
      const res = await axiosInstance.get("users/users/");
      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.results)
          ? res.data.results
          : [];

      const options = data.map((u) => ({
        label: u.full_name || u.email || "Unknown User",
        value: u.id,
      }));
      setUsers(options);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.escalation_level) errors.escalation_level = "Escalation level is required";
    if (!form.escalation_time) errors.escalation_time = "Escalation time is required";
    if (!form.escalation_manager) errors.escalation_manager = "Escalation manager is required";
    if (!form.escalation_to) errors.escalation_to = "Escalation to is required";
    if (!form.status) errors.status = "Status is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const payload = {
        escalation_level: Number(form.escalation_level),
        escalation_time: form.escalation_time,
        escalation_manager: form.escalation_manager,
        escalation_to: form.escalation_to,
        status: form.status.toUpperCase(),
      };
      await escalationMasterService.createEscalation(payload);
      setSuccess("Escalation rule saved successfully.");
      setForm({
        escalation_level: "",
        escalation_time: "",
        escalation_manager: "",
        escalation_to: "",
        status: "ACTIVE",
      });
      await fetchEscalations();
    } catch (err) {
      console.error("Escalation create error:", err);
      const apiError = err?.response?.data;
      if (typeof apiError?.message === "string") {
        setError(apiError.message);
      } else if (apiError && typeof apiError === "object") {
        const firstKey = Object.keys(apiError)[0];
        const firstValue = firstKey ? apiError[firstKey] : null;
        const text = Array.isArray(firstValue) ? firstValue[0] : firstValue;
        setError(typeof text === "string" ? text : "Failed to save. Please try again.");
      } else {
        setError("Failed to save. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* ===== PAGE HEADER ===== */}
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center gap-4 mb-6 shadow-sm max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Escalation Master</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage delayed approval escalation rules</p>
        </div>
      </div>

      {/* ===== FORM CARD ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl space-y-8">

        <Section title="Escalation Details">
          <StyledSelect
            label="Escalation Level *"
            value={form.escalation_level}
            options={[
              { label: "Level 1", value: "1" },
              { label: "Level 2", value: "2" },
              { label: "Level 3", value: "3" },
              { label: "Level 4", value: "4" },
            ]}
            placeholder="Select level"
            onChange={(e) => handleChange("escalation_level", e.target.value)}
            error={fieldErrors.escalation_level}
          />

          <StyledInput
            label="Escalation Time *"
            type="datetime-local"
            value={form.escalation_time}
            onChange={(e) => handleChange("escalation_time", e.target.value)}
            error={fieldErrors.escalation_time}
          />

          <StyledSelect
            label="Escalation Manager *"
            value={form.escalation_manager}
            options={users}
            placeholder="Select manager"
            onChange={(e) => handleChange("escalation_manager", e.target.value)}
            error={fieldErrors.escalation_manager}
          />

          <StyledSelect
            label="Escalation To *"
            value={form.escalation_to}
            options={users}
            placeholder="Select user"
            onChange={(e) => handleChange("escalation_to", e.target.value)}
            error={fieldErrors.escalation_to}
          />

          <StyledSelect
            label="Status *"
            value={form.status}
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
            onChange={(e) => handleChange("status", e.target.value)}
            error={fieldErrors.status}
          />
        </Section>

        {/* ERROR BANNER */}
        {error && (
          <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            {success}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium
              text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-600
              hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
              text-white text-sm font-semibold shadow-sm transition-all"
          >
            <FiSave size={15} />
            {saving ? "Saving..." : "Save Escalation Rule"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl mt-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Saved Escalation Rules</h3>
        {loadingEscalations ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : escalations.length === 0 ? (
          <p className="text-sm text-gray-500">No escalation rules found.</p>
        ) : (
          <div className="space-y-2">
            {escalations.map((row) => (
              <div
                key={row.id}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 flex items-center justify-between"
              >
                <span>
                  Level {row.escalation_level} | {row.status}
                </span>
                <span className="text-gray-500">{row.escalation_time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EscalationPage;