import axiosInstance from "../utils/axiosInstance";
const BASE = "Support_And_Operations/"

const toList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

/**
 * Get all communications (with optional query params for filtering)
 * e.g. getFilteredCommunications({ conversation_type: 'external', lead_id: '5' })
 */
export const getCommunications = (params = {}) => {
  return axiosInstance.get(`${BASE}communication/communications/`, { params });
};

export const getExternalCommunications = (leadId) => {
  const params = { conversation_type: "external" };
  if (leadId) params.lead_id = leadId;
  return axiosInstance.get(`${BASE}communication/communications/`, { params });
};

export const getInternalCommunications = () => {
  return axiosInstance.get(`${BASE}communication/communications/`, {
    params: { conversation_type: "internal" },
  });
};

export const getTimelineCommunications = async () => {
  const [externalRes, internalRes] = await Promise.all([
    getExternalCommunications(),
    getInternalCommunications(),
  ]);

  return [...toList(externalRes.data), ...toList(internalRes.data)];
};

export const getCommunicationStats = async () => {
  const response = await getCommunications();
  const rows = toList(response.data);

  const now = Date.now();
  const oneDayAgo = now - (24 * 60 * 60 * 1000);
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

  const parseTs = (value) => {
    const ts = Date.parse(value || '');
    return Number.isNaN(ts) ? 0 : ts;
  };

  return {
    totalMessages: rows.length,
    activeChats: rows.filter((row) => (
      row.conversation_type === 'internal' && parseTs(row.timestamp) >= oneDayAgo
    )).length,
    pendingCalls: rows.filter((row) => (
      (row.mode === 'call' || row.mode === 'meet') &&
      (row.status === 'sent' || row.status === 'not_read')
    )).length,
    emailsSent: rows.filter((row) => (
      row.mode === 'email' && parseTs(row.timestamp) >= sevenDaysAgo
    )).length,
  };
};

/**
 * Get single communication by ID
 */
export const getCommunicationById = (id) => {
  return axiosInstance.get(`${BASE}communication/communications/${id}/`);
};

/**
 * Create new communication
 */
export const createCommunication = (data) => {
  return axiosInstance.post(`${BASE}communication/communications/`, data);
};

/**
 * Update full communication (PUT)
 */
export const updateCommunication = (id, data) => {
  return axiosInstance.put(`${BASE}communication/communications/${id}/`, data);
};

/**
 * Partial update (PATCH)
 */
export const patchCommunication = (id, data) => {
  return axiosInstance.patch(`${BASE}communication/communications/${id}/`, data);
};

/**
 * Delete communication
 */
export const deleteCommunication = (id) => {
  return axiosInstance.delete(`${BASE}communication/communications/${id}/`);
};
