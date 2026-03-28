import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function ProvisioningManagerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [products] = useState([
    "Home Loan",
    "Personal Loan",
    "Business Loan",
    "Vehicle Loan",
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    assigned_products: [],
  });

  const toggleProduct = (product) => {
    if (form.assigned_products.includes(product)) {
      setForm({
        ...form,
        assigned_products: form.assigned_products.filter((p) => p !== product),
      });
    } else {
      setForm({
        ...form,
        assigned_products: [...form.assigned_products, product],
      });
    }
  };

  const submit = (e) => {
    e.preventDefault();
    console.log("Provisioning Manager:", form);
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
            {isEdit ? "Edit Provisioning Manager" : "Add Provisioning Manager"}
          </h1>
          <p className="text-sm text-gray-500">
            Assign managers for NPA provisioning
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Manager Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Rohit Sharma"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="manager@bank.com"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Assigned Products */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Assigned Products
            </label>

            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
              {products.map((p) => (
                <label
                  key={p}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm cursor-pointer ${
                    form.assigned_products.includes(p)
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.assigned_products.includes(p)}
                    onChange={() => toggleProduct(p)}
                  />
                  {p}
                </label>
              ))}
            </div>
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
            <FiSave /> Save Manager
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
