import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave, FiChevronDown } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function ThirdPartyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [stages, setStages] = useState([]);
  const [openStageDropdown, setOpenStageDropdown] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    contact_info: "",
    associated_stages: []
  });

  useEffect(() => {
    setStages([
      { id: "1", stage_name: "Pre-Approval" },
      { id: "2", stage_name: "Disbursement" }
    ]);
  }, []);

  const toggleStage = (id) => {
    setForm((prev) => ({
      ...prev,
      associated_stages: prev.associated_stages.includes(id)
        ? prev.associated_stages.filter((s) => s !== id)
        : [...prev.associated_stages, id]
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    console.log("Third Party Payload:", form);
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
            {isEdit ? "Edit Third Party" : "Add Third Party"}
          </h1>
          <p className="text-sm text-gray-500">
            Configure verification & validation partner
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
              Third Party Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Verifier Pvt Ltd"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Auditor / Verifier / Appraiser"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Contact Information
            </label>
            <textarea
              rows={3}
              value={form.contact_info}
              onChange={(e) =>
                setForm({ ...form, contact_info: e.target.value })
              }
              placeholder="Email, Phone, Address"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* MULTI SELECT STAGES */}
          <div className="md:col-span-2 relative">
            <label className="text-sm font-medium text-gray-700">
              Associated Stages
            </label>

            <div
              onClick={() => setOpenStageDropdown(!openStageDropdown)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm flex justify-between items-center cursor-pointer focus:ring-2 focus:ring-blue-500"
            >
              <span
                className={
                  form.associated_stages.length === 0 ? "text-gray-400" : ""
                }
              >
                {form.associated_stages.length === 0
                  ? "Select stages"
                  : stages
                      .filter((s) =>
                        form.associated_stages.includes(s.id)
                      )
                      .map((s) => s.stage_name)
                      .join(", ")}
              </span>
              <FiChevronDown />
            </div>

            {openStageDropdown && (
              <div className="mt-2 border rounded-xl bg-white shadow max-h-48 overflow-auto">
                {stages.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.associated_stages.includes(s.id)}
                      onChange={() => toggleStage(s.id)}
                    />
                    {s.stage_name}
                  </label>
                ))}
              </div>
            )}
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
            <FiSave /> Save Third Party
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
