// src/utils/axiosInstance.js
import axios from "axios";
import authService from "../services/authService";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000`
).replace(/\/$/, "");

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/`,
  withCredentials: false,
});


const noAuthUrls = [
  "/token/",
  "/token/refresh/",
  "/tenants/signup/",
];

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();

    if (
      token &&
      !noAuthUrls.some((url) => config.url && config.url.startsWith(url))
    ) {
      // Best practice for Axios 1.7+ Request Headers
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    config.headers.set("Content-Type", "application/json");
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (
      error.response?.status === 401 &&
      error.config &&
      !noAuthUrls.some((url) => error.config.url && error.config.url.startsWith(url))
    ) {
      console.warn("🔐 Token expired or invalid → Logging out");
      authService.logout();
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
