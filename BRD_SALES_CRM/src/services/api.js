import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetches the main pipeline data from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of pipeline columns.
 */
export const getPipelineData = async () => {
  const response = await apiClient.get("/leads/");
  const allLeads = response.data.results || response.data || [];

  const stageMap = {
    'new': 'New',
    'contacted': 'Contacted',
    'qualified': 'Contacted',
    'application': 'Application Submitted',
    'docs_pending': 'Application Submitted',
    'approved': 'Approved',
    'disbursed': 'Disbursed',
    'rejected': 'Disbursed'
  };

  const pipeline = [
    { stage: 'New', leads: [] },
    { stage: 'Contacted', leads: [] },
    { stage: 'Application Submitted', leads: [] },
    { stage: 'Approved', leads: [] },
    { stage: 'Disbursed', leads: [] }
  ];

  allLeads.forEach(lead => {
    const uiStage = stageMap[lead.stage] || 'New';
    const col = pipeline.find(c => c.stage === uiStage);
    if (col) {
      col.leads.push({
        id: lead.id,
        name: lead.borrower_name,
        loan: lead.loan_product_display,
        amount: `₹${new Intl.NumberFormat('en-IN').format(lead.ticket_size)}`,
        timeAgo: new Date(lead.applied_at).toLocaleDateString(),
      });
    }
  });

  return pipeline;
};

/**
 * Updates the stage of a specific lead in the backend.
 * @param {string|number} leadId - The ID of the lead to update.
 * @param {string} newStage - The new stage for the lead (UI stage name).
 * @returns {Promise<Object>} A promise that resolves with the updated lead data.
 */
export const updateLeadStage = async (leadId, newStage) => {
  const reverseStageMap = {
    'New': 'new',
    'Contacted': 'contacted',
    'Application Submitted': 'application',
    'Approved': 'approved',
    'Disbursed': 'disbursed'
  };

  const backendStage = reverseStageMap[newStage] || 'new';
  const response = await apiClient.patch(`/leads/${leadId}/`, { stage: backendStage });
  return response.data;
};

/**
 * Triggers a sync for a specific CRM integration.
 * @param {string} integrationName - The name of the CRM to sync.
 * @returns {Promise<Object>} A promise that resolves when the sync is complete.
 */
export const syncCrmIntegration = async (integrationName) => {
  // Mocking CRM sync as there's no backend for this yet, but we'll leave it as a placeholder.
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { success: true };
};

