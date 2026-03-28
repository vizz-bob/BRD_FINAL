import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiSave } from "react-icons/fi";

export default function SettlementManage() {
  const [form, setForm] = useState({
    settlement_policy: "",
    max_discount: "",
    product_type: ""
  });

  const submit = (e) => {
    e.preventDefault();
    console.log("Settlement Policy Rule:", form);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Manage Settlement Policy</h1>
        <p className="text-sm text-gray-500">
          Configure settlement discount rules by product
        </p>
      </div>

      {/* FORM CARD */}
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Settlement Policy */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Settlement Policy *
            </label>
            <select
              required
              value={form.settlement_policy}
              onChange={(e) => setForm({ ...form, settlement_policy: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Policy</option>
              <option>Low Risk Recovery</option>
              <option>NPA One-Time Settlement</option>
              <option>Legal Settlement</option>
            </select>
          </div>

          {/* Product Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Type *
            </label>
            <select
              required
              value={form.product_type}
              onChange={(e) => setForm({ ...form, product_type: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Product</option>
              <option>Home Loan</option>
              <option>Personal Loan</option>
              <option>Business Loan</option>
            </select>
          </div>

          {/* Max Discount */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Maximum Discount Allowed (%) *
            </label>
            <input
              type="number"
              required
              value={form.max_discount}
              onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
              placeholder="20"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end mt-8">
          <button className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700">
            <FiSave /> Save Settlement Policy
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
