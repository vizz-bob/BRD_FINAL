// src/services/masterApiService.js
// ---------------------------------------------------------
// Tenant frontend (5173) → Master backend (8001)
//
// The products list endpoint is public (AllowAny) on master,
// so no Authorization header is needed or sent.
// Both projects have different AUTH_USER_MODEL so we avoid
// sending the tenant token to master entirely.
// ---------------------------------------------------------

import axios from "axios";

const MASTER_BASE_URL =
  import.meta.env.VITE_MASTER_API_BASE_URL || "http://127.0.0.1:8001";

const masterApi = axios.create({
  baseURL: `${MASTER_BASE_URL}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const masterProductService = {
  /**
   * Fetches all products from the master backend.
   * Used in Loans.jsx to populate the Loan Type dropdown.
   *
   * Endpoint: GET http://127.0.0.1:8001/api/v1/adminpanel/product-revenue/products/
   * Auth: AllowAny (public read)
   * Fields used: product_name, is_active
   */
  getProducts: () => masterApi.get("adminpanel/product-revenue/products/"),
};

