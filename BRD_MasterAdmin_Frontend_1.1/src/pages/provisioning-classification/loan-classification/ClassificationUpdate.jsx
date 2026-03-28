import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ClassificationUpdate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    classification_type: "",
    rule_change_notes: "",
    effective_from: ""
  });

  const CLASSIFICATION_TYPES = ["Performing", "Substandard", "NPA", "Loss Asset"];

  const submit = (e) => {
    e.preventDefault();
    console.log(form);
    navigate(-1);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-semibold">Update Classification Type</h1>
          <p className="text-sm text-gray-500">
            Update classification logic as per policy changes
          </p>
        </div>
      </div>

      {/* FORM */}
      <form className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl" onSubmit={submit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Classification Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Classification Type *
            </label>
            <select
              required
              value={form.classification_type}
              onChange={(e) =>
                setForm({ ...form, classification_type: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              {CLASSIFICATION_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Effective Date */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Effective From *
            </label>
            <input
              type="date"
              required
              value={form.effective_from}
              onChange={(e) =>
                setForm({ ...form, effective_from: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Rule Change Notes *
            </label>
            <textarea
              rows={4}
              required
              value={form.rule_change_notes}
              onChange={(e) =>
                setForm({ ...form, rule_change_notes: e.target.value })
              }
              placeholder="Explain why this update is required"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
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
            <FiSave size={16} /> Save Update
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
