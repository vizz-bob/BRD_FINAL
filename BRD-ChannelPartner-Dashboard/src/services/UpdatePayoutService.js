import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/update/";

/* --------------------------------
   DASHBOARD APIs
-------------------------------- */

// Get all dashboard records
export const getPayoutDashboard = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Create dashboard record
export const createPayoutDashboard = async (data) => {
  const response = await axios.post(API_BASE_URL, data);
  return response.data;
};

// Get single dashboard record
export const getPayoutDashboardById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}${id}/`);
  return response.data;
};

// Update dashboard
export const updatePayoutDashboard = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}${id}/`, data);
  return response.data;
};

// Delete dashboard
export const deletePayoutDashboard = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}${id}/`);
  return response.data;
};



/* --------------------------------
   SEARCH APIs
-------------------------------- */

// Get all search records
export const getPayoutSearch = async () => {
  const response = await axios.get(`${API_BASE_URL}search/`);
  return response.data;
};

// Create search
export const createPayoutSearch = async (data) => {
  const response = await axios.post(`${API_BASE_URL}search/`, data);
  return response.data;
};

// Update search
export const updatePayoutSearch = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}search/${id}/`, data);
  return response.data;
};

// Delete search
export const deletePayoutSearch = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}search/${id}/`);
  return response.data;
};



/* --------------------------------
   AGENT APIs
-------------------------------- */

// Get all agents
export const getPayoutAgents = async () => {
  const response = await axios.get(`${API_BASE_URL}agents/`);
  return response.data;
};

// Create agent
export const createPayoutAgent = async (data) => {
  const response = await axios.post(`${API_BASE_URL}agents/`, data);
  return response.data;
};

// Get agent by id
export const getPayoutAgentById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}agents/${id}/`);
  return response.data;
};

// Update agent
export const updatePayoutAgent = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}agents/${id}/`, data);
  return response.data;
};

// Delete agent
export const deletePayoutAgent = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}agents/${id}/`);
  return response.data;
};
