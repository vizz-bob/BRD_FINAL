import React from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import {
  FiCreditCard,
  FiSettings,
  FiUsers,
  FiUserCheck,
  FiDollarSign,
} from "react-icons/fi";

/* ---------------- COMPONENT ---------------- */

export default function CollectionManagement() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Payment Gateway Management",
      description:
        "Configure and manage payment gateways used for EMI and fee collections.",
      icon: <FiCreditCard size={22} />,
      route: "/collection-management/payment-gateways",
    },
    {
      title: "Collection Control Management",
      description:
        "Define collection types, security deposits, and cash collection limits.",
      icon: <FiSettings size={22} />,
      route: "/collection-management/controls",
    },
    {
      title: "Map Client with Collection Team",
      description:
        "Assign clients to internal collection teams for efficient case handling.",
      icon: <FiUsers size={22} />,
      route: "/collection-management/client-team-mapping",
    },
    {
      title: "Map Client with Collection Agents",
      description:
        "Map individual collection agents to clients with region-based allocation.",
      icon: <FiUserCheck size={22} />,
      route: "/collection-management/client-agent-mapping",
    },
    {
      title: "Payout Management",
      description:
        "Define payout structures for agents or partners including commission and cycles.",
      icon: <FiDollarSign size={22} />,
      route: "/collection-management/payouts",
    },
  ];

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold">
          Collection Management
        </h1>
        <p className="text-sm text-gray-500">
          Configure payment collections, agents, teams, and payout rules
        </p>
      </div>

      {/* MODULE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100
                       hover:shadow-md transition cursor-pointer"
            onClick={() => navigate(item.route)}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                {item.icon}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-blue-600 font-medium">
              Manage →
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
