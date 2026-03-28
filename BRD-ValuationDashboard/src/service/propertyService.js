import axios from "axios";

const PROPERTY_CHECK_BASE = "http://127.0.0.1:8000/api/property_check";
const PROPERTY_STATUS_BASE = "http://127.0.0.1:8000/property_status";

export const getPropertyChecks = () => {
  return axios.get(`${PROPERTY_CHECK_BASE}/property-checks/`);
};

export const createPropertyCheck = (data) => {
  return axios.post(`${PROPERTY_CHECK_BASE}/property-checks/`, data);
};

export const getPropertyCheckById = (id) => {
  return axios.get(`${PROPERTY_CHECK_BASE}/property-checks/${id}/`);
};

export const updatePropertyCheck = (id, data) => {
  return axios.put(`${PROPERTY_CHECK_BASE}/property-checks/${id}/`, data);
};

export const deletePropertyCheck = (id) => {
  return axios.delete(`${PROPERTY_CHECK_BASE}/property-checks/${id}/`);
};

export const getDashboard = () => {
  return axios.get(`${PROPERTY_CHECK_BASE}/dashboard/`);
};

export const createDashboard = (data) => {
  return axios.post(`${PROPERTY_CHECK_BASE}/dashboard/`, data);
};

export const getDashboardById = (id) => {
  return axios.get(`${PROPERTY_CHECK_BASE}/dashboard/${id}/`);
};

export const getPendingProperties = () => {
  return axios.get(`${PROPERTY_STATUS_BASE}/property-pending/`);
};

export const createPendingProperty = (data) => {
  return axios.post(`${PROPERTY_STATUS_BASE}/property-pending/`, data);
};

export const updatePendingProperty = (id, data) => {
  return axios.put(`${PROPERTY_STATUS_BASE}/property-pending/${id}/`, data);
};

export const deletePendingProperty = (id) => {
  return axios.delete(`${PROPERTY_STATUS_BASE}/property-pending/${id}/`);
};

export const getInProgressProperties = () => {
  return axios.get(`${PROPERTY_STATUS_BASE}/property-in-progress/`);
};

export const createInProgressProperty = (data) => {
  return axios.post(`${PROPERTY_STATUS_BASE}/property-in-progress/`, data);
};

export const updateInProgressProperty = (id, data) => {
  return axios.put(`${PROPERTY_STATUS_BASE}/property-in-progress/${id}/`, data);
};

export const deleteInProgressProperty = (id) => {
  return axios.delete(`${PROPERTY_STATUS_BASE}/property-in-progress/${id}/`);
};

// -----------------------------
// Property Completed
// -----------------------------
export const getCompletedProperties = () => {
  return axios.get(`${PROPERTY_STATUS_BASE}/property-completed/`);
};

export const createCompletedProperty = (data) => {
  return axios.post(`${PROPERTY_STATUS_BASE}/property-completed/`, data);
};

export const updateCompletedProperty = (id, data) => {
  return axios.put(`${PROPERTY_STATUS_BASE}/property-completed/${id}/`, data);
};

export const deleteCompletedProperty = (id) => {
  return axios.delete(`${PROPERTY_STATUS_BASE}/property-completed/${id}/`);
};

export const searchPropertyStatus = (params) => {
  return axios.get(`${PROPERTY_STATUS_BASE}/status-search/`, { params });
};
