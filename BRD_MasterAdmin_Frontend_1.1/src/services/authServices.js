import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  login: async (email, password) => {
    const res = await axios.post(`${BASE_URL}/api/v1/auth/login/`, { email, password });

    if (res.data.requires_2fa) {
      return { requires2FA: true };
    }

    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    localStorage.setItem("permissions", res.data.permissions);
  },

  verify2FA: async (email, code) => {
    const res = await axios.post(`${BASE_URL}/api/v1/users/2fa/login/`, {
      email,
      code,
    });

    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
  },

  signup: async (data) => {
    const response = await axios.post(`${BASE_URL}/api/v1/adminpanel/user-management/create/`, {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      role_id: "3a77b897-3752-453a-88ea-d5b5239ee764", // 🚧 DEV ONLY - Master Admin role
    });

    return response.data;
  },
};