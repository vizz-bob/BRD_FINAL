import api from "../utils/axiosInstance";

export const productManagementService = {
  // GET all loan products
  async getProducts() {
    const response = await api.get("/adminpanel/product-revenue/products/");
    return response.data;
  },

  // GET single product
  async getProduct(id) {
    const response = await api.get(`/adminpanel/product-revenue/products/${id}/`);
    return response.data;
  },

  // CREATE product
  async createProduct(data) {
    const response = await api.post("/adminpanel/product-revenue/products/", data);
    return response.data;
  },

  // UPDATE product
  async updateProduct(id, data) {
    const response = await api.put(`/adminpanel/product-revenue/products/${id}/`, data);
    return response.data;
  },

  // DELETE product
  async deleteProduct(id) {
    const response = await api.delete(`/adminpanel/product-revenue/products/${id}/`);
    return response.data;
  },
};

export const productMixService = {
  // GET all product mixes
  async getProductMixes() {
    const response = await api.get("/adminpanel/product-revenue/product-mixes/");
    return response.data;
  },

  // GET single product mix
  async getProductMix(id) {
    const response = await api.get(`/adminpanel/product-revenue/product-mixes/${id}/`);
    return response.data;
  },

  // CREATE product mix
  async createProductMix(data) {
    const response = await api.post("/adminpanel/product-revenue/product-mixes/", data);
    return response.data;
  },

  // UPDATE product mix
  async updateProductMix(id, data) {
    const response = await api.put(`/adminpanel/product-revenue/product-mixes/${id}/`, data);
    return response.data;
  },

  // DELETE product mix
  async deleteProductMix(id) {
    const response = await api.delete(`/adminpanel/product-revenue/product-mixes/${id}/`);
    return response.data;
  },
};

// ===========================
// Additional Services
// ===========================
export const chargesService = {
  async getCharges() {
    const response = await api.get("/adminpanel/product-revenue/charges/");
    return response.data;
  },
  async getCharge(id) {
    const response = await api.get(`/adminpanel/product-revenue/charges/${id}/`);
    return response.data;
  },
  async createCharge(data) {
    const response = await api.post("/adminpanel/product-revenue/charges/", data);
    return response.data;
  },
  async updateCharge(id, data) {
    const response = await api.put(`/adminpanel/product-revenue/charges/${id}/`, data);
    return response.data;
  },
  async deleteCharge(id) {
    const response = await api.delete(`/adminpanel/product-revenue/charges/${id}/`);
    return response.data;
  },
};

export const feesService = {
  async getFees() {
    const response = await api.get("/adminpanel/product-revenue/fees/");
    return response.data;
  },
  async getFee(id) {
    const response = await api.get(`/adminpanel/product-revenue/fees/${id}/`);
    return response.data;
  },
  async createFee(data) {
    const response = await api.post("/adminpanel/product-revenue/fees/", data);
    return response.data;
  },
  async updateFee(id, data) {
    const response = await api.put(`/adminpanel/product-revenue/fees/${id}/`, data);
    return response.data;
  },
  async deleteFee(id) {
    const response = await api.delete(`/adminpanel/product-revenue/fees/${id}/`);
    return response.data;
  },
};

export const interestService = {
  async getInterests() {
    const response = await api.get("/adminpanel/product-revenue/interest/");
    return response.data;
  },
  async getInterest(id) {
    const response = await api.get(`/adminpanel/product-revenue/interest/${id}/`);
    return response.data;
  },
  async createInterest(data) {
    const response = await api.post("/adminpanel/product-revenue/interest/", data);
    return response.data;
  },
  async updateInterest(id, data) {
    const response = await api.put(`/adminpanel/product-revenue/interest/${id}/`, data);
    return response.data;
  },
  async deleteInterest(id) {
    const response = await api.delete(`/adminpanel/product-revenue/interest/${id}/`);
    return response.data;
  },
};

export const moratoriumService = {
  async getMoratoriums() {
    const response = await api.get("/adminpanel/product-revenue/moratoriums/");
    return response.data;
  },
  async getMoratorium(id) {
    const response = await api.get(`/adminpanel/product-revenue/moratoriums/${id}/`);
    return response.data;
  },
  async createMoratorium(data) {
    const response = await api.post("/adminpanel/product-revenue/moratoriums/", data);
    return response.data;
  },
  async updateMoratorium(id, data) {
    const response = await api.put(`/adminpanel/product-revenue/moratoriums/${id}/`, data);
    return response.data;
  },
  async deleteMoratorium(id) {
    const response = await api.delete(`/adminpanel/product-revenue/moratoriums/${id}/`);
    return response.data;
  },
};

export const penaltiesService = {
  async getPenalties() {
    const response = await api.get("/adminpanel/product-revenue/penalties/");
    return response.data;
  },
  async getPenalty(id) {
    const response = await api.get(`/adminpanel/product-revenue/penalties/${id}/`);
    return response.data;
  },
  async createPenalty(data) {
    const response = await api.post("/adminpanel/product-revenue/penalties/", data);
    return response.data;
  },
  async updatePenalty(id, data) {
    const response = await api.put(`/adminpanel/product-revenue/penalties/${id}/`, data);
    return response.data;
  },
  async deletePenalty(id) {
    const response = await api.delete(`/adminpanel/product-revenue/penalties/${id}/`);
    return response.data;
  },
};

export const repaymentsService = {
  async getRepayments() {
    const response = await api.get("/adminpanel/product-revenue/repayments/");
    return response.data;
  },
  async getRepayment(id) {
    const response = await api.get(`/adminpanel/product-revenue/repayments/${id}/`);
    return response.data;
  },
  async createRepayment(data) {
    const response = await api.post("/adminpanel/product-revenue/repayments/", data);
    return response.data;
  },
  async updateRepayment(id, data) {
    const response = await api.put(`/adminpanel/product-revenue/repayments/${id}/`, data);
    return response.data;
  },
  async deleteRepayment(id) {
    const response = await api.delete(`/adminpanel/product-revenue/repayments/${id}/`);
    return response.data;
  },
};
