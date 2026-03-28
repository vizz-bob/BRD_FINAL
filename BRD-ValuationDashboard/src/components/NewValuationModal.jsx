import React, { useState } from "react";
import { createNewValuationRequest } from "../service/valuationService";

const INITIAL_FORM = {
  property_type: "",
  location: "",
  request_date: "",
};

const NewValuationModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.property_type.trim()) {
      setError("Property type is required.");
      return;
    }
    if (!form.location.trim()) {
      setError("Location is required.");
      return;
    }
    if (!form.request_date) {
      setError("Request date is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createNewValuationRequest({
        property_type: form.property_type.trim(),
        location: form.location.trim(),
        request_date: form.request_date,
        status: "pending",
      });

      setForm(INITIAL_FORM);
      onClose();
    } catch (err) {
      console.error("Valuation request failed:", err);
      setError("Failed to submit valuation request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setForm(INITIAL_FORM);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div className="bg-white w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200">

        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 text-center">
          New Valuation Request
        </h2>

        {/* Error message */}
        {error && (
          <div className="mb-3 sm:mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

          {/* Property Type */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <input
              type="text"
              name="property_type"
              value={form.property_type}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Apartment, Office, Land..."
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition shadow-sm placeholder:text-gray-400
                         disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="City / Area / Street"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition shadow-sm placeholder:text-gray-400
                         disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Request Date */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Request Date
            </label>
            <input
              type="date"
              name="request_date"
              value={form.request_date}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition shadow-sm
                         disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full xs:w-auto px-4 py-2 text-xs sm:text-sm font-medium bg-gray-100 hover:bg-gray-200
                         text-gray-700 rounded-lg transition
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full xs:w-auto px-4 py-2 text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-700
                         text-white rounded-lg shadow-md transition
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewValuationModal;