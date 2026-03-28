import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ---------------- CONSTANTS ---------------- */

const DEVIATION_TYPES = [
  "Income",
  "Tenure",
  "Collateral",
  "Credit Score",
];

const APPROVING_AUTHORITIES = [
  "Branch Manager",
  "Risk Manager",
  "Credit Head",
  "Compliance Officer",
];

const IMPACT_LEVELS = ["Low", "Medium", "High"];

/* ---------------- COMPONENT ---------------- */

export default function AddDeviation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    deviation_type: "",
    justification: "",
    approving_authority: "",
    impact_level: "",
  });

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Deviation Data:", formData);

    // Later → API
    // await deviationService.create(formData)

    navigate("/risk-management/deviation");
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
          <h1 className="text-xl font-semibold">Add Deviation</h1>
          <p className="text-sm text-gray-500">
            Define a policy deviation with proper justification
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deviation Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Deviation Type <span className="text-red-500">*</span>
            </label>
            <select
              name="deviation_type"
              value={formData.deviation_type}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select type</option>
              {DEVIATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Impact Level */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Impact Level <span className="text-red-500">*</span>
            </label>
            <select
              name="impact_level"
              value={formData.impact_level}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select impact</option>
              {IMPACT_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Approving Authority */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Approving Authority <span className="text-red-500">*</span>
            </label>
            <select
              name="approving_authority"
              value={formData.approving_authority}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select authority</option>
              {APPROVING_AUTHORITIES.map((auth) => (
                <option key={auth} value={auth}>
                  {auth}
                </option>
              ))}
            </select>
          </div>

          {/* Justification */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Justification <span className="text-red-500">*</span>
            </label>
            <textarea
              name="justification"
              value={formData.justification}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Explain why this deviation is required"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-none"
            />
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
            <FiSave /> Save Deviation
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
