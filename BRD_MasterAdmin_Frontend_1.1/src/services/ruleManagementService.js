import axiosInstance from "../utils/axiosInstance";

const BASE = "adminpanel/rule-management/"; // change if your backend base url different

export const ruleManagementService = {

    /* ---------------- RULE MASTER ---------------- */

// GET ALL
async getRuleMasters(params = {}) {
  const res = await axiosInstance.get(`${BASE}rule-master/`, { params });
  return res.data;
},

// GET SINGLE
async getRuleMasterById(id) {
  const res = await axiosInstance.get(`${BASE}rule-master/${id}/`);
  return res.data;
},

// CREATE
async createRuleMaster(payload) {
  const res = await axiosInstance.post(`${BASE}rule-master/`, payload);
  return res.data;
},

// UPDATE
async updateRuleMaster(id, payload) {
  const res = await axiosInstance.patch(`${BASE}rule-master/${id}/`, payload);
  return res.data;
},

// DELETE
async deleteRuleMaster(id) {
  return axiosInstance.delete(`${BASE}rule-master/${id}/`);
},

async getImpactValues(params = {}) {
  const res = await axiosInstance.get(`${BASE}impact-values/`, { params });
  return res.data;
},

async getImpactValueById(id) {
  const res = await axiosInstance.get(`${BASE}impact-values/${id}/`);
  return res.data;
},

async createImpactValue(payload) {
  const res = await axiosInstance.post(`${BASE}impact-values/`, payload);
  return res.data;
},

async updateImpactValue(id, payload) {
  const res = await axiosInstance.patch(`${BASE}impact-values/${id}/`, payload);
  return res.data;
},

async deleteImpactValue(id) {
  return axiosInstance.delete(`${BASE}impact-values/${id}/`);
},


 /* ---------------- CLIENT PROFILE RULES ---------------- */

// GET ALL
async getClientProfileRules(params = {}) {
  const res = await axiosInstance.get(`${BASE}client-profile/`, { params });
  return res.data;
},

// GET SINGLE
async getClientProfileRuleById(id) {
  const res = await axiosInstance.get(`${BASE}client-profile/${id}/`);
  return res.data;
},

// CREATE
async createClientProfileRule(payload) {
  const res = await axiosInstance.post(`${BASE}client-profile/`, payload);
  return res.data;
},

// UPDATE
async updateClientProfileRule(id, payload) {
  const res = await axiosInstance.patch(`${BASE}client-profile/${id}/`, payload);
  return res.data;
},

// DELETE
async deleteClientProfileRule(id) {
  return axiosInstance.delete(`${BASE}client-profile/${id}/`);
},





  /* ---------------- FINANCIAL RULES ---------------- */

/* FINANCIAL ELIGIBILITY */

async getFinancialRules(params = {}) {
  const res = await axiosInstance.get(`${BASE}financial-eligibility/`, { params });
  return res.data;
},

async getFinancialRuleById(id) {
  const res = await axiosInstance.get(`${BASE}financial-eligibility/${id}/`);
  return res.data;
},

async createFinancialRule(payload) {
  const res = await axiosInstance.post(`${BASE}financial-eligibility/`, payload);
  return res.data;
},

async updateFinancialRule(id, payload) {
  const res = await axiosInstance.patch(`${BASE}financial-eligibility/${id}/`, payload);
  return res.data;
},

async deleteFinancialRule(id) {
  return axiosInstance.delete(`${BASE}financial-eligibility/${id}/`);
},






/* ---------------- COLLATERAL RULES ---------------- */

// GET ALL
async getCollateralRules(params = {}) {
  const res = await axiosInstance.get(`${BASE}collateral-quality/`, { params });
  return res.data;
},

// GET SINGLE
async getCollateralRuleById(id) {
  const res = await axiosInstance.get(`${BASE}collateral-quality/${id}/`);
  return res.data;
},

// CREATE
async createCollateralRule(payload) {
  const res = await axiosInstance.post(`${BASE}collateral-quality/`, payload);
  return res.data;
},

// UPDATE
async updateCollateralRule(id, payload) {
  const res = await axiosInstance.patch(`${BASE}collateral-quality/${id}/`, payload);
  return res.data;
},

// DELETE
async deleteCollateralRule(id) {
  return axiosInstance.delete(`${BASE}collateral-quality/${id}/`);
},



  /* ---------------- SCORECARD RULES ---------------- */

  /* ---------------- CREDIT HISTORY RULES ---------------- */

async getCreditHistoryRules(params = {}) {
  const res = await axiosInstance.get(`${BASE}credit-history/`, { params });
  return res.data;
},

async getCreditHistoryRule(id) {
  const res = await axiosInstance.get(`${BASE}credit-history/${id}/`);
  return res.data;
},

async createCreditHistoryRule(payload) {
  const res = await axiosInstance.post(`${BASE}credit-history/`, payload);
  return res.data;
},

async updateCreditHistoryRule(id, payload) {
  const res = await axiosInstance.patch(`${BASE}credit-history/${id}/`, payload);
  return res.data;
},

async deleteCreditHistoryRule(id) {
  return axiosInstance.delete(`${BASE}credit-history/${id}/`);
},


/* ---------------- INTERNAL SCORE ---------------- */

async getInternalScoreRules() {
  const res = await axiosInstance.get(`${BASE}internal-score/`,);
  return res.data;
},

async createInternalScoreRule(payload) {
  const res = await axiosInstance.post(`${BASE}internal-score/`, payload);
  return res.data;
},

async updateInternalScoreRule(id, payload) {
  const res = await axiosInstance.patch(`${BASE}internal-score/${id}/`, payload);
  return res.data;
},

async deleteInternalScoreRule(id) {
  return axiosInstance.delete(`${BASE}internal-score/${id}/`);
},
async getInternalScoreRule(id) {
  const res = await axiosInstance.get(`${BASE}internal-score/${id}/`);
  return res.data;
},

async getGeoLocationRules() {
    const res = await axiosInstance.get(`${BASE}geo-location/`);
    return res.data;
  },

  async getGeoLocationRule(id) {
    const res = await axiosInstance.get(`${BASE}geo-location/${id}/`);
    return res.data;
  },

  async createGeoLocationRule(payload) {
    const res = await axiosInstance.post(`${BASE}geo-location/`, payload);
    return res.data;
  },

  async updateGeoLocationRule(id, payload) {
    const res = await axiosInstance.patch(`${BASE}geo-location/${id}/`, payload);
    return res.data;
  },

  async deleteGeoLocationRule(id) {
    return axiosInstance.delete(`${BASE}geo-location/${id}/`);
  },

  /* ================= RISK MITIGATION RULE ================= */

async getRiskMitigationRules() {
  const res = await axiosInstance.get(`${BASE}risk-mitigation/`);
  return res.data;
},

async getRiskMitigationRule(id) {
  const res = await axiosInstance.get(`${BASE}risk-mitigation/${id}/`);
  return res.data;
},

async createRiskMitigationRule(payload) {
  const res = await axiosInstance.post(`${BASE}risk-mitigation/`, payload);
  return res.data;
},

async updateRiskMitigationRule(id, payload) {
  const res = await axiosInstance.patch(`${BASE}risk-mitigation/${id}/`, payload);
  return res.data;
},

async deleteRiskMitigationRule(id) {
  return axiosInstance.delete(`${BASE}risk-mitigation/${id}/`);
},






/* ================= INTERNAL VERIFICATION RULE ================= */

async getInternalVerificationRules(params = {}) {
  const res = await axiosInstance.get(`${BASE}internal-verification/`, { params });
  return res.data;
},

async getInternalVerificationRule(id) {
  const res = await axiosInstance.get(`${BASE}internal-verification/${id}/`);
  return res.data;
},

async createInternalVerificationRule(payload) {
  const res = await axiosInstance.post(`${BASE}internal-verification/`, payload);
  return res.data;
},

async updateInternalVerificationRule(id, payload) {
  const res = await axiosInstance.patch(`${BASE}internal-verification/${id}/`, payload);
  return res.data;
},

async deleteInternalVerificationRule(id) {
  return axiosInstance.delete(`${BASE}internal-verification/${id}/`);
},

/* ================= AGENCY VERIFICATION RULE ================= */

async getAgencyVerificationRules(params = {}) {
  const res = await axiosInstance.get(`${BASE}agency-verification/`, { params });
  return res.data;
},

async getAgencyVerificationRuleById(id) {
  const res = await axiosInstance.get(`${BASE}agency-verification/${id}/`);
  return res.data;
},

async createAgencyVerificationRule(payload) {
  const res = await axiosInstance.post(`${BASE}agency-verification/`, payload);
  return res.data;
},

async updateAgencyVerificationRule(id, payload) {
  const res = await axiosInstance.patch(`${BASE}agency-verification/${id}/`, payload);
  return res.data;
},

async deleteAgencyVerificationRule(id) {
  return axiosInstance.delete(`${BASE}agency-verification/${id}/`);
},



};

