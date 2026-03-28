import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function UpdateRecovery() {
  const navigate = useNavigate();
  const [responsibility, setResponsibility] = useState("");

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold"></h2>
        <p className="text-sm text-gray-500">
          
        </p>
      </div>

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
            <h1 className="text-xl font-semibold">Repayment Recovery</h1>
            <p className="text-sm text-gray-500">Define who is responsible for repayment recovery</p>
          </div>
        </div>
      </div>


      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-xl">
        <div className="space-y-5">
          {/* Responsibility */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Recovery Responsibility
            </label>
            <select
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select responsibility</option>
              <option value="AGENT">Agent Responsible</option>
              <option value="INTERNAL">Internal Team</option>
            </select>
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
            Update Recovery
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
