import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function EditOther() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    parameter_name: "",
    parameter_value: "",
    valid_from: "",
    valid_to: "",
    status: "Active",
  });

  /* ---------------- LOAD PARAMETER (MOCK) ---------------- */

  useEffect(() => {
    // TEMP MOCK (replace with API later)
    const mockItem = {
      id,
      parameter_name: "Temporary High-Risk PIN",
      parameter_value: "302019",
      valid_from: "2025-09-01",
      valid_to: "2025-09-30",
      status: "Active",
    };

    setFormData({
      parameter_name: mockItem.parameter_name,
      parameter_value: mockItem.parameter_value,
      valid_from: mockItem.valid_from,
      valid_to: mockItem.valid_to,
      status: mockItem.status,
    });

    setLoading(false);
  }, [id]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Update Other Parameter:", {
      id,
      ...formData,
    });

    // Later → API
    // await otherService.update(id, formData);

    navigate("/risk-management/others");
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading parameter details...
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-semibold">
            Edit Custom Risk Parameter
          </h1>
          <p className="text-sm text-gray-500">
            Update temporary or conditional risk rule
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parameter Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Parameter Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="parameter_name"
              value={formData.parameter_name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Parameter Value */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Parameter Value <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="parameter_value"
              value={formData.parameter_value}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Valid From */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Valid From <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Valid To */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Valid To <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="valid_to"
              value={formData.valid_to}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl bg-gray-100 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2"
          >
            <FiSave /> Update Parameter
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
