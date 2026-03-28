import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiBarChart2, FiActivity } from "react-icons/fi";

export default function ScorecardHome() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Credit History Scorecard",
      desc: "CIBIL / Experian / CRIF based bureau scoring rules",
      icon: <FiBarChart2 size={28} />,
      path: "/rule-management/scorecard/credit-history",
      color: "indigo",
    },
    {
      title: "Internal Scorecard",
      desc: "Company internal financial and stability scoring",
      icon: <FiActivity size={28} />,
      path: "/rule-management/scorecard/internal",
      color: "emerald",
    },
    {
      title: "Geo Location Scorecard",
      desc: "Location based risk and zone scoring",
      icon: <FiMapPin size={28} />,
      path: "/rule-management/scorecard/geo",
      color: "rose",
    },
  ];

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-2xl font-bold">Scorecard Management</h1>
        <p className="text-sm text-gray-500">
          Select a scorecard brain to manage scoring rules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div
            key={c.title}
            onClick={() => navigate(c.path)}
            className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all border hover:border-indigo-200"
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl bg-${c.color}-100 text-${c.color}-600`}
            >
              {c.icon}
            </div>

            <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
