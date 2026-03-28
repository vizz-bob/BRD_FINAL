// src/services/productLoanService.js
import axiosInstance from "../utils/axiosInstance";

/**
 * Django DRF routes:
 * GET    /api/v1/product/
 * GET    /api/v1/product/<id>/
 * POST   /api/v1/product/
 * PATCH  /api/v1/product/<id>/
 * DELETE /api/v1/product/<id>/
 */
const BASE_URL = "product/";

export const productLoanAPI = {
  // ✅ Get all products
  getAll() {
    return axiosInstance.get(BASE_URL);
  },

  // ✅ Get single product by ID
  getById(id) {
    return axiosInstance.get(`${BASE_URL}${id}/`);
  },

  // ✅ Create new product
  create(payload) {
    return axiosInstance.post(BASE_URL, payload);
  },

  // ✅ Partial update (PATCH)
  update(id, payload) {
    return axiosInstance.patch(`${BASE_URL}${id}/`, payload);
  },

  // ✅ Delete product
  remove(id) {
    return axiosInstance.delete(`${BASE_URL}${id}/`);
  },
};


