import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "/adminpanel/subscription";

const subscriptionService = {
  // ---------- GET ALL PLANS ----------
  async getAll() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/plans/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching subscriptions:", error);
      return [];
    }
  },

  // ---------- GET SINGLE PLAN ----------
  async getOne(uuid) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/plans/${uuid}/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching subscription:", error);
      throw error;
    }
  },

  // ---------- CREATE PLAN ----------
  async create(data) {
    try {
      const res = await axiosInstance.post(`${BASE_URL}/plans/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error creating subscription:", error);
      throw error;
    }
  },

  // ---------- UPDATE PLAN ----------
  async update(uuid, data) {
    try {
      const res = await axiosInstance.put(`${BASE_URL}/plans/${uuid}/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error updating subscription:", error);
      throw error;
    }
  },

  // ---------- DELETE PLAN ----------
  async delete(uuid) {
    try {
      await axiosInstance.delete(`${BASE_URL}/plans/${uuid}/`);
      return true;
    } catch (error) {
      console.error("❌ Error deleting subscription:", error);
      throw error;
    }
  },

  // ---------- TENANT SIDE ----------
  getMySubscription: () => axiosInstance.get("subscriptions/my/"),
  upgradePlan: (planId) => axiosInstance.put("subscriptions/upgrade/", { plan: planId }),
  // takeAction: (action) => axiosInstance.post("subscriptions/action/", { action }), // TODO: Backend endpoint not implemented
};

export default subscriptionService;
export const subscriptionAPI = subscriptionService;
