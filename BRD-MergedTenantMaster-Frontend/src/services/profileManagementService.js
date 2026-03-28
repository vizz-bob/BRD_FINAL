// src/services/profileManagementService.js
import axiosInstance from "../utils/axiosInstance";

// Base URL for Django API
const BASE_URL = "/adminpanel/profile-management";

const profileManagementService = {

  // ---------- VENDORS ----------
  async getAllVendors() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/vendors/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching vendors:", error);
      return [];
    }
  },

  async getVendor(id) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/vendors/${id}/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching vendor:", error);
      throw error;
    }
  },

  async createVendor(data) {
    try {
      const res = await axiosInstance.post(`${BASE_URL}/vendors/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error creating vendor:", error);
      throw error;
    }
  },

  async updateVendor(id, data) {
    try {
      const res = await axiosInstance.put(`${BASE_URL}/vendors/${id}/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error updating vendor:", error);
      throw error;
    }
  },

  async deleteVendor(id) {
    try {
      await axiosInstance.delete(`${BASE_URL}/vendors/${id}/`);
      return true;
    } catch (error) {
      console.error("❌ Error deleting vendor:", error);
      throw error;
    }
  },

  // ---------- AGENTS ----------
  async getAllAgents() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/agents/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching agents:", error);
      return [];
    }
  },

  async getAgent(id) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/agents/${id}/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching agent:", error);
      throw error;
    }
  },

  async createAgent(data) {
    try {
      const res = await axiosInstance.post(`${BASE_URL}/agents/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error creating agent:", error);
      throw error;
    }
  },

  async updateAgent(id, data) {
    try {
      const res = await axiosInstance.put(`${BASE_URL}/agents/${id}/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error updating agent:", error);
      throw error;
    }
  },

  async deleteAgent(id) {
    try {
      await axiosInstance.delete(`${BASE_URL}/agents/${id}/`);
      return true;
    } catch (error) {
      console.error("❌ Error deleting agent:", error);
      throw error;
    }
  },

  // ---------- CLIENTS ----------
  async getAllClients() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/clients/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching clients:", error);
      return [];
    }
  },

  async getClient(id) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/clients/${id}/`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching client:", error);
      throw error;
    }
  },

  async createClient(data) {
    try {
      const res = await axiosInstance.post(`${BASE_URL}/clients/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error creating client:", error);
      throw error;
    }
  },

  async updateClient(id, data) {
    try {
      const res = await axiosInstance.put(`${BASE_URL}/clients/${id}/`, data);
      return res.data;
    } catch (error) {
      console.error("❌ Error updating client:", error);
      throw error;
    }
  },

  async deleteClient(id) {
    try {
      await axiosInstance.delete(`${BASE_URL}/clients/${id}/`);
      return true;
    } catch (error) {
      console.error("❌ Error deleting client:", error);
      throw error;
    }
  },

};

export default profileManagementService;
