import { api } from "./api";

const BASE_URL = "/api/v1/adminpanel/loan-policies/"; // Hypothetical endpoint

const defaultPolicy = {
  minAmount: 10000,
  maxAmount: 500000,
  // ... (keep defaults as fallback)
};

const loanPolicyService = {
  async getPolicy() {
    try {
      const res = await api.get(BASE_URL);
      // Backend should return the latest policy object
      return res.data || defaultPolicy;
    } catch (error) {
      return defaultPolicy; // Fallback to defaults on 404
    }
  },

  async savePolicy(policy) {
    try {
      const res = await api.post(BASE_URL, policy);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default loanPolicyService;