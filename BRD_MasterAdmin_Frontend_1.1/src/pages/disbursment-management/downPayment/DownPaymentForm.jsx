import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function DownPaymentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    percentage: "",
    description: "",
    refundable: "Yes"
  });

  const submit = (e) => {
    e.preventDefault();
    console.log("Down Payment:", form);
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
            {isEdit ? "Edit Down Payment" : "Add Down Payment"}
          </h1>
          <p className="text-sm text-gray-500">
            Define standard down payment rules
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Percentage */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Down Payment Percentage <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={form.percentage}
              onChange={(e) =>
                setForm({ ...form, percentage: e.target.value })
              }
              placeholder="e.g. 20"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Refundable */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Refundable <span className="text-red-500">*</span>
            </label>
            <select
              value={form.refundable}
              onChange={(e) =>
                setForm({ ...form, refundable: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Explain payment policy"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
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
            <FiSave /> Save Down Payment
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
