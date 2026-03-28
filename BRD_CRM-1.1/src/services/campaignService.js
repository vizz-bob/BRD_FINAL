import axios from "axios";
import Cookies from "js-cookie";

// -------------------------------------------------------
// AXIOS INSTANCE
// -------------------------------------------------------

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/campaignss/", // backend base URL
  withCredentials: true, // send cookies for CSRF
  headers: {
    "Content-Type": "application/json", // default for JSON
  },
});

API.interceptors.request.use((config) => {
  // const token = localStorage.getItem("user");
  // if (token) config.headers.Authorization = `Bearer ${token}`;

  const userRaw = localStorage.getItem("user");
if (userRaw && !userRaw.startsWith("{")) {
  config.headers.Authorization = `Bearer ${userRaw}`;
}

  const csrfToken = Cookies.get("csrftoken");
  if (csrfToken) config.headers["X-CSRFToken"] = csrfToken;  // always attach

  return config;
});

// -------------------------------------------------------
// CSRF UTILITY
// -------------------------------------------------------

const getCSRFToken = () => Cookies.get("csrftoken");

// -------------------------------------------------------
// GENERIC CRUD FACTORY WITH CSRF & FILE SUPPORT
// -------------------------------------------------------

const createCampaignService = (endpoint) => ({
  getAll: () => API.get(endpoint),
  getById: (id) => API.get(`${endpoint}${id}/`),

  create: (data) => {
  // If already FormData (pre-built by caller), send directly
  if (data instanceof FormData) {
    return API.post(endpoint, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  // Plain object — build FormData if file present
  let headers = {};
  let payload = data;

  const hasFile = Object.values(data).some(
    (val) => val instanceof File || val instanceof Blob
  );

  if (hasFile) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    payload = formData;
    headers["Content-Type"] = "multipart/form-data";
  }

  return API.post(endpoint, payload, { headers });
},

  update: (id, data) => {
    let headers = { "X-CSRFToken": getCSRFToken() };
    let payload = data;

    const hasFile = Object.values(data).some(
      (val) => val instanceof File || val instanceof Blob
    );

    if (hasFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      payload = formData;
      headers["Content-Type"] = "multipart/form-data";
    }

    return API.put(`${endpoint}${id}/`, payload, { headers });
  },

  partialUpdate: (id, data) =>
    API.patch(`${endpoint}${id}/`, data, {
      headers: { "X-CSRFToken": getCSRFToken() },
    }),

  delete: (id) =>
    API.delete(`${endpoint}${id}/`, {
      headers: { "X-CSRFToken": getCSRFToken() },
    }),

    launch: (id) => API.post(`${endpoint}${id}/launch/`),
});

// -------------------------------------------------------
// CAMPAIGN SERVICES
// -------------------------------------------------------

export const emailCampaignService = createCampaignService("email-campaigns/");
export const smsCampaignService = createCampaignService("sms-campaigns/");
export const dialerCampaignService = createCampaignService("dialer-campaigns/");
export const whatsappCampaignService = createCampaignService(
  "whatsapp-campaigns/"
);
export const voiceCampaignService = createCampaignService("voice-campaigns/");
export const socialMediaCampaignService = createCampaignService(
  "social-media-campaigns/"
);

// -------------------------------------------------------
// METADATA SERVICE
// -------------------------------------------------------

export const campaignMetadataService = {
  getMetadata: () => API.get("metadata/"),
};

// -------------------------------------------------------
// DEFAULT EXPORT
// -------------------------------------------------------

const campaignService = {
  emailCampaignService,
  smsCampaignService,
  dialerCampaignService,
  whatsappCampaignService,
  voiceCampaignService,
  socialMediaCampaignService,
  campaignMetadataService,
};

export default campaignService;
