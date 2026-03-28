import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ExistingObligationView() {
  const navigate = useNavigate();

  const data = {
    status_of_loan: "Active",
    loan_performance: "Good",
    card_type: "Credit",
    status_of_credit_card: "Active",
    credit_card_performance: "Excellent",
    total_loans: 2,
    status: "Active",
    created_at: "2024-01-10",
    modified_at: "2024-01-15",
  };

  return (
    <MainLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl">
        <h2 className="text-xl font-semibold mb-6">
          Existing Obligation Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <p className="text-gray-500 capitalize">
                {key.replaceAll("_", " ")}
              </p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
