import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000`
).replace(/\/$/, "");

const tenantInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/tenant/`,
  withCredentials: true,
});

tenantInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const tenantAPI = {
  getAll: () => tenantInstance.get("/"),
  getById: (id) => tenantInstance.get(`${id}/`),
  create: (data) => tenantInstance.post("/", data),
  update: (id, data) => tenantInstance.put(`${id}/`, data),
  delete: (id) => tenantInstance.delete(`${id}/`),
};
