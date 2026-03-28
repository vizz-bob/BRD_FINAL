import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiArrowLeft,
  FiSave,
  FiLoader,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import roleService from "../../services/roleService";
import SharedUIHelpers from "../../components/Controls/SharedUIHelpers";

/* -------------------- HELPERS -------------------- */
const groupPermissions = (permissions) => {
  const groups = {};
  permissions.forEach((perm) => {
    const [module, action] = perm.code.split(".");
    if (!groups[module]) groups[module] = [];
    groups[module].push({ ...perm, action });
  });
  return groups;
};

/* -------------------- COMPONENT -------------------- */
const SetPermissions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedRoleId = searchParams.get("role");

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [rolePerms, setRolePerms] = useState({});
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const rolesRes = await roleService.getRoles();
        const permsRes = await roleService.getPermissions();
        setRoles(rolesRes || []);
        setPermissions(permsRes || []);
        if (preSelectedRoleId) handleRoleChange(preSelectedRoleId, permsRes);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /* -------------------- ROLE CHANGE -------------------- */
  const handleRoleChange = async (roleId, allPerms = permissions) => {
    setSelectedRole(roleId);
    if (!roleId) return setRolePerms({});

    setLoading(true);
    try {
      const existing = await roleService.getRolePermissions(roleId);
      const map = {};
      allPerms.forEach((p) => {
        map[p.id] = existing.includes(p.id);
      });
      setRolePerms(map);
    } catch (err) {
      console.error("Failed to load role permissions", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- TOGGLES -------------------- */
  const togglePermission = (id) => {
    setRolePerms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleModule = (perms, value) => {
    setRolePerms((prev) => {
      const updated = { ...prev };
      perms.forEach((p) => (updated[p.id] = value));
      return updated;
    });
  };

  /* -------------------- SAVE -------------------- */
  const handleSave = async () => {
    if (!selectedRole) return alert("Select a role");

    const active = Object.keys(rolePerms).filter((id) => rolePerms[id]);
    if (!active.length) return alert("Select at least one permission");

    setSaving(true);
    try {
      await roleService.assignPermissionsToRole({
        role: selectedRole,
        permissions: active,
      });
      alert("Permissions updated successfully");
      navigate("/roles/list");
    } catch (err) {
      console.error(err);
      alert("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------- DERIVED DATA -------------------- */
  const grouped = groupPermissions(permissions);

  const filteredGroups = Object.entries(grouped).filter(
    ([module, perms]) =>
      module.toLowerCase().includes(search.toLowerCase()) ||
      perms.some(
        (p) =>
          p.code.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      )
  );

  /* -------------------- UI -------------------- */
  return (
    <MainLayout>
      {/* HEADER */}
      <SharedUIHelpers.SubPageHeader
        title="Set Permissions"
        subtitle="Assign permissions to roles"
        onBack={() => navigate(-1)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ROLE SELECT (STICKY) */}
        <SharedUIHelpers.FormCard className="sticky top-6 h-fit">
          <SharedUIHelpers.SelectField
            label="Select Role"
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            options={roles.map((r) => ({ label: r.name, value: r.id }))}
            placeholder="-- Select Role --"
          />
        </SharedUIHelpers.FormCard>

        {/* PERMISSIONS + SAVE */}
        <div className="lg:col-span-3 flex flex-col">
          <SharedUIHelpers.FormCard className="flex-1 flex flex-col p-0 overflow-hidden">
            {!selectedRole ? (
              <p className="text-center text-gray-400 py-20">
                Select a role to manage permissions
              </p>
            ) : loading ? (
              <div className="flex justify-center py-20">
                <FiLoader className="animate-spin text-xl text-blue-600" />
              </div>
            ) : (
              <>
                {/* SEARCH + ACTIONS */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 bg-white z-10 p-4 border-b">
                  <SharedUIHelpers.InputField
                    placeholder="Search permissions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <SharedUIHelpers.Button
                    label="Select All"
                    onClick={() => {
                      const all = {};
                      permissions.forEach((p) => (all[p.id] = true));
                      setRolePerms(all);
                    }}
                  />
                  <SharedUIHelpers.Button
                    label="Clear All"
                    variant="secondary"
                    onClick={() => setRolePerms({})}
                  />
                </div>

                {/* PERMISSION GROUPS */}
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[70vh] p-4">
                  {filteredGroups.map(([module, perms]) => {
                    const selectedCount = perms.filter((p) => rolePerms[p.id])
                      .length;
                    const allSelected = selectedCount === perms.length;

                    return (
                      <div
                        key={module}
                        className="border rounded-xl overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between px-5 py-4 bg-blue-50 cursor-pointer hover:bg-blue-100"
                          onClick={() =>
                            setExpanded((p) => ({
                              ...p,
                              [module]: !p[module],
                            }))
                          }
                        >
                          <div className="flex items-center gap-2">
                            {expanded[module] ? (
                              <FiChevronDown />
                            ) : (
                              <FiChevronRight />
                            )}
                            <div>
                              <p className="font-semibold capitalize">{module}</p>
                              <p className="text-xs text-gray-500">
                                {selectedCount}/{perms.length} selected
                              </p>
                            </div>
                          </div>

                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => toggleModule(perms, !allSelected)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {expanded[module] && (
                          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {perms.map((perm) => (
                              <label
                                key={perm.id}
                                className="flex items-start gap-3 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={!!rolePerms[perm.id]}
                                  onChange={() => togglePermission(perm.id)}
                                />
                                <div>
                                  <p className="font-medium">{perm.action}</p>
                                  <p className="text-xs text-gray-500">
                                    {perm.description}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* STICKY SAVE BUTTON */}
                <div className="mt-4 flex justify-end sticky bottom-0 bg-white pt-4 border-t">
                  <SharedUIHelpers.Button
                    label="Save Changes"
                    icon={saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                    onClick={handleSave}
                    disabled={saving}
                  />
                </div>
              </>
            )}
          </SharedUIHelpers.FormCard>
        </div>
      </div>
    </MainLayout>
  );
};

export default SetPermissions;
