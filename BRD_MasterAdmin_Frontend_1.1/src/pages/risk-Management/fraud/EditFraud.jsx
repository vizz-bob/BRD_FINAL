import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ---------------- CONSTANTS ---------------- */

const FRAUD_CATEGORIES = [
  "Identity Fraud",
  "Documentation Fraud",
  "Digital Footprint Fraud",
];

const FRAUD_STATUSES = [
  "Suspected",
  "Confirmed",
  "Cleared",
];

const REPORTING_AUTHORITIES = [
  "Internal Risk Team",
  "Compliance Team",
  "External Agency",
];

/* ---------------- COMPONENT ---------------- */

export default function EditFraud() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fraud_category: "",
    modus_operandi: "",
    fraud_status: "",
    reporting_authority: "",
  });

  /* ---------------- LOAD FRAUD (MOCK) ---------------- */

  useEffect(() => {
    // TEMP MOCK (replace with API later)
    const mockFraud = {
      id,
      fraud_category: "Documentation Fraud",
      modus_operandi: "Forged income statements submitted during verification",
      fraud_status: "Suspected",
      reporting_authority: "Internal Risk Team",
    };

    setFormData({
      fraud_category: mockFraud.fraud_category,
      modus_operandi: mockFraud.modus_operandi,
      fraud_status: mockFraud.fraud_status,
      reporting_authority: mockFraud.reporting_authority,
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

    console.log("Updated Fraud Case:", {
      id,
      ...formData,
    });

    // Later → API
    // await fraudService.update(id, formData);

    navigate("/risk-management/fraud");
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-sm text-gray-500">
          Loading fraud case details...
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
            Edit Fraud Case
          </h1>
          <p className="text-sm text-gray-500">
            Update fraud details, status, and reporting authority
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fraud Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Fraud Category <span className="text-red-500">*</span>
            </label>
            <select
              name="fraud_category"
              value={formData.fraud_category}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              {FRAUD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Fraud Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Fraud Status <span className="text-red-500">*</span>
            </label>
            <select
              name="fraud_status"
              value={formData.fraud_status}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select status</option>
              {FRAUD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Reporting Authority */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Reporting Authority{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="reporting_authority"
              value={formData.reporting_authority}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select authority</option>
              {REPORTING_AUTHORITIES.map((auth) => (
                <option key={auth} value={auth}>
                  {auth}
                </option>
              ))}
            </select>
          </div>

          {/* Modus Operandi */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Modus Operandi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="modus_operandi"
              value={formData.modus_operandi}
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
            <FiSave /> Update Fraud Case
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
