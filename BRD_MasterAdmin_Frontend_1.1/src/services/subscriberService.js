import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "adminpanel/subscription";

const subscriberService = {
  // ---------- GET ALL SUBSCRIBERS ----------
  async getAll() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/subscribers/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching subscribers:", error);
      return [];
    }
  },

  // ---------- GET SUBSCRIBER BY UUID ----------
  async getById(uuid) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/plans/${uuid}/`);
      return res.data;
    } catch (error) {
      console.error(`❌ Error fetching subscriber ${uuid}:`, error);
      return null;
    }
  },

  // ---------- CREATE SUBSCRIBER ----------
  async create(payload) {
    try {
      const res = await axiosInstance.post(BASE_URL, payload);
      return res.data;
    } catch (error) {
      console.error("❌ Error creating subscriber:", error);
      throw error;
    }
  },

  // ---------- UPDATE SUBSCRIBER ----------
  async update(uuid, payload) {
    try {
      const res = await axiosInstance.put(`${BASE_URL}${uuid}/`, payload);
      return res.data;
    } catch (error) {
      console.error(`❌ Error updating subscriber ${uuid}:`, error);
      throw error;
    }
  },

  // ---------- DELETE (SOFT DELETE) SUBSCRIBER ----------
  async delete(uuid) {
    try {
      const res = await axiosInstance.delete(`${BASE_URL}${uuid}/`);
      return res.data; // { message: "Subscriber soft-deleted successfully" }
    } catch (error) {
      console.error(`❌ Error deleting subscriber ${uuid}:`, error);
      throw error;
    }
  },
};

export default subscriberService;
