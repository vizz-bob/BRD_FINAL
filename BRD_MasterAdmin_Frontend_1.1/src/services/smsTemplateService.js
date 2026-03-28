import { api } from "./api";

const BASE_URL = "/api/v1/adminpanel/notification-templates/";

export const smsTemplateService = {
  // Get all templates
  async getTemplates() {
    try {
      const res = await api.get(BASE_URL);
      return res.data;
    } catch (error) {
      return [];
    }
  },

  // Add new template
  async addTemplate(payload) {
    try {
      const res = await api.post(BASE_URL, payload);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Update template
  async updateTemplate(id, updates) {
    try {
      const res = await api.patch(`${BASE_URL}${id}/`, updates);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete template
  async deleteTemplate(id) {
    try {
      await api.delete(`${BASE_URL}${id}/`);
      return true;
    } catch (error) {
      return false;
    }
  },
};