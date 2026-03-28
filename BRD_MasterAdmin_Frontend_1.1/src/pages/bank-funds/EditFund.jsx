import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const FUND_TYPES = ["Internal Fund", "Borrowed Fund", "Corpus Fund"];

export default function EditFund() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    fund_type: "Internal Fund",
    allocation_logic: "Use first for retail loans",
  });

  const handleChange = (e, isNumber = false) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Update Fund:", id, form);
    navigate("/fund-management");
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Edit Fund</h1>
          <p className="text-gray-500 text-sm">Update fund type and allocation logic</p>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Select
          label="Fund Type"
          name="fund_type"
          value={form.fund_type}
          onChange={handleChange}
          options={FUND_TYPES}
          required
        />

        <Textarea
          label="Fund Allocation Logic"
          name="allocation_logic"
          value={form.allocation_logic}
          onChange={handleChange}
          rows={4}
          className="md:col-span-2"
        />

        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-xl border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700"
          >
            <FiSave /> Update Fund
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ---------------- REUSABLE ---------------- */
const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
