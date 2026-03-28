import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function UpdatePayout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    commission: "",
    incentive: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <MainLayout>
      {/* HEADER */}
      

      <div className="flex justify-between items-center mb-6">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1 className="text-xl font-semibold">Update Payout</h1>
            <p className="text-sm text-gray-500">Configure commission and incentive structure for the agent</p>
          </div>
        </div>
      </div>


      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-xl">
        <div className="space-y-5">
          {/* Commission */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Commission (%)
            </label>
            <input
              name="commission"
              value={form.commission}
              onChange={handleChange}
              placeholder="Enter commission percentage"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Incentive */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Incentive Amount
            </label>
            <input
              name="incentive"
              value={form.incentive}
              onChange={handleChange}
              placeholder="Enter incentive amount"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl text-sm border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button className="px-6 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition">
            Save Payout
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
