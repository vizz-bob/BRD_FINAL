import axiosInstance from "../utils/axiosInstance";
const BASE = "Support_And_Operations/" 
/**
 * Get all communications
 */
export const gettickets = () => {
  return axiosInstance.get(`${BASE}support/tickets/`);
};

/**
 * Get single communication by ID
 */
export const getticketsById = (id) => {
  return axiosInstance.get(`${BASE}support/tickets/${id}/`);
};


export const createtickets = (data) => {
  return axiosInstance.post(`${BASE}support/tickets/`, data);
};

/**
 * Update full communication (PUT)
 */
export const updatetickets = (id, data) => {
  return axiosInstance.put(`${BASE}support/tickets/${id}/`, data);
};

/**
 * Partial update (PATCH)
 */
export const patchtickets = (id, data) => {
  return axiosInstance.patch(`${BASE}support/tickets/${id}/`, data);
};

/**
 * Delete communication
 */
export const deletetickets = (id) => {
  return axiosInstance.delete(`${BASE}support/tickets/${id}/`);
};
