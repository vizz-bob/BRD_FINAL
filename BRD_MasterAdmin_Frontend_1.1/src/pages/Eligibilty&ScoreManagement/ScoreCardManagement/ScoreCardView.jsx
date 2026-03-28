import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function ScoreCardView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    /* MOCK FETCH */
    setData({
      impact_type: "Credit Risk",
      risk_impact: "High",
      template: "Retail Loan",
      professionals: 720,
      employees: 650,
      groups: 540,
      corporates: 810,
      others: 300,
      status: "Active",
    });
  }, [id]);

  if (!data) return null;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Score Card Details</h1>
            <p className="text-sm text-gray-500">
              View score card configuration
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/score-cards/edit/${id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <FiEdit /> Edit
        </button>
      </div>

      {/* DETAILS */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-4xl">
        <Detail label="Impact Type" value={data.impact_type} />
        <Detail label="Risk Impact" value={data.risk_impact} />
        <Detail label="Score Template" value={data.template} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Detail label="Professionals Score" value={data.professionals} />
          <Detail label="Employees Score" value={data.employees} />
          <Detail label="Groups Score" value={data.groups} />
          <Detail label="Corporates Score" value={data.corporates} />
          <Detail label="Others Score" value={data.others} />
        </div>

        <div className="mt-6">
          <span
            className={`px-3 py-1 text-xs rounded-full ${
              data.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {data.status}
          </span>
        </div>
      </div>
    </MainLayout>
  );
}

const Detail = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-900">{value}</p>
  </div>
);
