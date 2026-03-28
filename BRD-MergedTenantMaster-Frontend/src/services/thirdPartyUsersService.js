// import axiosInstance from "../utils/axiosInstance";

// const PARTNERS_URL = "/partners/";

// /**
//  * Get list of all third-party partners
//  * @param {Object} params - query params (search, pagination, filters, etc.)
//  */
// export const getPartners = async (params = {}) => {
//   const response = await axiosInstachnce.get(PARTNERS_URL, { params });
//   return response.data;
// };

// /**
//  * Create a new third-party partner
//  * @param {Object} data - partner payload
//  */
// export const createPartner = async (data) => {
//   const response = await axiosInstance.post(
//     `${PARTNERS_URL}create/`,
//     data
//   );
//   return response.data;
// };

// /**
//  * Update an existing third-party partner
//  * @param {string} id - UUID of partner
//  * @param {Object} data - updated payload
//  */
// export const updatePartner = async (id, data) => {
//   const response = await axiosInstance.put(
//     `${PARTNERS_URL}${id}/`,
//     data
//   );
//   return response.data;
// };

// /**
//  * Delete a third-party partner
//  * @param {string} id - UUID of partner
//  */
// export const deletePartner = async (id) => {
//   const response = await axiosInstance.delete(
//     `${PARTNERS_URL}${id}/delete/`
//   );
//   return response.data;
// };


// src/services/thirdPartyService.js
import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "third_party/partners/";

const thirdPartyService = {
  /**
   * Get all partners
   * GET /api/v1/third_party/partners/
   */
  getPartners() {
    return axiosInstance.get(BASE_PATH);
  },

  /**
   * Create a new partner
   * POST /api/v1/third_party/partners/create/
   */
  createPartner(data) {
    return axiosInstance.post(`${BASE_PATH}create/`, data);
  },

  /**
   * Update a partner
   * PUT /api/v1/third_party/partners/{uuid}/
   */
  updatePartner(id, data) {
    return axiosInstance.put(`${BASE_PATH}${id}/`, data);
  },

  /**
   * Delete a partner
   * DELETE /api/v1/third_party/partners/{uuid}/delete/
   */
  deletePartner(id) {
    return axiosInstance.delete(`${BASE_PATH}${id}/delete/`);
  },
};

export default thirdPartyService;
