import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";

import { approvalAssignmentService } from "../../../services/approvalMasterService";
import { organizationService } from "../../../services/organizationService";
import { userService } from "../../../services/userService";
import axiosInstance from "../../../utils/axiosInstance";

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

const StyledInput = ({ label, value, onChange, placeholder, error }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <input
      type="text"
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

const StyledMultiSelect = ({ label, values, options, onChange, error }) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <select
      multiple
      value={values}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
        onChange(selected);
      }}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800
        bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        hover:border-gray-400 transition-all duration-150 min-h-[120px]
        ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <p className="mt-1 text-xs text-gray-400">Hold Ctrl / Cmd to select multiple</p>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

export function ManageApprovalPage({ isEdit = false, editId = null }) {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    tenant_id: "",
    approver_type: "",
    user_id: "",
    group_users: [],
    status: "Active",
  });

  useEffect(() => {
    fetchTenants();
    fetchUsers();
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const data = await approvalAssignmentService.getAssignments();
      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];
      setAssignments(rows);
    } catch (err) {
      console.error("Fetch assignments error:", err);
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const orgData = await organizationService.getOrganizations();
      let rows = Array.isArray(orgData)
        ? orgData
        : Array.isArray(orgData?.results)
          ? orgData.results
          : [];

      if (rows.length === 0) {
        const tenantRes = await axiosInstance.get("tenant/");
        const tenantData = tenantRes?.data;
        rows = Array.isArray(tenantData)
          ? tenantData
          : Array.isArray(tenantData?.results)
            ? tenantData.results
            : [];
      }

      const tenantOptions = rows
        .filter((t) => t?.id || t?.tenant_id)
        .map((t) => ({
          label: t.business_name || t.name || t.organization_name || t.code || t.id || t.tenant_id,
          value: String(t.id || t.tenant_id),
        }));

      setTenants(tenantOptions);

      if (tenantOptions.length === 0) {
        setError("No tenant list found from backend. Enter Tenant ID manually below.");
      }
    } catch (err) {
      console.error("Fetch tenants error:", err);
      setTenants([]);
      setError("Unable to load tenant list. Enter Tenant ID manually below.");
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setAllUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setAllUsers([]);
    }
  };

  const users = useMemo(() => {
    if (!Array.isArray(allUsers)) return [];
    return allUsers.map((u) => ({ label: u.email, value: u.id }));
  }, [allUsers]);

  const handleChange = (name, value) => {
    if (name === "tenant_id") {
      setForm({ tenant_id: value, approver_type: "", user_id: "", group_users: [], status: "Active" });
    } else if (name === "approver_type") {
      setForm((prev) => ({ ...prev, approver_type: value, user_id: "", group_users: [] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.tenant_id) errors.tenant_id = "Tenant is required";
    if (!form.approver_type) errors.approver_type = "Approver type is required";
    if (form.approver_type === "Individual" && !form.user_id) errors.user_id = "User is required";
    if (form.approver_type === "Group" && form.group_users.length === 0) errors.group_users = "Select at least one member";
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
        tenant_id: String(form.tenant_id).trim(),
        approver_type: form.approver_type.toUpperCase(),
        user_id: form.approver_type === "Individual" ? String(form.user_id).trim() : null,
        group_users: form.approver_type === "Group" ? form.group_users : null,
        status: form.status.toUpperCase(),
      };

      if (isEdit && editId) {
        await approvalAssignmentService.updateAssignment(editId, payload);
      } else {
        await approvalAssignmentService.createAssignment(payload);
      }

      setSuccess(isEdit ? "Assignment updated successfully." : "Assignment saved successfully.");
      setForm({
        tenant_id: "",
        approver_type: "",
        user_id: "",
        group_users: [],
        status: "Active",
      });
      await fetchAssignments();
    } catch (err) {
      console.error("Manage Approval Error:", err);
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
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-5 flex items-center gap-4 mb-6 shadow-sm max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Approval Assignment" : "Manage Approval"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Tenant → Approver Type → User / Group</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl space-y-8">
        <Section title="Assignment Details">
          {tenants.length > 0 ? (
            <StyledSelect
              label="Tenant / Organization *"
              value={form.tenant_id}
              options={tenants}
              placeholder="Select Tenant"
              onChange={(e) => handleChange("tenant_id", e.target.value)}
              error={fieldErrors.tenant_id}
            />
          ) : (
            <StyledInput
              label="Tenant / Organization ID *"
              value={form.tenant_id}
              onChange={(e) => handleChange("tenant_id", e.target.value)}
              placeholder="Enter Tenant ID manually"
              error={fieldErrors.tenant_id}
            />
          )}

          <StyledSelect
            label="Approver Type *"
            value={form.approver_type}
            options={[
              { label: "Individual", value: "Individual" },
              { label: "Group", value: "Group" },
            ]}
            placeholder="Select type"
            onChange={(e) => handleChange("approver_type", e.target.value)}
            error={fieldErrors.approver_type}
          />

          {form.approver_type === "Individual" && (
            <StyledSelect
              label="Select User *"
              value={form.user_id}
              options={users}
              placeholder="Select user"
              onChange={(e) => handleChange("user_id", e.target.value)}
              error={fieldErrors.user_id}
            />
          )}

          {form.approver_type === "Group" && (
            <div className="md:col-span-2">
              <StyledMultiSelect
                label="Select Group Members *"
                values={form.group_users}
                options={users}
                onChange={(vals) => handleChange("group_users", vals)}
                error={fieldErrors.group_users}
              />
            </div>
          )}

          <StyledSelect
            label="Status *"
            value={form.status}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
            onChange={(e) => handleChange("status", e.target.value)}
            error={fieldErrors.status}
          />
        </Section>

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

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm transition-all"
          >
            <FiSave size={15} />
            {saving ? "Saving..." : isEdit ? "Update Assignment" : "Save Assignment"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl mt-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Saved Assignments</h3>
        {loadingAssignments ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-gray-500">No assignments found.</p>
        ) : (
          <div className="space-y-2">
            {assignments.map((row) => (
              <div
                key={row.id}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 flex items-center justify-between"
              >
                <span>{row.tenant_id} | {row.approver_type} | {row.status}</span>
                <span className="text-gray-500">{row.user_id || "GROUP"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageApprovalPage;