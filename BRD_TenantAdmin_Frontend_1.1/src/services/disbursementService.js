import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "disbursement";

export const disbursementAPI = {
  /**
   * Fetch loan accounts pending for disbursement
   * GET /api/v1/disbursement/disbursement-queue/
   */
  getQueue: async () => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/disbursement-queue/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching disbursement queue:", error);
      throw error.response?.data || "Failed to fetch disbursement queue";
    }
  },

  /**
   * Trigger loan disbursement
   * POST /api/v1/disbursement/disburse/<loan_account_id>/
   */
  disburse: async (loanAccountId) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/disburse/${loanAccountId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error during loan disbursement:", error);
      throw error.response?.data || "Disbursement failed";
    }
  },
};
