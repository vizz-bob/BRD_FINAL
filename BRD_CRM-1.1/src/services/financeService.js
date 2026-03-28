import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

/* =========================================================
   BASE PATH
========================================================= */
const BASE = "Finance_And_Analytics/";

/* =========================================================
   LOAN LEDGER SERVICES
========================================================= */
export const LoanService = {
   getAll: () => axiosInstance.get(`${BASE}loans/`),
   getById: (id) => axiosInstance.get(`${BASE}loans/${id}/`),
   create: (data) => axiosInstance.post(`${BASE}loans/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}loans/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}loans/${id}/`),
};

/* =========================================================
   REPAYMENT SERVICES
========================================================= */
export const RepaymentService = {
   getAll: () => axiosInstance.get(`${BASE}repayments/`),
   getById: (id) => axiosInstance.get(`${BASE}repayments/${id}/`),
   create: (data) => axiosInstance.post(`${BASE}repayments/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}repayments/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}repayments/${id}/`),
   uploadRecipt: (id, formData) =>
   axiosInstance.post(
      `${BASE}repayments/${id}/upload-receipt/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
   )
};

/* =========================================================
   COLLECTION BUCKET SERVICES
========================================================= */
export const CollectionService = {
   getAll: () => axiosInstance.get(`${BASE}collections/`),
   getById: (id) => axiosInstance.get(`${BASE}collections/${id}/`),
   create: (data) => axiosInstance.post(`${BASE}collections/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}collections/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}collections/${id}/`),
   esclateToRecovery: (id) => axiosInstance.post(`${BASE}collections/${id}/escalate/`),
};

/* =========================================================
   PROMISE TO PAY (PTP)
========================================================= */
export const PTPService = {
   getAll: () => axiosInstance.get(`${BASE}ptp/`),
   getById: (id) => axiosInstance.get(`${BASE}ptp/${id}/`),
   create: (data) => axiosInstance.post(`${BASE}ptp/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}ptp/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}ptp/${id}/`),
};

/* =========================================================
   INTERACTIONS
========================================================= */
export const InteractionService = {
   getAll: () => axiosInstance.get(`${BASE}interactions/`),
   getById: (id) => axiosInstance.get(`${BASE}interactions/${id}/`),
   create: (data) => axiosInstance.post(`${BASE}interactions/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}interactions/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}interactions/${id}/`),
};

/* =========================================================
   RECOVERY CASE
========================================================= */
export const RecoveryService = {
   getAll: () => axiosInstance.get(`${BASE}recovery/`),
   getById: (id) => axiosInstance.get(`${BASE}recovery/${id}/`),
   create: (data) => axiosInstance.post(`${BASE}recovery/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}recovery/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}recovery/${id}/`),
   markSettled: (id) => axiosInstance.post(`${BASE}recovery/${id}/mark-settled/`),
   uploadDocument: (id, formData) =>
   axiosInstance.post(
      `${BASE}recovery/${id}/upload-document/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
   )
};

/* =========================================================
   TARGET SERVICES
========================================================= */
export const TargetService = {
   getAll: () => axiosInstance.get(`${BASE}targets/`),
   overView: () => axiosInstance.get(`${BASE}targets/overview/`),
   getById: (id) => axiosInstance.get(`${BASE}targets/${id}/`),
   create: (data) => axiosInstance.post(`${BASE}targets/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}targets/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}targets/${id}/`),
};

/* =========================================================
   ACTIVITY TARGET
========================================================= */
export const ActivityTargetService = {
   overView: () => axiosInstance.get(`${BASE}activity-targets/summary/`),
   getAll: () => axiosInstance.get(`${BASE}activity-targets/`),
   create: (data) => axiosInstance.post(`${BASE}activity-targets/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}activity-targets/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}activity-targets/${id}/`),
};

/* =========================================================
   CONVERSION TARGET
========================================================= */
export const ConversionTargetService = {
   overView: () => axiosInstance.get(`${BASE}conversion-targets/summary/`),
   getAll: () => axiosInstance.get(`${BASE}conversion-targets/`),
   create: (data) => axiosInstance.post(`${BASE}conversion-targets/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}conversion-targets/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}conversion-targets/${id}/`),
};

/* =========================================================
   FINANCIAL TARGET
========================================================= */
export const FinancialTargetService = {
   getAll: () => axiosInstance.get(`${BASE}financial-targets/`),
   overView: () => axiosInstance.get(`${BASE}financial-targets/summary/`),
   create: (data) => axiosInstance.post(`${BASE}financial-targets/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}financial-targets/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}financial-targets/${id}/`),
};

/* =========================================================
   CAMPAIGN ROI
========================================================= */
export const CampaignROIService = {
   getAll: () => axiosInstance.get(`${BASE}campaign-roi/`),
   create: (data) => axiosInstance.post(`${BASE}campaign-roi/`, data),
   update: (id, data) => axiosInstance.put(`${BASE}campaign-roi/${id}/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}campaign-roi/${id}/`),
};

/* =========================================================
   TARGET HISTORY
========================================================= */
export const TargetHistoryService = {
   overView: () => axiosInstance.get(`${BASE}target-history/summary/`),
   getAll: () => axiosInstance.get(`${BASE}target-history/`),
   create: (data) => axiosInstance.post(`${BASE}target-history/`, data),
   delete: (id) => axiosInstance.delete(`${BASE}target-history/${id}/`),
};

/* =========================================================
   FORECAST SERVICES  (CRUD + Analytics)
========================================================= */
export const ForecastService = {
   // --- CRUD ---
   getAll: ()          => axiosInstance.get(`${BASE}forecasts/`),
   getById: (id)       => axiosInstance.get(`${BASE}forecasts/${id}/`),
   create: (data)      => axiosInstance.post(`${BASE}forecasts/`, data),
   update: (id, data)  => axiosInstance.put(`${BASE}forecasts/${id}/`, data),
   delete: (id)        => axiosInstance.delete(`${BASE}forecasts/${id}/`),

   // --- Analytics ---
   overview:          ()       => axiosInstance.get(`${BASE}forecasts/overview/`),
   trends:            (period) => axiosInstance.get(`${BASE}forecasts/trends/?period=${period || 'WEEKLY'}`),
   campaignBreakdown: ()       => axiosInstance.get(`${BASE}forecasts/campaign_breakdown/`),
   leadFunnel:        ()       => axiosInstance.get(`${BASE}forecasts/lead_funnel/`),
   agentPerformance:  ()       => axiosInstance.get(`${BASE}forecasts/agent_performance/`),

   // --- Exports ---
   exportAgents:    (fmt = 'csv', options = {}) => axiosInstance.get(`${BASE}forecasts/export_agents/`, {
      params: {
         export_format: fmt,
         include_details: options.includeDetails ?? true,
      },
      responseType: 'blob'
   }),
   exportCampaigns: (fmt = 'csv') => axiosInstance.get(`${BASE}forecasts/export_campaigns/?export_format=${fmt}`, { responseType: 'blob' }),
};
