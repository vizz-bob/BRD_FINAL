import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ---------------- CONSTANTS ---------------- */

const MITIGATION_TYPES = [
  "Collateral",
  "Insurance",
  "Guarantor",
  "Credit Enhancement",
];

const RISK_OPTIONS = [
  { id: 1, label: "Credit Risk – Unstable income source" },
  { id: 2, label: "Operational Risk – Document mismatch" },
  { id: 3, label: "Market Risk – Interest rate fluctuation" },
];

/* ---------------- COMPONENT ---------------- */

export default function AddMitigation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mitigation_type: "",
    mitigation_action: "",
    associated_risks: [],
    effectiveness_score: "",
  });

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRisk = (risk) => {
    setFormData((prev) => {
      const exists = prev.associated_risks.find(
        (r) => r.id === risk.id
      );

      return {
        ...prev,
        associated_risks: exists
          ? prev.associated_risks.filter((r) => r.id !== risk.id)
          : [...prev.associated_risks, risk],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Mitigation Data:", formData);

    // Later → API
    // await mitigationService.create(formData)

    navigate("/risk-management/mitigation");
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
          <h1 className="text-xl font-semibold">Add Risk Mitigation</h1>
          <p className="text-sm text-gray-500">
            Define actions to mitigate identified risks
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mitigation Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Mitigation Type <span className="text-red-500">*</span>
            </label>
            <select
              name="mitigation_type"
              value={formData.mitigation_type}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select type</option>
              {MITIGATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Effectiveness Score */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Effectiveness Score (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="effectiveness_score"
              value={formData.effectiveness_score}
              onChange={handleChange}
              min="0"
              max="100"
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              placeholder="0 - 100"
            />
          </div>

          {/* Mitigation Action */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Mitigation Action <span className="text-red-500">*</span>
            </label>
            <textarea
              name="mitigation_action"
              value={formData.mitigation_action}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-none"
              placeholder="Describe mitigation action"
            />
          </div>

          {/* Associated Risks (Multi-Select) */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Associated Risks <span className="text-red-500">*</span>
            </label>

            <div className="border rounded-xl p-3 space-y-2">
              {RISK_OPTIONS.map((risk) => {
                const checked = formData.associated_risks.some(
                  (r) => r.id === risk.id
                );

                return (
                  <label
                    key={risk.id}
                    className="flex items-center gap-3 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRisk(risk)}
                      className="rounded"
                    />
                    {risk.label}
                  </label>
                );
              })}
            </div>
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
            <FiSave /> Save Mitigation
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
