import { api } from "./api";

const BASE_URL = "/adminpanel/document-types/";

export const templateService = {
  async getTemplates() {
    try {
      const res = await api.get(BASE_URL);
      return res.data;
    } catch {
      return [];
    }
  },

  async addTemplate(template) {
    const res = await api.post(BASE_URL, template);
    return res.data;
  },

  async deleteTemplate(id) {
    await api.delete(`${BASE_URL}${id}/`);
    return true;
  }
};