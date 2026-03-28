import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function SettlementUpdate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loan_id: "",
    settlement_amount: "",
    reason: "",
    settlement_type: "",
    approved_by: ""
  });

  const submit = (e) => {
    e.preventDefault();
    console.log("Settlement Update:", form);
    navigate(-1);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-semibold">Update Loan Settlement</h1>
          <p className="text-sm text-gray-500">
            Record loan settlements and closure adjustments
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Loan ID */}
          <div>
            <label className="text-sm font-medium text-gray-700">Loan ID *</label>
            <input
              required
              value={form.loan_id}
              onChange={(e) => setForm({ ...form, loan_id: e.target.value })}
              placeholder="LN-000245"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Settlement Amount */}
          <div>
            <label className="text-sm font-medium text-gray-700">Settlement Amount *</label>
            <input
              type="number"
              required
              value={form.settlement_amount}
              onChange={(e) => setForm({ ...form, settlement_amount: e.target.value })}
              placeholder="125000"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Settlement Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">Settlement Type *</label>
            <select
              required
              value={form.settlement_type}
              onChange={(e) => setForm({ ...form, settlement_type: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Type</option>
              <option>Full</option>
              <option>Partial</option>
            </select>
          </div>

          {/* Approved By */}
          <div>
            <label className="text-sm font-medium text-gray-700">Approved By *</label>
            <select
              required
              value={form.approved_by}
              onChange={(e) => setForm({ ...form, approved_by: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Authority</option>
              <option>Branch Manager</option>
              <option>Credit Head</option>
              <option>Recovery Head</option>
            </select>
          </div>

          {/* Reason */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Settlement Reason</label>
            <textarea
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Explain settlement circumstances"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => navigate(-1)} className="px-5 py-2 rounded-xl bg-gray-100 text-sm hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700">
            <FiSave /> Save Settlement
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
