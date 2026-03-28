import React, { useState, useEffect } from "react";
import { createScheduleVerification } from "../service/service";

const ScheduleVerificationModal = ({ isOpen, onClose, onSuccess, verificationId }) => {
  const [propertyId, setPropertyId] = useState("");
  const [date, setDate] = useState("");
  const [agent, setAgent] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && verificationId) {
      setPropertyId(String(verificationId));
    }
    if (!isOpen) {
      setPropertyId("");
      setDate("");
      setAgent("");
      setStatus("pending");
      setError("");
    }
  }, [isOpen, verificationId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!propertyId || !date || !agent) {
      setError("All fields are required.");
      return;
    }

    const agentMap = {
      "Priya Singh": "priya_singh",
      "Amit Kumar": "amit_kumar",
      "Rajesh Sharma": "rajesh_sharma",
    };

    const payload = {
      property_id: propertyId,
      verification_date: date,
      assign_agent: agentMap[agent] ?? agent,
      status: status,
    };

    try {
      setLoading(true);
      await createScheduleVerification(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Schedule verification error:", err);
      setError(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to schedule verification. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-3 sm:px-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
          Schedule Verification
        </h2>

        {error && (
          <div className="mb-3 sm:mb-4 px-3 sm:px-4 py-2 sm:py-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

          {/* Property ID */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Property ID
            </label>
            <input
              type="text"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              placeholder="Enter property ID"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition shadow-sm placeholder:text-gray-400"
            />
          </div>

          {/* Verification Date */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Verification Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition shadow-sm"
            />
          </div>

          {/* Assign Agent */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Assign Agent
            </label>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition shadow-sm"
            >
              <option value="">Select Agent</option>
              <option value="Priya Singh">Priya Singh</option>
              <option value="Amit Kumar">Amit Kumar</option>
              <option value="Rajesh Sharma">Rajesh Sharma</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition shadow-sm"
            >
              <option value="pending">Pending</option>
              <option value="schedule">Scheduled</option>
              <option value="In_Progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full xs:w-auto px-4 py-2 text-xs sm:text-sm font-medium bg-gray-100 hover:bg-gray-200
                         text-gray-700 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full xs:w-auto px-4 py-2 text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-700
                         text-white rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ScheduleVerificationModal;