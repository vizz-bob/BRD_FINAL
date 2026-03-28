import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function IncentiveRuleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    product_type: "",
    incentive_rate: "",
    condition: "",
  });

  const submit = (e) => {
    e.preventDefault();
    console.log("Incentive Rule:", form);
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
            {isEdit ? "Edit Incentive Rule" : "Add Incentive Rule"}
          </h1>
          <p className="text-sm text-gray-500">
            Configure product-based incentive policy
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Product Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Type <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.product_type}
              onChange={(e) =>
                setForm({ ...form, product_type: e.target.value })
              }
              placeholder="Home Loan / Personal Loan"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Incentive Rate */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Incentive Rate (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={form.incentive_rate}
              onChange={(e) =>
                setForm({ ...form, incentive_rate: e.target.value })
              }
              placeholder="2.0"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Condition */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Condition
            </label>
            <textarea
              rows={3}
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              placeholder="Conditions for incentive qualification"
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
            <FiSave /> Save Rule
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
