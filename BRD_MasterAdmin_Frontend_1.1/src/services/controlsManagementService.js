import axiosInstance from "../utils/axiosInstance";

const BASE = "/adminpanel/controls-management";

const resources = [
  "languages",
  "geo-locations",
  "login-auth",
  "co-applicants",
  "login-fees",
  "joint-applicants",
  "references",
  "verifications",
  "application-process",
  "score-card-ratings"
];

const createResourceService = (resource) => ({
  list: async () => {
    try {
      const res = await axiosInstance.get(`${BASE}/${resource}/`);
      return res.data || [];
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      return [];
    }
  },

  retrieve: async (id) => {
    try {
      const res = await axiosInstance.get(`${BASE}/${resource}/${id}/`);
      return res.data || null;
    } catch (error) {
      console.error(`Error retrieving ${resource} ${id}:`, error);
      return null;
    }
  },

  create: async (data) => {
    try {
      const res = await axiosInstance.post(`${BASE}/${resource}/`, data);
      return res.data || null;
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      return null;
    }
  },

  update: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${BASE}/${resource}/${id}/`, data);
      return res.data || null;
    } catch (error) {
      console.error(`Error updating ${resource} ${id}:`, error);
      return null;
    }
  },

  partialUpdate: async (id, data) => {
    try {
      const res = await axiosInstance.patch(`${BASE}/${resource}/${id}/`, data);
      return res.data || null;
    } catch (error) {
      console.error(`Error partially updating ${resource} ${id}:`, error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const res = await axiosInstance.delete(`${BASE}/${resource}/${id}/`);
      return res.status === 204;
    } catch (error) {
      console.error(`Error deleting ${resource} ${id}:`, error);
      return false;
    }
  }
});

export const controlsManagementService = resources.reduce((acc, resource) => {
  acc[resource.replace(/-/g, "_")] = createResourceService(resource);
  return acc;
}, {});
