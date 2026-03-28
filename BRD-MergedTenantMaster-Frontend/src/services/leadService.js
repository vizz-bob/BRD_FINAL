import axiosInstance from "../utils/axiosInstance";

export const leadService = {
  
  getAll: async (params) => {
    const response = await axiosInstance.get("/crm/leads/", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/crm/leads/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/crm/leads/", data);
    return response.data;
  },

  bulkUpload: async (formData) => {
    const response = await axiosInstance.post("/crm/leads/bulk-import/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.patch(`/crm/leads/${id}/`, data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/crm/leads/${id}/`, { status });
    return response.data;
  },

  logCall: async (id, notes) => {
    const response = await axiosInstance.post(`/crm/leads/${id}/log-call/`, { notes });
    return response.data;
  },

  convert: async (id) => {
    const response = await axiosInstance.post(`/crm/leads/${id}/convert/`);
    return response.data;
  }
};

export default leadService;