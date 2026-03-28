// import axiosInstance from "../utils/axiosInstance";

// export const riskAPI = {
//     // Scorecard Rules
//     getScorecardRules: (type) => axiosInstance.get(`risk_engine/risk/credit-rules/?type=${type}`),
//     createScorecardRule: (data) => axiosInstance.post('risk_engine/risk/credit-rules/', data),
//     deleteScorecardRule: (id) => axiosInstance.delete(`risk_engine/risk/credit-rules/${id}/`),

//     // Geo-Fencing Zones
//     getBlockedZones: () => axiosInstance.get('risk_engine/risk/negative-areas/'),
//     createBlockedZone: (data) => axiosInstance.post('risk_engine/risk/negative-areas/', data),
//     deleteBlockedZone: (id) => axiosInstance.delete(`risk_engine/risk/negative-areas/${id}/`),
// };


// src/services/riskEngineService.js
import axiosInstance from "../utils/axiosInstance";

const riskAPI = {
  /* Credit Score Rules */

  // GET: List credit score rules
  getScorecardRules(type) {
    return axiosInstance.get(
      `risk_engine/risk/credit-rules/?type=${type}`
    );
  },

  // POST: Create a new credit score rule
  createScorecardRule(data) {
    return axiosInstance.post(
      "risk_engine/risk/credit-rules/",
      data
    );
  },

  // DELETE: Delete a credit score rule
  deleteScorecardRule(id) {
    return axiosInstance.delete(
      `risk_engine/risk/credit-rules/${id}/`
    );
  },

  /* Negative Areas */

  // GET: List negative areas
  getBlockedZones() {
    return axiosInstance.get(
      "risk_engine/risk/negative-areas/"
    );
  },

  // POST: Create a negative area
  createBlockedZone(data) {
    return axiosInstance.post(
      "risk_engine/risk/negative-areas/",
      data
    );
  },

  // DELETE: Delete a negative area
  deleteBlockedZone(id) {
    return axiosInstance.delete(
      `risk_engine/risk/negative-areas/${id}/`
    );
  },
};

export default riskAPI;
