import { api } from "./api";

const BASE_URL = "/api/v1/adminpanel/module-access/";

export const moduleAccessService = {
  async add(payload) {
    const res = await api.post(BASE_URL, payload);
    return res.data;
  },

  async update(id, payload) {
    const res = await api.patch(`${BASE_URL}${id}/`, payload);
    return res.data;
  },

  async remove(id) {
    await api.delete(`${BASE_URL}${id}/`);
  },

  async getAll() {
    try {
      const res = await api.get(BASE_URL);
      return res.data;
    } catch {
      return [];
    }
  },
};