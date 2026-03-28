import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const BusinessModelViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [model, setModel] = useState(null);

  useEffect(() => {
    // Replace with API call
    const existingModel = {
      name: "Mark-up Model",
      description: "Margin is applied over the base rate or fund cost",
      status: "Active",
    };
    setModel(existingModel);
  }, [id]);

  if (!model) return null;

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>

        <h2 className="text-xl font-semibold mb-4">Business Model Details</h2>

        <div className="space-y-2">
          <div>
            <span className="font-medium">Model Name: </span>
            {model.name}
          </div>
          <div>
            <span className="font-medium">Description: </span>
            {model.description}
          </div>
          <div>
            <span className="font-medium">Status: </span>
            {model.status}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BusinessModelViewPage;
