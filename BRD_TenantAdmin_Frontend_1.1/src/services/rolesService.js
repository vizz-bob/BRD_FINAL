import axiosInstance from "../utils/axiosInstance";

// ✅ Corrected URL to match adminpanel/urls.py
const BASE_URL = "role/role/";

export const roleAPI = {
  async list() {
    return axiosInstance.get(BASE_URL);
  },
  async create(data) {
    return axiosInstance.post(BASE_URL, data);
  },
  async update(id, data) {
    return axiosInstance.put(`${BASE_URL}${id}/`, data);
  },
  async delete(id) {
    return axiosInstance.delete(`${BASE_URL}${id}/`);
  }
};