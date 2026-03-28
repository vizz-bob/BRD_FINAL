import axiosInstance from "../utils/axiosInstance";

export const activeLoanService = {


  getAll: async () => {

    try {

      const res = await axiosInstance.get("active-loans/");
      return res.data;
    } catch (error) {
      console.error("Error fetching active loans:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const res = await axiosInstance.get(`active-loans/${id}/`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching active loan ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const res = await axiosInstance.post("active-loans/", data);
      return res.data;
    } catch (error) {
      console.error("Error creating active loan:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const res = await axiosInstance.put(`active-loans/${id}/`, data);
      return res.data;
    } catch (error) {
      console.error(`Error updating active loan ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const res = await axiosInstance.delete(`active-loans/${id}/`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting active loan ${id}:`, error);
      throw error;
    }
  },
};