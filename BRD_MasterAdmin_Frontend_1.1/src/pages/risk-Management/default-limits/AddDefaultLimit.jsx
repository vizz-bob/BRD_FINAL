import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ---------------- CONSTANTS ---------------- */

const DEFAULT_TRIGGERS = [
  "EMI Missed",
  "Loan Bounce",
  "Cheque Bounce",
  "Overdue Beyond Grace Period",
];

/* ---------------- COMPONENT ---------------- */

export default function AddDefaultLimit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    acceptable_npa: "",
    default_threshold_days: "",
    default_trigger: "",
    default_impact_score: "",
    status: "Active",
  });

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

    console.log("Add Default Limit:", formData);

    // Later → API
    // await defaultLimitService.create(formData);

    navigate("/risk-management/default-limits");
  };

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
            Add Default Limit
          </h1>
          <p className="text-sm text-gray-500">
            Configure acceptable NPA and default thresholds
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Acceptable NPA */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Acceptable NPA (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="acceptable_npa"
              value={formData.acceptable_npa}
              onChange={handleChange}
              required
              min="0"
              max="100"
              placeholder="Maximum allowed NPA %"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Default Threshold */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Default Threshold (Days)
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="default_threshold_days"
              value={formData.default_threshold_days}
              onChange={handleChange}
              required
              placeholder="Overdue days to consider default"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Default Trigger */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Default Trigger <span className="text-red-500">*</span>
            </label>
            <select
              name="default_trigger"
              value={formData.default_trigger}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select trigger</option>
              {DEFAULT_TRIGGERS.map((trigger) => (
                <option key={trigger} value={trigger}>
                  {trigger}
                </option>
              ))}
            </select>
          </div>

          {/* Default Impact Score */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Default Impact Score
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="default_impact_score"
              value={formData.default_impact_score}
              onChange={handleChange}
              required
              placeholder="Risk score assigned to default"
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
            <FiSave /> Save Default Limit
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
