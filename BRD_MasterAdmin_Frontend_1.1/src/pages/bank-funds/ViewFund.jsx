import React from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";

const ViewFund = () => {
  const navigate = useNavigate();

  const fund = {
    fund_type: "Internal Fund",
    fund_source: "Company Reserve",
    available_amount: 50000000,
    allocation_logic: "Used first before borrowed funds",
    status: "Active",
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold mb-6">View Fund</h1>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4 text-sm">
          <Detail label="Fund Type" value={fund.fund_type} />
          <Detail label="Fund Source" value={fund.fund_source} />
          <Detail
            label="Available Amount"
            value={`₹ ${fund.available_amount.toLocaleString()}`}
          />
          <Detail label="Allocation Logic" value={fund.allocation_logic} />
          <Detail label="Status" value={fund.status} />

          <div className="flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-xl border"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ViewFund;

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);
