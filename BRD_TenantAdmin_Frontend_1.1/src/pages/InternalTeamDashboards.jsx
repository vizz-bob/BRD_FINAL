import {
  ClipboardDocumentCheckIcon,
  ShieldExclamationIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const teamsData = [
  {
    id: "legal_verification",
    title: "Legal & Verification",
    description: "Handles compliance, KYC, and document verification",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    id: "fraud_team",
    title: "Fraud Team",
    description: "Monitors and investigates suspicious activities",
    icon: ShieldExclamationIcon,
  },
  {
    id: "valuation",
    title: "Valuation",
    description: "Manages asset and collateral valuation",
    icon: PresentationChartLineIcon,
  },
  {
    id: "crm_sales",
    title: "CRM & Sales",
    description: "Leads, opportunities, and sales pipelines",
    icon: UserGroupIcon,
  },
  {
    id: "finance",
    title: "Finance",
    description: "Payments, invoicing, and financial reconciliation",
    icon: BanknotesIcon,
  },
];

export default function InternalTeamDashboards() {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            Dashboard & Role Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Configure and manage all internal team dashboards and their permissions.
          </p>
        </div>
      </div>

      {/* Team Cards Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="text-base sm:text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
          Internal Team Dashboards
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {teamsData.map((team) => {
            const Icon = team.icon;

            return (
              <button
                key={team.id}
                onClick={() => {
                  if (team.id === "valuation") {
                    window.location.href = "http://localhost:5173";
                  }
                }}
                className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm hover:shadow-md hover:bg-gray-50 text-left transition-all duration-200 active:scale-[0.98] group w-full"
              >
                <div className="flex items-center gap-3 mb-2 sm:mb-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-bold text-sm sm:text-base leading-tight">
                    {team.title}
                  </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {team.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}