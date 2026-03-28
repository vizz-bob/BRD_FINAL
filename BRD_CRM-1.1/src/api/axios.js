import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/", // backend base URL
  withCredentials: true, // 🔑 send cookies for CSRF
});

api.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();
  const safeMethod = ["get", "head", "options"].includes(method);

  if (!safeMethod) {
    const token = Cookies.get("csrftoken");
    if (token) {
      config.headers["X-CSRFToken"] = token;
    }

    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
  } else if (config.headers) {
    delete config.headers["Content-Type"];
    delete config.headers["X-CSRFToken"];
  }

  return config;
});

export default api;
