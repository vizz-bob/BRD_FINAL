import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function ProvisioningRuleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    classification_type: "",
    days_overdue: "",
    provision_percent: "",
    product_type: "",
  });

  const submit = (e) => {
    e.preventDefault();
    console.log("Provisioning Rule:", form);
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
            {isEdit ? "Edit Provisioning Rule" : "Add Provisioning Rule"}
          </h1>
          <p className="text-sm text-gray-500">
            Configure NPA provisioning criteria
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Classification Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Classification Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.classification_type}
              onChange={(e) =>
                setForm({ ...form, classification_type: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Type</option>
              <option>Standard</option>
              <option>NPA</option>
              <option>Loss Asset</option>
            </select>
          </div>

          {/* Days Overdue */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Days Overdue <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={form.days_overdue}
              onChange={(e) =>
                setForm({ ...form, days_overdue: e.target.value })
              }
              placeholder="90"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Provision % */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Provision Percentage <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={form.provision_percent}
              onChange={(e) =>
                setForm({ ...form, provision_percent: e.target.value })
              }
              placeholder="25"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

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
              placeholder="Home Loan"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
