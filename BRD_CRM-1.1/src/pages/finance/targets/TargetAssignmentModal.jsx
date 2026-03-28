import React, { useState } from "react";
import { X } from "lucide-react";

const TargetAssignmentModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    targetType: "",
    value: "",
    period: "MONTHLY",
    assigneeType: "USER",
    assigneeId: "",
    stageFrom: "",
    stageTo: ""
  });
  const isConversion = ["LEADS", "DEALS"].includes(form.targetType);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.targetType || !form.value || !form.assigneeId) {
      alert("Fill all required fields");
      return;
    }

    onSubmit({
      name: `${form.targetType} Target`,
      target_type: mapTargetType(form.targetType), // map properly
      target_subtype: form.targetType.toLowerCase(),
      target_value: Number(form.value),
      period: form.period.toLowerCase(), // match backend
      assign_to: form.assigneeType.toLowerCase(),
      user: form.assigneeType === "USER" ? form.assigneeId : null,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      stage_from: form.stageFrom,
      stage_to: form.stageTo
    });

    onClose();
  };

  const mapTargetType = (type) => {
    if (["CALLS", "MEETINGS"].includes(type)) return "activity";
    if (["LEADS", "DEALS"].includes(type)) return "conversion";
    if (["REVENUE", "DISBURSEMENT"].includes(type)) return "financial";
    return "activity";
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">
            Assign Target
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-500">Target Type</label>
            <select
              name="targetType"
              value={form.targetType}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            >
              <option value="">Select</option>
              <option value="CALLS">Calls</option>
              <option value="MEETINGS">Meetings</option>
              <option value="LEADS">Leads Converted</option>
              <option value="DEALS">Deals Closed</option>
              <option value="REVENUE">Revenue</option>
              <option value="DISBURSEMENT">Loan Disbursement</option>
            </select>
          </div>
          {isConversion && (
            <>
              <div>
                <label className="text-sm text-gray-500">Stage From</label>
                <input
                  name="stageFrom"
                  value={form.stageFrom}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                  placeholder="Enter starting stage"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Stage To</label>
                <input
                  name="stageTo"
                  value={form.stageTo}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                  placeholder="Enter ending stage"
                />
              </div>
            </>
          )}
          <div>
            <label className="text-sm text-gray-500">Target Value</label>
            <input
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2"
              placeholder="Enter target value"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Period</label>
            <select
              name="period"
              value={form.period}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Assign To</label>
            <select
              name="assigneeType"
              value={form.assigneeType}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            >
              <option value="USER">User</option>
              <option value="TEAM">Team</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              {form.assigneeType === "TEAM" ? "Team ID" : "User ID"}
            </label>
            <input
              name="assigneeId"
              value={form.assigneeId}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2"
              placeholder="Enter ID"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Assign Target
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetAssignmentModal;
