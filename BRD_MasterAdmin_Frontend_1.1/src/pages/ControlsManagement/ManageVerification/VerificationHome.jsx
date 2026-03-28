import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiPhone, FiUserCheck } from "react-icons/fi";

export default function VerificationHome() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Tele Verification",
      description: "Manage phone/video verifications of applicants",
      icon: <FiPhone size={22} />,
      path: "/controls/verification/tele-verification",
    },
    {
      title: "Credit Personal Meetings",
      description: "Manage physical meetings and document collection",
      icon: <FiUserCheck size={22} />,
      path: "/controls/verification/credit-personal-meetings",
    },
  ];

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Verification Management</h1>
        <p className="text-sm text-gray-500">
          Manage verification workflows for loan applications
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() => navigate(card.path)}
            className="bg-white p-6 rounded-2xl shadow-sm text-left hover:shadow-md transition border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
            </div>

            <p className="text-sm text-gray-600">{card.description}</p>
          </button>
        ))}
      </div>
    </MainLayout>
  );
}
