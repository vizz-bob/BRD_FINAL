import {
  ClipboardDocumentCheckIcon,
  ShieldExclamationIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const teamsData = [
  {
    id: "legal_verification",
    title: "Legal & Verification Dashboard",
    description: "Handles compliance, KYC, and document verification",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    id: "fraud_team",
    title: "Fraud Team Dashboard",
    description: "Monitors and investigates suspicious activities",
    icon: ShieldExclamationIcon,
  },
  {
    id: "valuation",
    title: "Valuation Dashboard",
    description: "Manages asset and collateral valuation",
    icon: PresentationChartLineIcon,
  },
  {
    id: "crm_sales",
    title: "CRM & Sales Dashboard",
    description: "Leads, opportunities, and sales pipelines",
    icon: UserGroupIcon,
  },
  {
    id: "finance",
    title: "Finance Dashboard",
    description: "Payments, invoicing, and financial reconciliation",
    icon: BanknotesIcon,
  },
  {
    id: "channel_partner",
    title: "Channel Partner Dashboard",
    description: "",
    icon: BanknotesIcon,
  },
  {
    id: "operation",
    title: "Operation Dashboard",
    description: "",
    icon: BanknotesIcon,
  },
];

// URL mapping for microservice dashboards
const dashboardUrls = {
  valuation: "http://localhost:5176",
  channel_partner: "http://localhost:5174",
  operation: "http://localhost:5175",
  finance: "http://localhost:5177",
  legal_verification: "http://localhost:5178",
  fraud_team: "http://localhost:5179",
  crm_sales: "http://localhost:5180",
};

export default function InternalTeamDashboards() {

  const handleNavigation = (teamId) => {
    if (dashboardUrls[teamId]) {
      window.location.href = dashboardUrls[teamId];
    }
  };

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
                onClick={() => handleNavigation(team.id)}
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