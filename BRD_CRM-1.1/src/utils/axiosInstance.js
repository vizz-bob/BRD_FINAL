import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();
  const safeMethod = ["get", "head", "options"].includes(method);
  const token = Cookies.get("csrftoken");

  if (!safeMethod && token) {
    config.headers["X-CSRFToken"] = token;
  }

  if (!safeMethod && !(config.data instanceof FormData) && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  if (safeMethod && config.headers) {
    delete config.headers["Content-Type"];
    delete config.headers["X-CSRFToken"];
  }

  return config;
});

export default axiosInstance;