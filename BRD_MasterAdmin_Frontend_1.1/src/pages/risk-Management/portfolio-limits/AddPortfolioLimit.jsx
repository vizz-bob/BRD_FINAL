import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function AddPortfolioLimit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_limit: "",
    geo_limit: "",
    borrower_segment_limit: "",
    threshold_alert: "",
    status: "Active",
  });

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Add Portfolio Limit:", formData);

    // Later → API
    // await portfolioLimitService.create(formData);

    navigate("/risk-management/portfolio-limits");
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
            Add Portfolio Limit
          </h1>
          <p className="text-sm text-gray-500">
            Define exposure limits and threshold alerts
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Limit */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Limit (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="product_limit"
              value={formData.product_limit}
              onChange={handleChange}
              required
              placeholder="Max exposure per loan product"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Geo Limit */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Geo Limit (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="geo_limit"
              value={formData.geo_limit}
              onChange={handleChange}
              required
              placeholder="Max exposure per region / pincode"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Borrower Segment Limit */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Borrower Segment Limit (₹)
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="borrower_segment_limit"
              value={formData.borrower_segment_limit}
              onChange={handleChange}
              required
              placeholder="Limit per borrower type (MSME, Retail)"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Threshold Alert */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Threshold Alert (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="threshold_alert"
              value={formData.threshold_alert}
              onChange={handleChange}
              required
              min="1"
              max="100"
              placeholder="Alert trigger before limit breach"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
            <FiSave /> Save Portfolio Limit
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
