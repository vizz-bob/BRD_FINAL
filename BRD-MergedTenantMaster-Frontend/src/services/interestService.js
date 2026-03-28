import { api } from "./api";

// Using ChargeMaster for fees/interest related settings
const BASE_URL = "/adminpanel/charges/"; 

export const interestService = {
  async getSettings() {
    try {
      const res = await api.get(BASE_URL);
      // You might need to transform this list into the structure your UI expects
      return { roiSlabs: res.data }; 
    } catch (error) {
      return {};
    }
  },

  async saveSettings(data) {
    // This might require a specific endpoint if 'settings' is a single object
    try {
      const res = await api.post(BASE_URL, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};