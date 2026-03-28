import axios from "axios";

// Vite proxy forwards /api/* → http://127.0.0.1:8000/api/*
// Django main urls.py: path('api/dashboard/', include('dashboard.urls'))
// App router registers: tasks/ and dashboard/
// Final URLs: /api/dashboard/tasks/ and /api/dashboard/dashboard/
const API_BASE_URL = "/api/dashboard";

const dashboardAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// ================================
// 📊 OPERATIONS DASHBOARD API
// ================================

export const getDashboardSummary = async () => {
  const response = await dashboardAPI.get("/dashboard/");
  return response.data;
};

export const getDashboardById = async (id) => {
  const response = await dashboardAPI.get(`/dashboard/${id}/`);
  return response.data;
};

export const createDashboardSummary = async (data) => {
  const response = await dashboardAPI.post("/dashboard/", data);
  return response.data;
};

export const updateDashboardSummary = async (id, data) => {
  const response = await dashboardAPI.put(`/dashboard/${id}/`, data);
  return response.data;
};

export const deleteDashboardSummary = async (id) => {
  const response = await dashboardAPI.delete(`/dashboard/${id}/`);
  return response.data;
};


// ================================
// 📌 PENDING TASK API
// ================================

export const getAllTasks = async () => {
  const response = await dashboardAPI.get("/tasks/");
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await dashboardAPI.get(`/tasks/${id}/`);
  return response.data;
};

export const createTask = async (data) => {
  const response = await dashboardAPI.post("/tasks/", data);
  return response.data;
};

export const updateTask = async (id, data) => {
  const response = await dashboardAPI.put(`/tasks/${id}/`, data);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await dashboardAPI.delete(`/tasks/${id}/`);
  return response.data;
};

// ================================
// 📌SLA API
// ================================


export const getslaalerts = async () => {
  const response = await dashboardAPI.get("/slaalerts/");
  return response.data;
};

export const getsslaalerts = async (id) => {
  const response = await dashboardAPI.get(`/slaalerts/${id}/`);
  return response.data;
};

export const createslaalerts = async (data) => {
  const response = await dashboardAPI.post("/slaalerts/", data);
  return response.data;
};

export const updateslaalerts = async (id, data) => {
  const response = await dashboardAPI.put(`/slaalerts/${id}/`, data);
  return response.data;
};

export const deleteslaalerts = async (id) => {
  const response = await dashboardAPI.delete(`/slaalerts/${id}/`);
  return response.data;
};