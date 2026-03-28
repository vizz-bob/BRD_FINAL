import React, { useMemo, useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiPlus, FiEdit3, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";
import { userService } from "../../services/userService";
import roleService from "../../services/roleService";
import {
  PageHeader,
  ListView,
  DeleteConfirmButton,
} from "../../components/Controls/SharedUIHelpers";

const UserList = () => {
  const navigate = useNavigate();
  const { users, loading, reload } = useUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roles, setRoles] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ---------------------
  // FETCH ROLES
  // ---------------------
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await roleService.getRoles();
        setRoles(data || []);
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    };
    loadRoles();
  }, []);

  // ---------------------
  // FILTER USERS
  // ---------------------
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        u.email?.toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q);

      const matchesRole =
        roleFilter === "ALL" || (u.role || "").toLowerCase() === roleFilter.toLowerCase();

      const statusText = u.is_active ? "active" : "inactive";
      const matchesStatus =
        statusFilter === "ALL" || statusText === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // ---------------------
  // DELETE USER
  // ---------------------
  const handleDelete = (id) => setDeleteUserId(id);

  const confirmDelete = async () => {
    if (!deleteUserId) return;
    setDeleteLoading(true);
    try {
      await userService.deleteUser(deleteUserId);
      reload();
      setDeleteUserId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => setDeleteUserId(null);

  // ---------------------
  // LIST COLUMNS & ACTIONS
  // ---------------------
  const columns = [
    { key: "email", label: "Email" },
    { key: "phone_number", label: "Phone" },
    { key: "role", label: "Role" },
    { key: "employee_id", label: "Employee ID" },
    { key: "approval_limit", label: "Approval Limit" },
    { key: "is_active", label: "Status", type: "status" },
  ];

  const actions = [
    {
      icon: <FiEdit3 />,
      color: "blue",
      onClick: (row) => navigate(`/users/edit/${row.id}`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => handleDelete(row.id),
    },
  ];

  return (
    <MainLayout>
      {/* HEADER */}
      <PageHeader
        title="User List"
        subtitle="View and manage all registered users."
        actionLabel="Add New User"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/users/add")}
      />

      {/* ================= SEARCH & FILTER BAR ================= */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full md:max-w-md">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or role..."
            className="flex-1 bg-gray-50 rounded-xl px-3 py-2 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          {/* Dynamic Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 text-sm outline-none"
          >
            <option value="ALL">All Roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 text-sm outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* LIST VIEW */}
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No users found.</p>
        ) : (
          <ListView
            data={filteredUsers}
            columns={columns}
            actions={actions}
            rowKey="id"
          />
        )}

      {/* DELETE CONFIRM MODAL */}
      {deleteUserId && (
        <DeleteConfirmButton
          title="Delete User"
          message="Are you sure you want to delete this user?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          loading={deleteLoading}
        />
      )}
    </MainLayout>
  );
};

export default UserList;
