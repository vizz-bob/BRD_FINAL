import { api } from "./api";

// ✅ Fix: '/api/v1' हटा दिया गया है
const BASE_URL = "/adminpanel/organization-management";

export const branchService = {

  // GET ALL BRANCHES
  async getBranches() {
    try {
      const res = await api.get(`${BASE_URL}/branches/`);
      return res.data;
    } catch (error) {
      console.error("Fetch Branches Error:", error);
      return [];
    }
  },

  // GET SINGLE BRANCH
  async getBranch(id) {
    try {
      const res = await api.get(`${BASE_URL}/branches/${id}/`);
      return res.data;
    } catch (error) {
      console.error("Fetch Single Branch Error:", error);
      throw error;
    }
  },

  // GET BRANCHES BY ORGANIZATION
  async getBranchesByOrg(orgId) {
    try {
      const res = await api.get(`${BASE_URL}/branches/`, { params: { tenant: orgId } });
      return res.data;
    } catch (error) {
      return [];
    }
  },

  // ADD NEW BRANCH
  async addBranch(data) {
    try {
      const res = await api.post(`${BASE_URL}/branches/`, data);
      return res.data;
    } catch (err) {
      console.error("Add Branch Error:", err.response?.data || err);
      throw err;
    }
  },

  // UPDATE BRANCH
  async updateBranch(id, updatedValues) {
    try {
      const res = await api.patch(`${BASE_URL}/branches/${id}/`, updatedValues);
      return res.data;
    } catch (error) {
      console.error("Update Branch Error:", error);
      throw error;
    }
  },

  // DELETE BRANCH
  async deleteBranch(id) {
    try {
      await api.delete(`${BASE_URL}/branches/${id}/`);
      return true;
    } catch (error) {
      return false;
    }
  },
};