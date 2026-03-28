import axiosInstance from "../utils/axiosInstance";

// Correct Django API URL
const BASE_URL = "/adminpanel/coupon";

const couponService = {
  
  // ---------- GET ALL COUPONS ----------
  async getAll() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/coupons/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching coupons:", error);
      return [];
    }
  },

  // ---------- GET SINGLE COUPON ----------
  async getOne(uuid) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/coupons/${uuid}/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching coupon:", error);
      throw error;
    }
  },

  // ---------- CREATE COUPON ----------
  async create(data) {
    try {
      const res = await axiosInstance.post(`${BASE_URL}/coupons/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error creating coupon:", error);
      throw error;
    }
  },

  // ---------- UPDATE COUPON ----------
  async update(uuid, data) {
    try {
      const res = await axiosInstance.put(`${BASE_URL}/coupons/${uuid}/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error updating coupon:", error);
      throw error;
    }
  },

  // ---------- DELETE COUPON ----------
  async delete(uuid) {
    try {
      await axiosInstance.delete(`${BASE_URL}/coupons/${uuid}/`);
      return true;
    } catch (error) {
      console.error("❌ Error deleting coupon:", error);
      throw error;
    }
  }

};

export default couponService;
