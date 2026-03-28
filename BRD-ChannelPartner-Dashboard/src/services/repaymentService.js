import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/repayment";

/* ---------------------------------
   Recovery Records
   Django URLs:
     ""        → list / create
     "<pk>/"   → detail / update / delete
-----------------------------------*/

export const getRecoveryRecords = async () => {
  const response = await axios.get(`${API_BASE_URL}/`);
  return response.data;
};

export const createRecoveryRecord = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/`, data);
  return response.data;
};

export const getRecoveryRecord = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}/`);
  return response.data;
};

export const updateRecoveryRecord = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}/`, data);
  return response.data;
};

export const deleteRecoveryRecord = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}/`);
  return response.data;
};


/* ---------------------------------
   Dashboard
   Django URLs:
     "dashboard/"        → list / create
     "dashboard/<pk>/"   → detail
-----------------------------------*/

export const getDashboard = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/`);
  return response.data;
};

export const createDashboard = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/dashboard/`, data);
  return response.data;
};

export const getDashboardById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/${id}/`);
  return response.data;
};


/* ---------------------------------
   Recovery Search
   Django URLs:
     "recovery-search/"        → list / create
     "recovery-search/<pk>/"   → detail
-----------------------------------*/

export const getRecoverySearch = async () => {
  const response = await axios.get(`${API_BASE_URL}/recovery-search/`);
  return response.data;
};

export const createRecoverySearch = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/recovery-search/`, data);
  return response.data;
};

export const getRecoverySearchById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/recovery-search/${id}/`);
  return response.data;
};


/* ---------------------------------
   Edit Recovery
   Django URLs:
     "edit-recovery/"        → list / create
     "edit-recovery/<pk>/"   → detail / update / delete
-----------------------------------*/

export const getEditRecovery = async () => {
  const response = await axios.get(`${API_BASE_URL}/edit-recovery/`);
  return response.data;
};

export const createEditRecovery = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/edit-recovery/`, data);
  return response.data;
};

export const getEditRecoveryById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/edit-recovery/${id}/`);
  return response.data;
};

export const updateEditRecovery = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/edit-recovery/${id}/`, data);
  return response.data;
};

export const deleteEditRecovery = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/edit-recovery/${id}/`);
  return response.data;
};
