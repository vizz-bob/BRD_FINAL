import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { userService } from "../../services/userService";
import roleService from "../../services/roleService";

import {
  InputField,
  SelectField,
} from "../../components/Controls/SharedUIHelpers";

const AddUser = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    role_id: "",
    status: "Active",
    employee_id: "",
    approval_limit: "",
  });

  /* ---------------- LOAD ROLES ---------------- */
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await roleService.getRoles();
        setRoles(data || []);
      } catch (err) {
        console.error("Failed to load roles", err);
      }
    };
    loadRoles();
  }, []);

  /* ---------------- FORM CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    if (!form.email?.trim()) return "Email is required";
    if (!form.email.endsWith("@gmail.com"))
      return "Email must be a Gmail address";
    if (!form.phone?.trim()) return "Phone is required";
    if (!/^\d{10}$/.test(form.phone))
      return "Phone must be exactly 10 digits";
    if (!form.password?.trim()) return "Password is required";
    if (!form.role_id) return "Role is required";
    return null;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) return alert(error);

    setLoading(true);

    try {
      /* 1️⃣ CREATE USER */
      const payload = {
        email: form.email,
        phone_number: form.phone,
        password: form.password,
        role_id: form.role_id,   // ✅ ADD THIS BACK
        employee_id: form.employee_id || "",
        approval_limit: form.approval_limit
          ? Number(form.approval_limit)
          : null,
        is_active: form.status === "Active",
      };

      const createdUser = await userService.addUser(payload);
      console.log(createdUser)

      if (!createdUser?.user_id) {
        throw new Error("User ID not returned from backend");
      }

      /* 2️⃣ ASSIGN ROLE */
      await roleService.assignRoleToUser({
        user: createdUser.user_id,
        role: form.role_id,
      });

      alert("User created and role assigned successfully!");
      navigate("/users");
    } catch (err) {
      console.error("ADD USER ERROR:", err);
      alert(
        "Failed to add user:\n" +
          JSON.stringify(err?.response?.data || err, null, 2)
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 shadow-sm"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Add New User</h1>
          <p className="text-gray-500 text-sm">
            Create user and assign role
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputField
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            name="phone"
            label="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <InputField
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <SelectField
            name="role_id"
            label="User Role"
            value={form.role_id}
            onChange={handleChange}
            options={roles.map((r) => ({
              label: r.name,
              value: r.id,
            }))}
          />

          <InputField
            name="employee_id"
            label="Employee ID"
            value={form.employee_id}
            onChange={handleChange}
          />

          <InputField
            name="approval_limit"
            label="Approval Limit"
            type="number"
            value={form.approval_limit}
            onChange={handleChange}
          />

          <SelectField
            name="status"
            label="Status"
            value={form.status}
            onChange={handleChange}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />

          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-70"
            >
              <FiSave />
              {loading ? "Creating..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddUser;
