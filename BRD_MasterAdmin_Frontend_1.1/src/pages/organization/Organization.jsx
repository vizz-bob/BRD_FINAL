import React from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { organizationService } from "../../services/organizationService";
import useOrganizations from "../../hooks/useOrganization";
import {
  FiPlusCircle,
  FiMapPin,
  FiHome,
} from "react-icons/fi";





// ---------------------
//  FEATURE CARD — Screenshot Theme
// ---------------------
const FeatureCard = ({ title, icon, onClick }) => (
  <div
    onClick={onClick}
    className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 cursor-pointer 
               hover:shadow-md transition-all"
  >
    {/* Light Grey Icon Box */}
    <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center">
      {icon}
    </div>

    <h3 className="text-gray-800 text-[15px] font-medium">{title}</h3>
  </div>
);


const Organization = () => {
  const navigate = useNavigate();

  const { data: summary, loading } = useOrganizations(
    organizationService.getOrganizationSummary
  );

  const orgFeatures = [
    {
      title: "Organizations",
      icon: <FiHome className="text-indigo-600 text-xl" />,
      onClick: () => navigate("/organizations/list"),
    },
    {
      title: "Branches",
      icon: <FiMapPin className="text-green-600 text-xl" />,
      onClick: () => navigate("/organizations/branches/list"),
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-600 p-10">Loading organization data...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Organization Management</h1>
       
      </div>



      {/* FEATURE MODULES */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-gray-700 text-[13px] font-bold tracking-wide mb-6 border-b pb-3">
          ORGANIZATION AND BRANCH MANAGEMENT
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orgFeatures.map((f, i) => (
            <FeatureCard key={i} title={f.title} icon={f.icon} onClick={f.onClick} />
          ))}
        </div>
      </div>

    </MainLayout>
  );
};

export default Organization;
