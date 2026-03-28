import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function WriteoffUpdate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    writeoff_reason: "",
    loan_id: "",
    writeoff_amount: "",
    approved_by: "",
    date: "",
  });

  const submit = (e) => {
    e.preventDefault();
    console.log("WRITE-OFF UPDATE PAYLOAD:", form);
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
          <h1 className="text-xl font-semibold">Update Write-off</h1>
          <p className="text-sm text-gray-500">
            Record individual loan write-off approvals
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={submit}
        className="bg-white rounded-lg shadow p-6 max-w-3xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loan ID */}
          <div>
            <label className="block text-sm font-medium mb-1">Loan ID *</label>
            <input
              required
              value={form.loan_id}
              onChange={(e) =>
                setForm({ ...form, loan_id: e.target.value })
              }
              placeholder="LN-102938"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Writeoff Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Write-off Amount *
            </label>
            <input
              type="number"
              required
              value={form.writeoff_amount}
              onChange={(e) =>
                setForm({ ...form, writeoff_amount: e.target.value })
              }
              placeholder="50000"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Approved By */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Approved By *
            </label>
            <select
              required
              value={form.approved_by}
              onChange={(e) =>
                setForm({ ...form, approved_by: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            >
              <option value="">Select Authority</option>
              <option>Branch Manager</option>
              <option>Regional Manager</option>
              <option>Risk Committee</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Write-off Date *
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Reason */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Write-off Reason *
            </label>
            <textarea
              rows={3}
              required
              value={form.writeoff_reason}
              onChange={(e) =>
                setForm({ ...form, writeoff_reason: e.target.value })
              }
              placeholder="Customer deceased / Insolvent / Legal settlement"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none resize-none"
            />
          </div>
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
            <FiSave size={16} /> Update Write-off
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
