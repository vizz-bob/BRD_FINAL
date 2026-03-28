import axiosInstance from "../utils/axiosInstance";

/*
  BASE URL (adjust if your backend path differs)
  Example backend:
  /api/v1/charges/
*/
const BASE_URL = "/charges/";

export const chargeService = {
  /* ---------------- GET ALL CHARGES ---------------- */
  async getCharges(params = {}) {
    try {
      const res = await axiosInstance.get(BASE_URL, { params });
      return res.data;
    } catch (error) {
      // fail-safe: list pages should not crash
      return [];
    }
  },

  /* ---------------- GET SINGLE CHARGE ---------------- */
  async getChargeById(id) {
    if (!id) return null;

    try {
      const res = await axiosInstance.get(`${BASE_URL}${id}/`);
      return res.data;
    } catch (error) {
      return null;
    }
  },

  /* ---------------- ADD CHARGE ---------------- */
  async addCharge(payload) {
    try {
      const res = await axiosInstance.post(BASE_URL, payload);
      return res.data;
    } catch (error) {
      // let form handle validation errors
      throw error;
    }
  },

  /* ---------------- UPDATE CHARGE ---------------- */
  async updateCharge(id, payload) {
    if (!id) throw new Error("Charge ID is required");

    try {
      const res = await axiosInstance.patch(`${BASE_URL}${id}/`, payload);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /* ---------------- DELETE CHARGE ---------------- */
  async deleteCharge(id) {
    if (!id) throw new Error("Charge ID is required");

    try {
      await axiosInstance.delete(`${BASE_URL}${id}/`);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default chargeService;
