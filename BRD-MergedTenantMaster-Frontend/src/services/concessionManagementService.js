import axiosInstance from "../utils/axiosInstance";

// Django Router Base
const BASE_URL = "/adminpanel/concession-management";

const concessionManagementService = {
  /* ==============================
     CONCESSION TYPES
     ============================== */

  async getAllTypes() {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/concession-types/`
      );
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching concession types:", error);
      return [];
    }
  },

  async getType(uuid) {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/concession-types/${uuid}/`
      );
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching concession type:", error);
      throw error;
    }
  },

  async createType(data) {
    try {
      const res = await axiosInstance.post(
        `${BASE_URL}/concession-types/`,
        data
      );
      return res.data;
    } catch (error) {
      console.error("❌ Error creating concession type:", error);
      throw error;
    }
  },

  async updateType(uuid, data) {
    try {
      const res = await axiosInstance.put(
        `${BASE_URL}/concession-types/${uuid}/`,
        data
      );
      return res.data;
    } catch (error) {
      console.error("❌ Error updating concession type:", error);
      throw error;
    }
  },

  async deleteType(uuid) {
    try {
      await axiosInstance.delete(
        `${BASE_URL}/concession-types/${uuid}/`
      );
      return true;
    } catch (error) {
      console.error("❌ Error deleting concession type:", error);
      throw error;
    }
  },

  /* ==============================
     CONCESSION CATEGORIES
     ============================== */

  async getAllCategories() {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/concession-categories/`
      );
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching concession categories:", error);
      return [];
    }
  },

  async getCategory(uuid) {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/concession-categories/${uuid}/`
      );
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching concession category:", error);
      throw error;
    }
  },

  async createCategory(data) {
    try {
      const res = await axiosInstance.post(
        `${BASE_URL}/concession-categories/`,
        data
      );
      return res.data;
    } catch (error) {
      console.error("❌ Error creating concession category:", error);
      throw error;
    }
  },

  async updateCategory(uuid, data) {
    try {
      const res = await axiosInstance.put(
        `${BASE_URL}/concession-categories/${uuid}/`,
        data
      );
      return res.data;
    } catch (error) {
      console.error("❌ Error updating concession category:", error);
      throw error;
    }
  },

  async deleteCategory(uuid) {
    try {
      await axiosInstance.delete(
        `${BASE_URL}/concession-categories/${uuid}/`
      );
      return true;
    } catch (error) {
      console.error("❌ Error deleting concession category:", error);
      throw error;
    }
  },
};

export default concessionManagementService;
