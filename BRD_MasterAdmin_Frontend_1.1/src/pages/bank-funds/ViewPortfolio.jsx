import React from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";

export default function ViewPortfolio() {
  const navigate = useNavigate();

  const portfolio = {
    name: "Retail Loan Portfolio",
    type: "Retail",
    banks: ["HDFC Bank", "ICICI Bank"],
    status: "Active",
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold mb-6">View Portfolio</h1>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4 text-sm">
          <Detail label="Portfolio Name" value={portfolio.name} />
          <Detail label="Portfolio Type" value={portfolio.type} />
          <Detail label="Mapped Banks" value={portfolio.banks.join(", ")} />
          <Detail label="Status" value={portfolio.status} />

          <div className="flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="border px-5 py-2 rounded-xl"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
