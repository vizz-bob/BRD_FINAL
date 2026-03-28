import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";

export default function PerformanceTemplate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    frequency: "Monthly",
    target_leads: "",
    min_conversion: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Performance Template</h2>
        <p className="text-sm text-gray-500">
          Define evaluation rules for channel partner performance
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-xl">
        <div className="space-y-5">
          {/* Frequency */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Evaluation Frequency
            </label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>

          {/* Target Leads */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Target Leads
            </label>
            <input
              name="target_leads"
              value={form.target_leads}
              onChange={handleChange}
              placeholder="Enter target leads"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Min Conversion */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Minimum Conversion (%)
            </label>
            <input
              name="min_conversion"
              value={form.min_conversion}
              onChange={handleChange}
              placeholder="Enter minimum conversion percentage"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl text-sm border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button className="px-6 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition">
            Save Template
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
