// src/services/api.js
// ✅ Now integrated with your configured Axios Instance
import axiosInstance from "../utils/axiosInstance";

export const api = {
  get: (url, params) => axiosInstance.get(url, { params }),
  post: (url, data) => axiosInstance.post(url, data),
  put: (url, data) => axiosInstance.put(url, data),
  patch: (url, data) => axiosInstance.patch(url, data), // Added PATCH support
  delete: (url) => axiosInstance.delete(url),
};