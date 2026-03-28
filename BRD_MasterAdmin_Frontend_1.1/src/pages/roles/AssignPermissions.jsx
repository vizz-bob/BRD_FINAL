// src/pages/roles/AssignPermissions.jsx

import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiCheckCircle, FiShield, FiHelpCircle, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import roleService from "../../services/roleService";

// ---- MASTER PERMISSION LIST ----
const PERMISSIONS = [
  { key: "loan_create", label: "Loan Create", desc: "Create new loan applications" },
  { key: "loan_approve", label: "Loan Approve", desc: "Approve / reject loan applications" },
  { key: "loan_edit", label: "Loan Edit", desc: "Edit loan details before disbursement" },
  { key: "view_docs", label: "View Docs", desc: "View uploaded customer documents" },
  { key: "download_docs", label: "Download Docs", desc: "Download KYC / agreement files" },
  { key: "edit_policies", label: "Edit Policies", desc: "Modify loan policies & rules" },
  { key: "audit_logs", label: "Audit Logs", desc: "View detailed audit trail logs" },
];

// ---- GROUPS FOR UI -----
const PERMISSION_GROUPS = [
  {
    title: "Application Management",
    subtitle: "Creating and editing loan files",
    keys: ["loan_create", "loan_edit"],
  },
  {
    title: "Approval & Disbursement",
    subtitle: "Approvals, risk & policies",
    keys: ["loan_approve", "edit_policies"],
  },
  {
    title: "Documents & Compliance",
    subtitle: "Document access & audit trails",
    keys: ["view_docs", "download_docs", "audit_logs"],
  },
];

const PERM_MAP = PERMISSIONS.reduce((a, p) => ({ ...a, [p.key]: p }), {});

// Helpers
const makeEmptyPerms = () =>
  PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: false }), {});
const makeFullAccess = () =>
  PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: true }), {});
const makeViewOnly = () => ({
  loan_create: false,
  loan_approve: false,
  loan_edit: false,
  view_docs: true,
  download_docs: true,
  edit_policies: false,
  audit_logs: true,
});
const makeApprover = () => ({
  loan_create: false,
  loan_approve: true,
  loan_edit: true,
  view_docs: true,
  download_docs: false,
  edit_policies: true,
  audit_logs: true,
});

const AssignPermissions = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [selectedRole, setSelectedRole] = useState("");
  const [perms, setPerms] = useState(makeEmptyPerms());
  const [saving, setSaving] = useState(false);
  const [loadingPerms, setLoadingPerms] = useState(false);

  // Load roles on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await roleService.getRoles();
        setRoles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    })();
  }, []);

  // On role change → load its saved permissions
  const handleRoleChange = async (e) => {
    const id = e.target.value;
    setSelectedRole(id);

    if (!id) {
      setPerms(makeEmptyPerms());
      return;
    }

    setLoadingPerms(true);
    try {
      const allPerms = await roleService.getPermissions(); // fetch all permissions
      // Build a boolean map of permissions assigned to this role
      const rolePerms = allPerms.reduce((acc, perm) => {
        acc[perm.key] = perm.roles?.includes(Number(id)) || false;
        return acc;
      }, {});
      setPerms({ ...makeEmptyPerms(), ...rolePerms });
    } catch (error) {
      console.error("Failed to load role permissions:", error);
    } finally {
      setLoadingPerms(false);
    }
  };

  const togglePerm = (key) => {
    setPerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyPreset = (type) => {
    if (type === "full") return setPerms(makeFullAccess());
    if (type === "view") return setPerms(makeViewOnly());
    if (type === "approver") return setPerms(makeApprover());
    if (type === "clear") return setPerms(makeEmptyPerms());
  };

  const handleSave = async () => {
    if (!selectedRole) return alert("Please select a role!");

    setSaving(true);
    try {
      const activePerms = Object.keys(perms).filter((k) => perms[k]);
      await roleService.assignPermissionsToRole({
        role: Number(selectedRole),
        permissions: activePerms,
      });
      alert("Permissions saved successfully!");
      navigate("/roles");
    } catch (error) {
      console.error("Failed to save permissions:", error);
      alert("Failed to save permissions.");
    } finally {
      setSaving(false);
    }
  };

  const selectedRoleObj = roles.find((r) => r.id === Number(selectedRole));

  const enabledPermissions = useMemo(
    () => Object.keys(perms).filter((k) => perms[k]).map((k) => PERM_MAP[k]),
    [perms]
  );

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
          >
            <FiArrowLeft className="text-xl text-gray-700" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Loan Role Permissions</h1>
            <p className="text-gray-500 text-sm">
              Configure what each role can access in loan module.
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-xs text-blue-700">
          <FiShield /> Option-2 LocalStorage → Django Ready
        </div>
      </div>

      {/* 2-COLUMN UI */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white p-6 rounded-2xl shadow-md">

          {/* ROLE SELECT */}
          <div className="mb-6 flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Select Role
              <FiHelpCircle className="text-gray-400" />
            </label>

            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="p-3 bg-gray-50 rounded-xl outline-none shadow-sm"
              disabled={loadingRoles}
            >
              <option value="">Choose role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name || r.roleName}
                </option>
              ))}
            </select>

            {!loadingRoles && roles.length === 0 && (
              <p className="text-xs text-red-500">No roles found. Create a role first.</p>
            )}
          </div>

          {/* PRESET BUTTONS */}
          {selectedRole && (
            <div className="flex flex-wrap gap-2 mb-6">
              <PresetBtn label="Full Access" onClick={() => applyPreset("full")} />
              <PresetBtn label="View Only" onClick={() => applyPreset("view")} />
              <PresetBtn label="Approver" onClick={() => applyPreset("approver")} />
              <button
                onClick={() => applyPreset("clear")}
                className="px-3 py-2 rounded-xl border text-xs text-gray-600 bg-gray-50"
              >
                Clear All
              </button>
            </div>
          )}

          {/* PERMISSION UI */}
          {selectedRole ? (
            loadingPerms ? (
              <div className="text-center py-10 flex items-center justify-center gap-2 text-gray-500">
                <FiLoader className="animate-spin" /> Loading permissions...
              </div>
            ) : (
              <div className="space-y-6">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.title} className="bg-gray-50 border rounded-2xl p-4">
                    <p className="font-semibold text-sm text-gray-800">{group.title}</p>
                    <p className="text-xs text-gray-500 mb-3">{group.subtitle}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.keys.map((key) => {
                        const p = PERM_MAP[key];
                        const active = perms[key];
                        return (
                          <button
                            key={key}
                            onClick={() => togglePerm(key)}
                            className={`flex gap-3 p-3 border rounded-xl text-left transition ${
                              active ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200"
                            }`}
                          >
                            <input type="checkbox" checked={active} readOnly className="mt-1" />
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{p.label}</p>
                              <p className="text-xs text-gray-500">{p.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md disabled:opacity-70"
                >
                  <FiCheckCircle /> {saving ? "Saving..." : "Save Permissions"}
                </button>
              </div>
            )
          ) : (
            <p className="text-center text-gray-400 border border-dashed rounded-xl p-6">
              Select a role to assign permissions.
            </p>
          )}
        </div>

        {/* RIGHT PANEL (SUMMARY) */}
        <div className="space-y-4">
          {/* Role Info */}
          <div className="bg-white p-5 rounded-2xl shadow-md">
            <p className="text-xs text-gray-500">ROLE OVERVIEW</p>
            {selectedRoleObj ? (
              <>
                <h2 className="text-lg font-bold text-gray-800">{selectedRoleObj.name || selectedRoleObj.roleName}</h2>
                <p className="text-xs text-gray-500 mt-1">Controls access to loan operations.</p>
              </>
            ) : (
              <p className="text-xs text-gray-500">No role selected.</p>
            )}
          </div>

          {/* Enabled Perms */}
          <div className="bg-white p-5 rounded-2xl shadow-md">
            <p className="text-xs text-gray-500 mb-2 font-semibold">ENABLED PERMISSIONS</p>
            {enabledPermissions.length === 0 ? (
              <p className="text-xs text-gray-400">No permissions enabled.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {enabledPermissions.map((p) => (
                  <span
                    key={p.key}
                    className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Small Preset Button
const PresetBtn = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-2 rounded-xl bg-gray-900 text-gray-100 text-xs hover:bg-black/70"
  >
    {label}
  </button>
);

export default AssignPermissions;
