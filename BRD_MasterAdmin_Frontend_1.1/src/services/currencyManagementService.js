import axiosInstance from "../utils/axiosInstance";

// Correct Django API URL
const BASE_URL = "/adminpanel/currency-management";

const currencyManagementService = {
  
  // ---------- GET ALL COUPONS ----------
  async getAll() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/currencies/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching currencies:", error);
      return [];
    }
  },

  // ---------- GET SINGLE COUPON ----------
  async getOne(uuid) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/currencies/${uuid}/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching currencies:", error);
      throw error;
    }
  },

  // ---------- CREATE COUPON ----------
  async create(data) {
    try {
      const res = await axiosInstance.post(`${BASE_URL}/currencies/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error creating currencies:", error);
      throw error;
    }
  },

  // ---------- UPDATE COUPON ----------
  async update(uuid, data) {
    try {
      const res = await axiosInstance.put(`${BASE_URL}/currencies/${uuid}/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error updating currencies:", error);
      throw error;
    }
  },

  // ---------- DELETE COUPON ----------
  async delete(uuid) {
    try {
      await axiosInstance.delete(`${BASE_URL}/currencies/${uuid}/`);
      return true;
    } catch (error) {
      console.error("❌ Error deleting coupon:", error);
      throw error;
    }
  }

};

export default currencyManagementService;
