import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function SettlementRuleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    settlement_policy: "",
    max_discount: "",
    product_type: ""
  });

  const submit = (e) => {
    e.preventDefault();
    console.log("Settlement Policy:", form);
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
            {isEdit ? "Edit Settlement Policy" : "Add Settlement Policy"}
          </h1>
          <p className="text-sm text-gray-500">
            Define discount eligibility rules for loan settlements
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Settlement Policy */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Settlement Policy Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.settlement_policy}
              onChange={(e) => setForm({ ...form, settlement_policy: e.target.value })}
              placeholder="Internal Settlement Policy"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Max Discount */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Max Discount (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={form.max_discount}
              onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
              placeholder="40"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Product Type */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Product Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.product_type}
              onChange={(e) => setForm({ ...form, product_type: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Product</option>
              <option>Personal Loan</option>
              <option>Home Loan</option>
              <option>Business Loan</option>
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
            <FiSave /> Save Policy
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
