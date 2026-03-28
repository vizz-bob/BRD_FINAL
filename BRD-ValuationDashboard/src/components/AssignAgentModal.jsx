import React, { useState, useEffect } from "react";
import { createAssignAgent } from "../service/service";

const AssignAgentModal = ({ isOpen, onClose, onSuccess, verificationId }) => {
  const [currentVerificationId, setCurrentVerificationId] = useState("");
  const [agent, setAgent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && verificationId) {
      setCurrentVerificationId(String(verificationId));
    }
    if (!isOpen) {
      setCurrentVerificationId("");
      setAgent("");
      setError("");
    }
  }, [isOpen, verificationId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentVerificationId || !agent) {
      setError("All fields are required.");
      return;
    }

    const agentMap = {
      "Rajesh Sharma": "rajesh_sharma",
      "Amit Kumar": "amit_kumar",
      "Priya Singh": "priya_singh",
    };

    const payload = {
      verification_id: currentVerificationId,
      select_agent: agentMap[agent] ?? agent,
    };

    try {
      setLoading(true);
      await createAssignAgent(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Assign agent error:", err);
      setError(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to assign agent. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
          Assign Agent
        </h2>

        {error && (
          <div className="mb-3 sm:mb-4 px-3 sm:px-4 py-2 sm:py-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Verification ID
            </label>
            <input
              type="text"
              value={currentVerificationId}
              onChange={(e) => setCurrentVerificationId(e.target.value)}
              placeholder="Enter verification ID"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Select Agent
            </label>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Select Agent</option>
              <option value="Rajesh Sharma">Rajesh Sharma</option>
              <option value="Amit Kumar">Amit Kumar</option>
              <option value="Priya Singh">Priya Singh</option>
            </select>
          </div>

          <div className="flex flex-col xs:flex-row justify-end gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full xs:w-auto px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full xs:w-auto px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Assigning..." : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignAgentModal;