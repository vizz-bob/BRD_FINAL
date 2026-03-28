import React from "react";
import { usePermissions } from "../hooks/usePermissions";

import Dashboard from "../pages/Dashboard.jsx";
import SalesDashboardView from "../pages/dashboards/SalesDashboardView.jsx";
import CreditDashboardView from "../pages/dashboards/CreditDashboardView.jsx";
import CollectionDashboardView from "../pages/dashboards/CollectionDashboardView.jsx";

import PersonaFocusWidget from "./PersonaFocusWidget.jsx";
import EscalationWidget from "./EscalationWidget.jsx";

export default function DashboardDispatcher() {
  const { roleType, loading } = usePermissions();

  if (loading) return (
    <div className="flex items-center justify-center p-8 sm:p-10 min-h-[200px]">
      <p className="text-center text-gray-500 text-sm sm:text-base">Initializing Workspace...</p>
    </div>
  );

  let DashboardComponent;
  switch (roleType) {
    case 'sales':
    case 'channel_partner':
      DashboardComponent = SalesDashboardView;
      break;
    case 'credit_manager':
    case 'underwriter':
      DashboardComponent = CreditDashboardView;
      break;
    case 'collection_agent':
      DashboardComponent = CollectionDashboardView;
      break;
    default:
      DashboardComponent = Dashboard;
      break;
  }

  return (
    <div className="flex flex-col w-full gap-4 sm:gap-6">

      {/* Persona Focus Widget — shown for non-admin roles */}
      {roleType !== 'admin' && (
        <div className="px-3 sm:px-0">
          <PersonaFocusWidget />
        </div>
      )}

      {/* Escalation Widget — shown for admin/manager only */}
      {(roleType === 'admin' || roleType === 'manager') && (
        <div className="px-3 sm:px-0">
          <EscalationWidget />
        </div>
      )}

      {/* Base Dashboard View */}
      <DashboardComponent />
    </div>
  );
}