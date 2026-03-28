import axiosInstance from "../utils/axiosInstance";

// ✅ Fixed: removed leading slash — matches axiosInstance baseURL pattern
const BASE_URL = "adminpanel/organization-management";

export const organizationService = {

  async getOrganizations() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/organizations/`);
      return res.data;
    } catch (error) {
      console.error("Fetch Org Error:", error);
      return [];
    }
  },

  async getOrganization(id) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/organizations/${id}/`);
      return res.data;
    } catch (error) {
      console.error("Fetch Single Org Error:", error);
      throw error;
    }
  },

  async addOrganization(payload) {
    try {
      const res = await axiosInstance.post(`${BASE_URL}/organizations/`, payload);
      return res.data;
    } catch (error) {
      console.error("Add Org Error:", error);
      throw error;
    }
  },

  async updateOrganization(id, payload) {
    try {
      const res = await axiosInstance.patch(`${BASE_URL}/organizations/${id}/`, payload);
      return res.data;
    } catch (error) {
      console.error("Update Org Error:", error);
      throw error;
    }
  },

  async deleteOrganization(id) {
    try {
      await axiosInstance.delete(`${BASE_URL}/organizations/${id}/`);
      return true;
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  },

  async getOrganizationSummary() {
    try {
      // ✅ Fixed: resolved merge conflict — using updated URL from feature branch
      const res = await axiosInstance.get("dashboard/kpis-and-charts/");
      const kpis = res.data?.kpis || {};
      return {
        totalOrganizations: kpis.totalTenants || 0,
        totalBranches: kpis.totalBranches || 0,
        activeUsers: kpis.activeUsers || 0,
        pendingRequests: 0,
      };
    } catch (error) {
      return { totalOrganizations: 0, totalBranches: 0, activeUsers: 0, pendingRequests: 0 };
    }
  },
};