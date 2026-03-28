import api from "../utils/axiosInstance";

// =============================
// BANK FUND SERVICE
// =============================
export const bankFundService = {
  // ---------------------------
  // Banks
  // ---------------------------
  async getBanks() {
    const response = await api.get("/adminpanel/bank-funds-management/banks/");
    return response.data;
  },
  async getBank(id) {
    const response = await api.get(`/adminpanel/bank-funds-management/banks/${id}/`);
    return response.data;
  },
  async createBank(data) {
    const response = await api.post("/adminpanel/bank-funds-management/banks/", data);
    return response.data;
  },
  async updateBank(id, data) {
    const response = await api.put(`/adminpanel/bank-funds-management/banks/${id}/`, data);
    return response.data;
  },
  async deleteBank(id) {
    const response = await api.delete(`/adminpanel/bank-funds-management/banks/${id}/`);
    return response.data;
  },

  // ---------------------------
  // Bank Account Types
  // ---------------------------
  async getBankAccountTypes() {
    const response = await api.get("/bank-account-types/");
    return response.data;
  },
  async getBankAccountType(id) {
    const response = await api.get(`/bank-account-types/${id}/`);
    return response.data;
  },
  async createBankAccountType(data) {
    const response = await api.post("/bank-account-types/", data);
    return response.data;
  },
  async updateBankAccountType(id, data) {
    const response = await api.put(`/bank-account-types/${id}/`, data);
    return response.data;
  },
  async deleteBankAccountType(id) {
    const response = await api.delete(`/bank-account-types/${id}/`);
    return response.data;
  },

  // ---------------------------
  // Fund Types
  // ---------------------------
  async getFundTypes() {
    const response = await api.get("/adminpanel/bank-funds-management/fund-types/");
    return response.data;
  },
  async getFundType(id) {
    const response = await api.get(`/adminpanel/bank-funds-management/fund-types/${id}/`);
    return response.data;
  },
  async createFundType(data) {
    const response = await api.post("/adminpanel/bank-funds-management/fund-types/", data);
    return response.data;
  },
  async updateFundType(id, data) {
    const response = await api.put(`/adminpanel/bank-funds-management/fund-types/${id}/`, data);
    return response.data;
  },
  async deleteFundType(id) {
    const response = await api.delete(`/adminpanel/bank-funds-management/fund-types/${id}/`);
    return response.data;
  },

  // ---------------------------
  // Funds
  // ---------------------------
  async getFunds() {
    const response = await api.get("/adminpanel/bank-funds-management/funds/");
    return response.data;
  },
  async getFund(id) {
    const response = await api.get(`/adminpanel/bank-funds-management/funds/${id}/`);
    return response.data;
  },
  async createFund(data) {
    const response = await api.post("/adminpanel/bank-funds-management/funds/", data);
    return response.data;
  },
  async updateFund(id, data) {
    const response = await api.put(`/adminpanel/bank-funds-management/funds/${id}/`, data);
    return response.data;
  },
  async deleteFund(id) {
    const response = await api.delete(`/adminpanel/bank-funds-management/funds/${id}/`);
    return response.data;
  },

  // ---------------------------
  // Business Models
  // ---------------------------
  async getBusinessModels() {
    const response = await api.get("/adminpanel/bank-funds-management/business-models/");
    return response.data;
  },
  async getBusinessModel(id) {
    const response = await api.get(`/adminpanel/bank-funds-management/business-models/${id}/`);
    return response.data;
  },
  async createBusinessModel(data) {
    const response = await api.post("/adminpanel/bank-funds-management/business-models/", data);
    return response.data;
  },
  async updateBusinessModel(id, data) {
    const response = await api.put(`/adminpanel/bank-funds-management/business-models/${id}/`, data);
    return response.data;
  },
  async deleteBusinessModel(id) {
    const response = await api.delete(`/adminpanel/bank-funds-management/business-models/${id}/`);
    return response.data;
  },

  // ---------------------------
  // Portfolios
  // ---------------------------
  async getPortfolios() {
    const response = await api.get("/adminpanel/bank-funds-management/portfolios/");
    return response.data;
  },
  async getPortfolio(id) {
    const response = await api.get(`/adminpanel/bank-funds-management/portfolios/${id}/`);
    return response.data;
  },
  async createPortfolio(data) {
    const response = await api.post("/adminpanel/bank-funds-management/portfolios/", data);
    return response.data;
  },
  async updatePortfolio(id, data) {
    const response = await api.put(`/adminpanel/bank-funds-management/portfolios/${id}/`, data);
    return response.data;
  },
  async deletePortfolio(id) {
    const response = await api.delete(`/adminpanel/bank-funds-management/portfolios/${id}/`);
    return response.data;
  },

  // ---------------------------
  // Transaction Modes
  // ---------------------------
  async getTransactionModes() {
    const response = await api.get("/adminpanel/bank-funds-management/modes-of-bank/");
    return response.data;
  },
  async getTransactionMode(id) {
    const response = await api.get(`/adminpanel/bank-funds-management/modes-of-bank/${id}/`);
    return response.data;
  },
  async createTransactionMode(data) {
    const response = await api.post("/adminpanel/bank-funds-management/modes-of-bank/", data);
    return response.data;
  },
  async updateTransactionMode(id, data) {
    const response = await api.put(`/adminpanel/bank-funds-management/modes-of-bank/${id}/`, data);
    return response.data;
  },
  async deleteTransactionMode(id) {
    const response = await api.delete(`/adminpanel/bank-funds-management/modes-of-bank/${id}/`);
    return response.data;
  },

  // ---------------------------
  // Taxes
  // ---------------------------
  async getTaxes() {
    const response = await api.get("/adminpanel/bank-funds-management/taxes/");
    return response.data;
  },
  async getTax(id) {
    const response = await api.get(`/adminpanel/bank-funds-management/taxes/${id}/`);
    return response.data;
  },
  async createTax(data) {
    const response = await api.post("/adminpanel/bank-funds-management/taxes/", data);
    return response.data;
  },
  async updateTax(id, data) {
    const response = await api.put(`/adminpanel/bank-funds-management/taxes/${id}/`, data);
    return response.data;
  },
  async deleteTax(id) {
    const response = await api.delete(`/adminpanel/bank-funds-management/taxes/${id}/`);
    return response.data;
  },
};
