import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiTrendingUp,
  FiSearch,
} from "react-icons/fi";

export default function ScoreCardRatingHome() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Reference Check",
      description:
        "Configure scoring based on reference and background verification",
      icon: <FiUsers size={22} />,
      path: "/controls/score-card/reference-check",
    },
    {
      title: "Credit History",
      description:
        "Manage credit bureau rules and score thresholds",
      icon: <FiTrendingUp size={22} />,
      path: "/controls/score-card/credit-history",
    },
    {
      title: "Investigation Report",
      description:
        "Define scoring rules from legal, technical and fraud reports",
      icon: <FiSearch size={22} />,
      path: "/controls/score-card/investigation-report",
    },
  ];

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold">
          Score Card Rating
        </h1>
        <p className="text-sm text-gray-500">
          Configure scoring parameters across verification stages
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <h3 className="font-semibold text-gray-900">
                {card.title}
              </h3>
            </div>

            <p className="text-sm text-gray-600">
              {card.description}
            </p>
          </button>
        ))}
      </div>
    </MainLayout>
  );
}
