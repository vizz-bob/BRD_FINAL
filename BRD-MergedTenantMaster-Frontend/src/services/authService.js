import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Consistent Keys
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const PERMISSIONS_KEY = "permissions";

const authService = {
  // ---------------------------------------------
  // SAVE TOKENS
  // ---------------------------------------------
  saveTokens: (access, refresh) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },

  // ---------------------------------------------
  // GET ACCESS TOKEN
  // ---------------------------------------------
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_KEY);
  },

  // ---------------------------------------------
  // DECODE JWT
  // ---------------------------------------------
  decodeJwtPayload: (token) => {
    if (!token) return null;
    try {
      const base64 = token.split(".")[1];
      const payload = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(payload);
    } catch (e) {
      console.warn("JWT decode failed:", e);
      return null;
    }
  },

  // ---------------------------------------------
  // GET TENANT ID FROM TOKEN
  // ---------------------------------------------
  getTenantIdFromToken: () => {
    const token = authService.getAccessToken();
    const payload = authService.decodeJwtPayload(token);

    if (!payload) return null;

    return (
      payload.tenant ||
      payload.tenant_id ||
      payload.tenantId ||
      null
    );
  },

  // ---------------------------------------------
  // LOGOUT
  // ---------------------------------------------
  logout: () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/dashboard";
  },
};

export default authService;