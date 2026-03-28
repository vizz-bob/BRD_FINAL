import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ---------------- CONSTANTS ---------------- */

const RISK_CATEGORIES = [
  "Credit Risk",
  "Operational Risk",
  "Market Risk",
  "Compliance Risk",
];

const RISK_SEVERITIES = ["Low", "Medium", "High"];

/* ---------------- COMPONENT ---------------- */

export default function AddRisk() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    parameter: "",
    severity: "",
    trigger_event: "",
  });

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP: frontend only
    console.log("Risk Data:", formData);

    // Later → API call
    // await riskService.createRisk(formData)

    navigate("/risk-management/risk");
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
          <h1 className="text-xl font-semibold">Add Risk</h1>
          <p className="text-sm text-gray-500">
            Define a new risk for lending processes
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risk Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Risk Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {RISK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Severity */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Risk Severity <span className="text-red-500">*</span>
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select severity</option>
              {RISK_SEVERITIES.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Parameter */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Risk Parameter <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="parameter"
              value={formData.parameter}
              onChange={handleChange}
              required
              placeholder="e.g. Unstable income source"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Risk Trigger Event */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Risk Trigger Event
            </label>
            <textarea
              name="trigger_event"
              value={formData.trigger_event}
              onChange={handleChange}
              rows={4}
              placeholder="Describe events that trigger this risk"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl bg-gray-100 text-sm hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700"
          >
            <FiSave /> Save Risk
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
