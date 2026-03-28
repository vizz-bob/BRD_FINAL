import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- CONSTANTS ---------------- */

const RCU_TRIGGERS = [
  "Mismatch in documents",
  "Frequent loan enquiries",
  "Address inconsistency",
  "Unusual transaction pattern",
];

const INVESTIGATION_STATUSES = [
  "Pending",
  "In Progress",
  "Closed",
];

const RISK_TYPES = [
  "Operational",
  "Behavioral",
  "Financial",
];

/* ---------------- COMPONENT ---------------- */

export default function EditRCU() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    rcu_trigger: "",
    investigation_status: "",
    risk_type: "",
    action_taken: "",
  });

  /* ---------------- LOAD RCU (MOCK) ---------------- */

  useEffect(() => {
    // TEMP MOCK (replace with API later)
    const mockRCU = {
      id,
      rcu_trigger: "Mismatch in documents",
      investigation_status: "In Progress",
      risk_type: "Operational",
      action_taken:
        "Requested fresh documents and escalated to verification team",
    };

    setFormData({
      rcu_trigger: mockRCU.rcu_trigger,
      investigation_status: mockRCU.investigation_status,
      risk_type: mockRCU.risk_type,
      action_taken: mockRCU.action_taken,
    });

    setLoading(false);
  }, [id]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated RCU Case:", { id, ...formData });

    // Later → API
    // await rcuService.update(id, formData);

    navigate("/risk-management/rcu");
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading RCU case details...
        </p>
      </MainLayout>
    );
  }

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
            Edit RCU Case
          </h1>
          <p className="text-sm text-gray-500">
            Update investigation status and actions taken
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* RCU Trigger */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              RCU Trigger <span className="text-red-500">*</span>
            </label>
            <select
              name="rcu_trigger"
              value={formData.rcu_trigger}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select trigger</option>
              {RCU_TRIGGERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Investigation Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Investigation Status{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="investigation_status"
              value={formData.investigation_status}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select status</option>
              {INVESTIGATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Risk Type <span className="text-red-500">*</span>
            </label>
            <select
              name="risk_type"
              value={formData.risk_type}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select risk type</option>
              {RISK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Action Taken */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Action Taken <span className="text-red-500">*</span>
            </label>
            <textarea
              name="action_taken"
              value={formData.action_taken}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-none"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl bg-gray-100 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2"
          >
            <FiSave /> Update RCU Case
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
