import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EligibilityView() {
  const navigate = useNavigate();

  const data = {
    type: "Loan",
    category: "Home Loan",
    income_type: "Salaried",
    other_income: 5000,
    margin: 20,
    salary: 50000,
    salary_receipt: true,
    update_turnover: false,
    status: "Active",
  };

  return (
    <MainLayout>
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2">
        <FiArrowLeft /> Back
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl">
        <h2 className="text-xl font-semibold mb-6">Eligibility Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {Object.entries(data).map(([k, v]) => (
            <div key={k}>
              <p className="text-gray-500 capitalize">{k.replace("_", " ")}</p>
              <p className="font-medium">
                {typeof v === "boolean" ? (v ? "Yes" : "No") : v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
