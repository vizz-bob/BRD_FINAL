import axiosInstance from "../utils/axiosInstance";

// ✅ Fixed: added trailing slash — consistent with loanAccountService BASE_URL pattern
const BASE_URL = "lms/loan-accounts/";

export const disbursementAPI = {

  getQueue: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}disbursement-queue/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching disbursement queue:", error);
      throw error.response?.data || "Failed to fetch disbursement queue";
    }
  },

  disburse: async (loanAccountId) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}${loanAccountId}/disburse-now/`);
      return response.data;
    } catch (error) {
      console.error("Error during loan disbursement:", error);
      throw error.response?.data || "Disbursement failed";
    }
  },

  listAccounts: async (filters = {}) => {
    try {
      const response = await axiosInstance.get(BASE_URL, { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching loan accounts:", error);
      throw error.response?.data || "Failed to fetch loan accounts";
    }
  },

  getAccountDetails: async (loanAccountId) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}${loanAccountId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching loan account details:", error);
      throw error.response?.data || "Failed to fetch account details";
    }
  },

};