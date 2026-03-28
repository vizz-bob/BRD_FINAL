import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
// import { documentMasterService } from "../../../services/documentMasterService";
// import { stageMasterService } from "../../../services/stageMasterService";

export default function DocumentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [stages, setStages] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    mandatory: false,
    applicable_stage: ""
  });

  useEffect(() => {
    // TEMP MOCK DATA
    setStages([
      { id: 1, stage_name: "Pre-Approval" },
      { id: 2, stage_name: "Disbursement" }
    ]);
  }, []);

  const submit = async e => {
    e.preventDefault();
    console.log("Document Data:", form);
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
            {isEdit ? "Edit Document" : "Add Document"}
          </h1>
          <p className="text-sm text-gray-500">
            Define required documents for disbursement stages
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Document Name */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Document Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. KYC Document"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select type</option>
              <option>Legal</option>
              <option>Financial</option>
              <option>Technical</option>
            </select>
          </div>

          {/* Mandatory */}
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={form.mandatory}
              onChange={e => setForm({ ...form, mandatory: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium text-gray-700">
              Mandatory Document
            </label>
          </div>

          {/* Applicable Stage */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Applicable Stage
            </label>
            <select
              value={form.applicable_stage}
              onChange={e => setForm({ ...form, applicable_stage: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select Stage</option>
              {stages.map(s => (
                <option key={s.id} value={s.id}>{s.stage_name}</option>
              ))}
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
            <FiSave /> Save Document
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
