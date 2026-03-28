import api from "../utils/axiosInstance";

export const loanImprovementService = {
  // GET all loan improvements
  async getLoanImprovements() {
    const response = await api.get("/loan-improvements/");
    return response.data;
  },

  // GET single loan improvement by ID (placeholder for future use)
  async getLoanImprovement(id) {
    const response = await api.get(`/loan-improvements/${id}/`);
    return response.data;
  },

  // CREATE a new loan improvement
  async createLoanImprovement(data) {
    const response = await api.post("/loan-improvements/create/", data);
    return response.data;
  },

  // UPDATE a loan improvement by ID (placeholder for future use)
  async updateLoanImprovement(id, data) {
    const response = await api.put(`/loan-improvements/${id}/`, data);
    return response.data;
  },

  // DELETE a loan improvement by ID (placeholder for future use)
  async deleteLoanImprovement(id) {
    const response = await api.delete(`/loan-improvements/${id}/`);
    return response.data;
  },
};
