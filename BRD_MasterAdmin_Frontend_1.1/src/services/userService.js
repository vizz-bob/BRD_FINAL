import axiosInstance from "../utils/axiosInstance";

// Keep BASE_URL as router path ending with a slash
const BASE_URL = "/adminpanel/user-management"; // ✅ trailing slash added

export const userService = {
  // GET ALL USERS
  async getUsers() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/list/`);
      return res.data; 
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  // GET SINGLE USER
  async getUser(id) {
    const res = await axiosInstance.get(`${BASE_URL}/${id}/`); // ✅ id with trailing slash
    return res.data;
  },

  // ADD USER
  async addUser(data) {
    const res = await axiosInstance.post(`${BASE_URL}/create/`, data); // ✅ POST to URL with trailing slash
    return res.data;
  },

  // UPDATE USER
  async updateUser(id, data) {
    const res = await axiosInstance.put(`${BASE_URL}/list/${id}/`, data); // ✅ trailing slash
    return res.data;
  },

  // DELETE USER
  async deleteUser(id) {
    return axiosInstance.delete(`${BASE_URL}/${id}/`); // ✅ trailing slash
  },
};
