// src/pages/roles/CreateRole.jsx

import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import roleService from "../../services/roleService";

const CreateRole = () => {
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState(""); // ✅ Add description state
  const [existingRoles, setExistingRoles] = useState([]);

  // ---- Load existing roles ----
  useEffect(() => {
    (async () => {
      try {
        const list = await roleService.getRoles();
        setExistingRoles(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Failed to load roles:", error);
      }
    })();
  }, []);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = roleName.trim();
    if (!name) return alert("Please enter a role name.");

    // Check duplicates using API's `name` field
    if (
      existingRoles.some((r) => r.name.toLowerCase() === name.toLowerCase())
    ) {
      alert("Role already exists!");
      return;
    }

    try {
      // Save new role ✅ include description
      const newRole = await roleService.createRole({ name, description });

      alert("Role created successfully!");

      // Auto-navigate to permissions page
      navigate(`/roles/set-permissions?role=${newRole.id}`);
    } catch (error) {
      console.error("Failed to create role:", error);
      alert("Failed to create role. Try again.");
    }
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
        >
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create New Role</h1>
          <p className="text-gray-500 text-sm">
            Define a custom role for your loan management system.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Name Input */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Loan Officer, Auditor, Manager"
              className="mt-2 p-3 rounded-xl bg-gray-50 focus:bg-white shadow-sm outline-none border border-gray-200"
            />
          </div>

          {/* Description Input ✅ */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional: Describe the purpose of this role"
              className="mt-2 p-3 rounded-xl bg-gray-50 focus:bg-white shadow-sm outline-none border border-gray-200 resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md"
          >
            <FiSave className="text-lg" /> Save Role
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateRole;
