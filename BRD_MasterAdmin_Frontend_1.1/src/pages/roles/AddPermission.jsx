// src/pages/roles/AddPermission.jsx

import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import roleService from "../../services/roleService";

const AddPermission = () => {
  const navigate = useNavigate();

  const [permissionCode, setPermissionCode] = useState("");
  const [permissionDescription, setPermissionDescription] = useState("");
  const [existingPermissions, setExistingPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD EXISTING PERMISSIONS ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const list = await roleService.getPermissions();
        setExistingPermissions(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Failed to load permissions:", error);
      }
    })();
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = permissionCode.trim();
    const description = permissionDescription.trim();

    if (!code || !description) {
      alert("Please fill all required fields.");
      return;
    }

    // Duplicate check (backend stores field as "code")
    if (
      existingPermissions.some(
        (p) => p.code.toLowerCase() === code.toLowerCase()
      )
    ) {
      alert("Permission code already exists!");
      return;
    }

    try {
      setLoading(true);

      // Use roleService.createPermission
      await roleService.createPermission({
        code,          // matches backend "code"
        description,   // matches backend "description"
      });

      alert("Permission created successfully!");
      navigate(-1); // go back
    } catch (error) {
      console.error("Create permission failed:", error);
      alert("Failed to create permission.");
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-800">
            Add New Permission
          </h1>
          <p className="text-gray-500 text-sm">
            Define permissions to control system access.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Permission Code */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium">
              Permission Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={permissionCode}
              onChange={(e) => setPermissionCode(e.target.value)}
              placeholder="e.g. LOAN_PRODUCT_VIEW"
              className="mt-2 p-3 rounded-xl bg-gray-50 focus:bg-white shadow-sm outline-none border border-gray-200"
            />
          </div>

          {/* Permission Description */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={permissionDescription}
              onChange={(e) => setPermissionDescription(e.target.value)}
              placeholder="e.g. Allows viewing loan products"
              className="mt-2 p-3 rounded-xl bg-gray-50 focus:bg-white shadow-sm outline-none border border-gray-200"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md"
          >
            <FiSave className="text-lg" />
            {loading ? "Creating..." : "Save Permission"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddPermission;
