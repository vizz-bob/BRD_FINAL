import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function WriteoffManage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    writeoff_policy: "",
    min_days_overdue: "",
    product_type: "",
  });

  const submit = (e) => {
    e.preventDefault();
    console.log("WRITE-OFF MANAGE PAYLOAD:", form);
    navigate(-1);
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-semibold">Manage Write-off Rule</h1>
          <p className="text-sm text-gray-500">
            Configure eligibility conditions for loan write-off
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={submit}
        className="bg-white rounded-lg shadow p-6 max-w-3xl space-y-6"
      >
        {/* Writeoff Policy */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Write-off Policy *
          </label>
          <select
            required
            value={form.writeoff_policy}
            onChange={(e) =>
              setForm({ ...form, writeoff_policy: e.target.value })
            }
            className="w-full border rounded-md px-3 py-2 text-sm outline-none"
          >
            <option value="">Select Policy</option>
            <option>RBI-NPA-2025</option>
            <option>Internal Recovery Policy</option>
          </select>
        </div>

        {/* Minimum Days Overdue */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Minimum Days Overdue *
          </label>
          <input
            type="number"
            required
            value={form.min_days_overdue}
            onChange={(e) =>
              setForm({ ...form, min_days_overdue: e.target.value })
            }
            placeholder="365"
            className="w-full border rounded-md px-3 py-2 text-sm outline-none"
          />
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Type *
          </label>
          <select
            required
            value={form.product_type}
            onChange={(e) =>
              setForm({ ...form, product_type: e.target.value })
            }
            className="w-full border rounded-md px-3 py-2 text-sm outline-none"
          >
            <option value="">Select Product</option>
            <option>Home Loan</option>
            <option>Personal Loan</option>
            <option>Business Loan</option>
            <option>Education Loan</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-2"
          >
            <FiSave size={16} /> Save Rule
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
