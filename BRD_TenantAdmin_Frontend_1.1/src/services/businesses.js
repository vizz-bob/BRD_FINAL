import axiosInstance from "../utils/axiosInstance";

/**
 * Business Service
 * Handles all API calls related to Business module
 */
const BusinessService = {
  /**
   * Create a new business
   * @param {Object} payload
   * @returns {Promise}
   */
  createBusiness(payload) {
    return axiosInstance.post("/business/create/", payload);
  },

  /**
   * Fetch list of businesses
   * @param {Object} params (optional: pagination, filters)
   * @returns {Promise}
   */
  getBusinessList(params = {}) {
    return axiosInstance.get("/business/list/", { params });
  },

  /**
   * Utility: Build payload in backend-expected format
   */
  buildBusinessPayload(formData) {
    return {
      Business_name: formData.Business_name,
      pan_number: formData.pan_number,
      cin: formData.cin || null,
      gstin: formData.gstin,
      registered_address: formData.registered_address,
      mapped_loan_products: formData.mapped_loan_products || [],
      status: formData.status || "active",
    };
  },
};

export default BusinessService;
