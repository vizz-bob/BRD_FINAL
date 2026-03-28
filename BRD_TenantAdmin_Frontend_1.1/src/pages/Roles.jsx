import { useEffect, useState } from "react";
import { roleAPI } from "../services/roleService";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [validationError, setValidationError] = useState("");

  const roleTypes = [
    { id: "sole", name: "Sole" },
    { id: "supervisor", name: "Supervisor" },
  ];

  const statusOptions = [
    { id: "active", name: "Active" },
    { id: "inactive", name: "Inactive" },
  ];

  const emptyForm = {
    role_type: "",
    role_name: "",
    status: "active",
  };

  const [form, setForm] = useState(emptyForm);

  const validateForm = () => {
    if (!form.role_name.trim()) {
      setValidationError("Role name is required");
      return false;
    }
    if (!form.role_type) {
      setValidationError("Role type is required");
      return false;
    }
    if (!form.status) {
      setValidationError("Status is required");
      return false;
    }
    setValidationError("");
    return true;
  };

  const load = async () => {
    try {
      const res = await roleAPI.list();
      setRoles(res.data || []);
    } catch (err) {
      console.error("Failed to load roles", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createRole = async () => {
    if (!validateForm()) return;
    try {
      await roleAPI.create(form);
      setOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      console.error(err);
      setValidationError("Failed to create role");
    }
  };

  const updateRole = async () => {
    if (!validateForm()) return;
    try {
      await roleAPI.update(editing.id, form);
      setEditing(null);
      setForm(emptyForm);
      load();
    } catch (err) {
      console.error(err);
      setValidationError("Failed to update role");
    }
  };

  const deleteRole = async () => {
    try {
      await roleAPI.delete(deleting.id);
      setDeleting(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleTypeName = (id) => roleTypes.find(t => t.id === id)?.name || "—";
  const getStatusName  = (id) => statusOptions.find(s => s.id === id)?.name  || "—";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Roles</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Create and manage different user role types and names for this tenant.
        </p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setForm(emptyForm);
            setOpen(true);
            setValidationError("");
          }}
          className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          + Create New Role
        </button>
      </div>

      {/* Table / Mobile Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No roles found.
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getRoleTypeName(role.role_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {role.role_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          role.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {getStatusName(role.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditing(role);
                          setForm({
                            role_type: role.role_type,
                            role_name: role.role_name,
                            status: role.status,
                          });
                          setValidationError("");
                        }}
                        className="text-primary-600 hover:text-primary-800 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(role)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {roles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No roles found.</div>
          ) : (
            roles.map((role) => (
              <div key={role.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-gray-900">{role.role_name}</div>
                    <div className="text-sm text-gray-600 mt-0.5">
                      {getRoleTypeName(role.role_type)}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      role.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {getStatusName(role.status)}
                  </span>
                </div>

                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => {
                      setEditing(role);
                      setForm({
                        role_type: role.role_type,
                        role_name: role.role_name,
                        status: role.status,
                      });
                      setValidationError("");
                    }}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleting(role)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {validationError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {validationError}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(open || editing) && (
        <Modal
          title={editing ? "Edit Role" : "Create New Role"}
          onClose={() => {
            setOpen(false);
            setEditing(null);
            setValidationError("");
          }}
        >
          <div className="space-y-5 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role Type *</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={form.role_type}
                onChange={(e) => setForm({ ...form, role_type: e.target.value })}
              >
                <option value="">Select role type</option>
                {roleTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role Name *</label>
              <input
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. Credit Officer Level 2"
                value={form.role_name}
                onChange={(e) => setForm({ ...form, role_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={editing ? updateRole : createRole}
                className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Save Role
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleting && (
        <Modal title="Confirm Deletion" onClose={() => setDeleting(null)}>
          <div className="mt-4 space-y-6">
            <p className="text-gray-700">
              Are you sure you want to delete the role{" "}
              <span className="font-semibold text-gray-900">"{deleting.role_name}"</span>?
            </p>
            <p className="text-sm text-red-600 font-medium">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteRole}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Delete Role
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}