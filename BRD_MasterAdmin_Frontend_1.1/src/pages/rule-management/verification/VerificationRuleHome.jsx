import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import { FiShield, FiUsers, FiArrowRight } from "react-icons/fi";

export default function VerificationRuleHome() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Verification Rules</h1>
        <p className="text-sm text-gray-500">
          Choose verification type to configure rules
        </p>
      </div>

      {/* NAVIGATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        
        {/* Internal Verification */}
        <NavCard
          icon={<FiShield size={22} />}
          title="Internal Verification"
          description="System driven verification checks like KYC, income, profile validations"
          onClick={() =>
            navigate("/rule-management/verification/internal")
          }
        />

        {/* Agency Verification */}
        <NavCard
          icon={<FiUsers size={22} />}
          title="Agency Verification"
          description="Third‑party / external agency based verification rules"
          onClick={() =>
            navigate("/rule-management/verification/agency")
          }
        />
      </div>
    </MainLayout>
  );
}

/* ---------- CARD ---------- */

const NavCard = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all text-left flex flex-col justify-between"
  >
    <div>
      <div className="flex items-center gap-3 mb-3 text-indigo-600">
        {icon}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>

    <div className="mt-4 flex items-center text-sm font-medium text-indigo-600">
      Manage Rules <FiArrowRight className="ml-2" />
    </div>
  </button>
);
