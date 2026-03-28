// src/pages/users/EditUser.jsx

import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import { userService } from "../../services/userService";
import roleService from "../../services/roleService";

import { InputField, SelectField } from "../../components/Controls/SharedUIHelpers";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // user ID from URL

  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  // FORM STATE
  const [form, setForm] = useState({
    email: "",
    phone_number: "",
    password: "",
    role_id: "",       // <-- role UUID for backend
    status: "Active",
    employee_id: "",
    approval_limit: 0,
  });

  // ---------------------
  // LOAD ROLES AND USER
  // ---------------------
  useEffect(() => {
    (async () => {
      try {
        // Fetch all roles
        const roleData = await roleService.getRoles();
        setRoles(roleData || []);

        // Fetch user details
        const u = await userService.getUser(id);

        // Find role UUID that matches the user's role name
        const roleMatch = roleData.find((r) => r.name === u.role);

        setForm({
          email: u.email || "",
          phone_number: u.phone_number || "",
          password: "", // keep blank
          role_id: roleMatch ? roleMatch.id : "", // set role UUID
          status: u.is_active ? "Active" : "Inactive",
          employee_id: u.employee_id || "",
          approval_limit: u.approval_limit || 0,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading user:", err);
        alert("Unable to load user details.");
        navigate("/users/list");
      }
    })();
  }, [id]);

  // ---------------------
  // ON CHANGE
  // ---------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------------
  // SUBMIT
  // ---------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: form.email,
      phone_number: form.phone_number,
      role_id: form.role_id || null, // send UUID to backend
      employee_id: form.employee_id || "",
      approval_limit: Number(form.approval_limit) || 0,
      is_active: form.status === "Active",
    };

    if (form.password.trim() !== "") {
      payload.password = form.password;
    }

    try {
      await userService.updateUser(id, payload);
      alert("User updated successfully!");
      navigate("/users");
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err);
      alert("Unable to update user. Check console.");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center text-gray-500 py-10">Loading user...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
        >
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
          <p className="text-gray-500 text-sm">Update user information & settings</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <InputField name="email" label="Email" value={form.email} onChange={handleChange} />
          <InputField
            name="phone_number"
            label="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
          />
          <InputField
            name="password"
            label="Password (Leave blank to keep unchanged)"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          {/* ROLE SELECT */}
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
            options={["Active", "Inactive"]}
          />

          <div className="md:col-span-2">
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md">
              <FiSave /> Update User
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditUser;
