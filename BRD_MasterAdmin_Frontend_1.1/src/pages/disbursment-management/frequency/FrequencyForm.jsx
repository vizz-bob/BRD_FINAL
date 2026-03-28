import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
// import { frequencyMasterService } from "../../../services/frequencyMasterService";

export default function FrequencyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    label: "",
    description: ""
  });

  useEffect(() => {
    if (isEdit) {
      // frequencyMasterService.getById(id).then(res => setForm(res.data));
    }
  }, [id]);

  const submit = async e => {
    e.preventDefault();
    console.log("Frequency Data:", form);
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
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-semibold">
            {isEdit ? "Edit Frequency" : "Add Frequency"}
          </h1>
          <p className="text-sm text-gray-500">
            Define how often disbursements are released
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 gap-6">

          {/* Label */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Frequency Label <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.label}
              onChange={e => setForm({ ...form, label: e.target.value })}
              placeholder="e.g. Monthly / Milestone"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Explain this frequency"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
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
            <FiSave /> Save Frequency
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
