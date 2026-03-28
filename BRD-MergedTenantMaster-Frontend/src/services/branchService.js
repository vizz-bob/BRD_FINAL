import axiosInstance from "../utils/axiosInstance";

export const branchAPI = {
  // GET all branches
  getAll: async () => {
    const res = await axiosInstance.get("branches/branches/");
    return res.data;
  },

  // GET branch by ID
  getById: async (id) => {
    const res = await axiosInstance.get(`branches/branches/${id}/`);
    return res.data;
  },

  // CREATE branch
  create: async (data) => {
    const res = await axiosInstance.post("branches/branches/", data);
    return res.data;
  },

  // UPDATE branch
  update: async (id, data) => {
    const res = await axiosInstance.put(`branches/branches/${id}/`, data);
    return res.data;
  },

  // DELETE branch
  delete: async (id) => {
    const res = await axiosInstance.delete(`branches/branches/${id}/`);
    return res.data;
  },
};

export const businessAPI = {
  getAll: async () => {
    const res = await axiosInstance.get("businesses/"); // Adjust endpoint if different
    return res.data;
  },
};

export const productAPI = {
  getAll: async () => {
    const res = await axiosInstance.get("product/"); // Adjust endpoint if different
    return res.data;
  },
};