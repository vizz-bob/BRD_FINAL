import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronRight,
  Link2,
  ChevronDown,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

import { leadService } from "../services/home";
import { useAuth } from "../context/AuthContext";

// --- Static Definitions (Can be moved or fetched later) ---
const quickFilterLabels = {
  all: "All Leads",
  new: "New Leads",
  contacted: "Contacted",
  highValue: "High Value",
};

// FIX: I've restored the original data here so the CRM sidebar isn't empty.
// You can replace this with a dynamic fetch later.
const crmIntegrations = [
  {
    name: "FreshSales CRM",
    status: "Synced every 15 min",
    badge: "Active",
    color: "text-brand-emerald",
    type: "auto",
    lastSync: "2024-01-15 14:30:00",
    description: "Automatic synchronization enabled",
  },
  {
    name: "LeadSquared",
    status: "Manual push available",
    badge: "On Demand",
    color: "text-brand-blue",
    type: "manual",
    lastSync: "2024-01-15 12:15:00",
    description: "Click to sync manually",
  },
  {
    name: "HubSpot Activities",
    status: "Reminders only",
    badge: "Passive",
    color: "text-brand-slate",
    type: "passive",
    lastSync: "2024-01-14 18:45:00",
    description: "Activity reminders only",
  },
];

const columnStyles = {
  New: "bg-slate-100 border-brand-blue/30",
  Contacted: "bg-slate-100 border-brand-sky/30",
  Qualified: "bg-slate-100 border-brand-blue/30",
  Application: "bg-slate-100 border-brand-emerald/30",
  "Docs Pending": "bg-slate-100 border-brand-navy/30",
  Approved: "bg-slate-100 border-emerald-200",
  Disbursed: "bg-slate-100 border-emerald-300",
};

const stageOrder = [
  "New",
  "Contacted",
  "Qualified",
  "Application",
  "Docs Pending",
  "Approved",
  "Disbursed",
];

export default function PipelinePage({ activeFilter, filterMeta }) {
  const [showAllStages, setShowAllStages] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pipelineData, setPipelineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [crmSyncStatus, setCrmSyncStatus] = useState({});
  const [showCrmDetails, setShowCrmDetails] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await leadService.getAll();
        const results = data.results || data;

        // Transform backend leads into pipeline columns
        const columns = stageOrder.map(stage => {
          const leadsInStage = results
            .filter(l => l.stage_display === stage || l.stage === stage.toLowerCase().replace(' ', '_'))
            .map(l => ({
              id: l.id,
              name: l.borrower_name,
              loan: l.loan_product_display,
              amount: `₹ ${parseFloat(l.ticket_size || 0).toLocaleString('en-IN')}`,
              timeAgo: new Date(l.updated_at).toLocaleDateString(),
              remarks: l.internal_remarks,
              phone: l.contact_number,
              email: l.email || `${l.borrower_name.toLowerCase().replace(' ', '.')}@example.com`
            }));

          return {
            stage,
            leads: leadsInStage
          };
        });

        setPipelineData(columns);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pipeline data:", err);
        setError("Failed to load pipeline. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const filteredPipelineData = useMemo(() => {
    if (!activeFilter || activeFilter === "all") return pipelineData;

    return pipelineData.map((column) => ({
      ...column,
      leads: column.leads.filter((lead) => {
        if (activeFilter === "new") return column.stage === "New";
        if (activeFilter === "contacted") return column.stage === "Contacted";
        if (activeFilter === "highValue") {
          const numericValue = parseInt(lead.amount.replace(/[^\d]/g, ""));
          return numericValue > 500000;
        }
        return true;
      }),
    }));
  }, [pipelineData, activeFilter]);

  const currentColumns = showAllStages ? pipelineData : filteredPipelineData;
  const filteredCount = currentColumns.reduce(
    (sum, col) => sum + col.leads.length,
    0
  );
  const filterLabel = activeFilter
    ? quickFilterLabels[activeFilter]
    : "All leads";

  const toggleViewAllStages = () => setShowAllStages(!showAllStages);
  const handleViewDetails = (lead, stage) => {
    setSelectedLead({ ...lead, currentStage: stage });
    setShowDetailsModal(true);
  };

  // FIX: Added the missing showNotification function
  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`;
    notification.innerHTML = `
      ${type === "success"
        ? '<CheckCircle className="h-4 w-4" />'
        : '<AlertCircle className="h-4 w-4" />'
      }
      <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handleMoveToNextStage = async (lead, currentStage) => {
    const currentStageIndex = stageOrder.indexOf(currentStage);
    if (currentStageIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentStageIndex + 1];
      const backendStageValue = nextStage.toLowerCase().replace(' ', '_');

      const originalPipelineData = [...pipelineData];

      const optimisticPipelineData = pipelineData.map((column) => {
        if (column.stage === currentStage) {
          return {
            ...column,
            leads: column.leads.filter((l) => l.id !== lead.id),
          };
        } else if (column.stage === nextStage) {
          return {
            ...column,
            leads: [...column.leads, { ...lead, timeAgo: "Just now" }],
          };
        }
        return column;
      });
      setPipelineData(optimisticPipelineData);

      try {
        await leadService.patch(lead.id, { stage: backendStageValue });
        showNotification(`${lead.name} moved to ${nextStage}`, "success");
      } catch (err) {
        console.error("Failed to update lead stage:", err);
        setPipelineData(originalPipelineData);
        showNotification(
          `Failed to move ${lead.name}. Please try again.`,
          "error"
        );
      }
    }
  };

  const handleCrmSync = async (integration) => {
    setCrmSyncStatus((prev) => ({ ...prev, [integration.name]: "syncing" }));
    try {
      await syncCrmIntegration(integration.name);
      setCrmSyncStatus((prev) => ({ ...prev, [integration.name]: "success" }));
      showNotification(`${integration.name} synced successfully`, "success");
    } catch (err) {
      console.error("CRM sync failed:", err);
      setCrmSyncStatus((prev) => ({ ...prev, [integration.name]: "error" }));
      showNotification(`${integration.name} sync failed`, "error");
    } finally {
      setTimeout(() => {
        setCrmSyncStatus((prev) => ({ ...prev, [integration.name]: null }));
      }, 3000);
    }
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedLead(null);
  };

  const closeCrmModal = () => {
    setShowCrmDetails(null);
  };

  const getSyncIcon = (integration) => {
    const status = crmSyncStatus[integration.name];
    if (status === "syncing")
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (status === "success")
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "error")
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-brand-blue" />
        <span className="ml-2 text-slate-600">Loading Pipeline...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
        <p className="text-red-600 font-semibold">
          Oops! Something went wrong.
        </p>
        <p className="text-slate-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      <section className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        <div
          className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${showAllStages ? "col-span-3" : "col-span-2"
            }`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="text-xs uppercase text-slate-400">Pipeline</p>
              <h2 className="text-lg font-semibold">Lead journey</h2>
              <p className="text-xs text-slate-500">
                Filter:{" "}
                <span className="font-semibold text-brand-blue">
                  {filterLabel}
                </span>
                <span className="text-slate-400">
                  {" "}
                  • {filteredCount} lead{filteredCount === 1 ? "" : "s"}
                </span>
              </p>
            </div>
            <button
              onClick={toggleViewAllStages}
              className="text-xs text-brand-blue flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
            >
              {showAllStages ? (
                <>
                  Compact view <ChevronDown className="h-4 w-4" />
                </>
              ) : (
                <>
                  View all stages <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto px-6 pb-6">
            <div
              className={`min-w-0 sm:min-w-[720px] ${showAllStages ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                } grid gap-4 pt-4`}
            >
              {/* FIX: Restored the complete JSX for the map function */}
              {currentColumns.map((column) => (
                <div
                  key={column.stage}
                  className={`rounded-2xl border ${columnStyles[column.stage] ||
                    "bg-slate-100 border-slate-100"
                    } p-4 bg-white/80 ${showAllStages ? "min-h-[400px]" : ""}`}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-brand-navy">
                      {column.stage}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {column.leads.length}
                    </span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {column.leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-slate-50 rounded-2xl p-3 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.loan}</p>
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                          <span>{lead.amount}</span>
                          <span>{lead.timeAgo}</span>
                        </div>
                        {showAllStages && (
                          <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between gap-2">
                            <button
                              onClick={() =>
                                handleViewDetails(lead, column.stage)
                              }
                              className="text-xs text-brand-blue font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" /> View details
                            </button>
                            <button
                              onClick={() =>
                                handleMoveToNextStage(lead, column.stage)
                              }
                              className="text-xs text-brand-blue font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                              disabled={column.stage === "Disbursed"}
                            >
                              <ArrowRight className="h-3 w-3" />{" "}
                              {column.stage === "Disbursed"
                                ? "Final stage"
                                : "Move to next"}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FIX: Restored the CRM Sync Sidebar JSX */}
        {!showAllStages && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-slate-400">CRM sync</p>
                <h2 className="text-lg font-semibold">Connected tools</h2>
              </div>
              <Link2 className="h-5 w-5 text-brand-blue" />
            </div>
            <div className="space-y-4">
              {crmIntegrations.map((integration) => (
                <div
                  key={integration.name}
                  className="border border-slate-100 rounded-2xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-xs text-slate-500">
                        {integration.status}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${integration.color}`}
                    >
                      {integration.badge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Last sync:{" "}
                      {integration.lastSync}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCrmSync(integration)}
                      disabled={crmSyncStatus[integration.name] === "syncing"}
                      className={`text-xs text-brand-blue font-semibold hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1 ${crmSyncStatus[integration.name] === "syncing"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                        }`}
                    >
                      {getSyncIcon(integration)}
                      {crmSyncStatus[integration.name] === "syncing"
                        ? "Syncing..."
                        : "Sync now"}
                    </button>
                    <button
                      onClick={() => setShowCrmDetails(integration)}
                      className="text-xs text-slate-600 hover:bg-slate-50 px-2 py-1 rounded transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-brand-blue/10 p-4">
              <p className="text-sm font-medium">
                Auto sync enabled for field app
              </p>
              <p className="text-xs text-slate-600">
                Offline capture queues data securely
              </p>
            </div>
          </div>
        )}
      </section>

      {/* FIX: Restored the Lead Details Modal JSX */}
      {showDetailsModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* ... (modal content remains the same) */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-brand-navy">
                Lead Details
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-brand-blue/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedLead.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Current Stage: {selectedLead.currentStage}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-slate-700">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>
                      {selectedLead.name.toLowerCase().replace(" ", ".")}
                      @example.com
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-slate-700">
                  Loan Information
                </h4>
                <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Loan Type:</span>
                    <span className="font-medium">{selectedLead.loan}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Amount:</span>
                    <span className="font-medium">{selectedLead.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Last Updated:</span>
                    <span className="font-medium">{selectedLead.timeAgo}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    handleMoveToNextStage(
                      selectedLead,
                      selectedLead.currentStage
                    );
                    closeModal();
                  }}
                  className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors text-sm font-medium"
                  disabled={selectedLead.currentStage === "Disbursed"}
                >
                  {selectedLead.currentStage === "Disbursed"
                    ? "Final Stage"
                    : "Move to Next Stage"}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIX: Restored the CRM Details Modal JSX */}
      {showCrmDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* ... (modal content remains the same) */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-brand-navy">
                {showCrmDetails.name}
              </h2>
              <button
                onClick={closeCrmModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Status:</span>
                  <span
                    className={`text-sm font-semibold ${showCrmDetails.color}`}
                  >
                    {showCrmDetails.badge}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Sync Type:</span>
                  <span className="text-sm font-medium capitalize">
                    {showCrmDetails.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Last Sync:</span>
                  <span className="text-sm font-medium">
                    {showCrmDetails.lastSync}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-600">
                  {showCrmDetails.description}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    handleCrmSync(showCrmDetails);
                    closeCrmModal();
                  }}
                  className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors text-sm font-medium"
                >
                  Sync Now
                </button>
                <button
                  onClick={closeCrmModal}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
