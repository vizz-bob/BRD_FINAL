import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function ClassificationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    classification_name: "",
    classification_type: "",
    criteria_description: "",
    status: "Active",
  });

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
          <h1 className="text-xl font-semibold">
            {isEdit ? "Edit Classification" : "Add Classification"}
          </h1>
          <p className="text-sm text-gray-500">
            Define loan provisioning & monitoring rules
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Classification Name *
            </label>
            <input
              required
              value={form.classification_name}
              onChange={(e) =>
                setForm({ ...form, classification_name: e.target.value })
              }
              placeholder="Standard / Substandard / NPA"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Type */}
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
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Performing">Performing</option>
              <option value="Substandard">Substandard</option>
              <option value="NPA">NPA</option>
            </select>
          </div>

          {/* Criteria */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Criteria Description
            </label>
            <textarea
              rows={3}
              value={form.criteria_description}
              onChange={(e) =>
                setForm({ ...form, criteria_description: e.target.value })
              }
              placeholder="Explain classification criteria"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
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
            <FiSave size={16} /> Save Classification
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
