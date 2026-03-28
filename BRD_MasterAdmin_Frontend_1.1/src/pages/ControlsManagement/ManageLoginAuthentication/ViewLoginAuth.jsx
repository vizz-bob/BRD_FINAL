import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ViewLoginAuth() {
  const navigate = useNavigate();

  const data = {
    authType: "OTP",
    deviceRestriction: "Enabled",
    mfaEnabled: "Disabled",
    status: "Active",
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100">
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">View Login Authentication</h1>
          <p className="text-gray-500 text-sm">Authentication policy details</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b pb-2">
            <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
