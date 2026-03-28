import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const TaxViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tax, setTax] = useState(null);

  useEffect(() => {
    // Replace with API call
    const existingTax = {
      type: "GST",
      category: "Processing Fee",
      rate: 18,
      valid_from: "2024-01-01",
      valid_to: "2025-12-31",
      status: "Active",
    };
    setTax(existingTax);
  }, [id]);

  if (!tax) return null;

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>

        <h2 className="text-xl font-semibold mb-4">Tax Details</h2>

        <div className="space-y-2">
          <div>
            <span className="font-medium">Tax Type: </span>
            {tax.type}
          </div>
          <div>
            <span className="font-medium">Category: </span>
            {tax.category}
          </div>
          <div>
            <span className="font-medium">Rate: </span>
            {tax.rate}%
          </div>
          <div>
            <span className="font-medium">Valid From: </span>
            {tax.valid_from}
          </div>
          <div>
            <span className="font-medium">Valid To: </span>
            {tax.valid_to}
          </div>
          <div>
            <span className="font-medium">Status: </span>
            {tax.status}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TaxViewPage;
