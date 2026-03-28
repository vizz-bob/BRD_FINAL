import axiosInstance from "../utils/axiosInstance";

const BASE = "rulemanagement";

// Rule Master
export const getRuleMasters = () => axiosInstance.get(`${BASE}/rule-master/`).then(res => res.data);
export const getRuleMasterById = (id) => axiosInstance.get(`${BASE}/rule-master/${id}/`).then(res => res.data);
export const createRuleMaster = (data) => axiosInstance.post(`${BASE}/rule-master/`, data).then(res => res.data);
export const updateRuleMaster = (id, data) => axiosInstance.put(`${BASE}/rule-master/${id}/`, data).then(res => res.data);
export const deleteRuleMaster = (id) => axiosInstance.delete(`${BASE}/rule-master/${id}/`).then(res => res.data);

// Impact Values
export const getImpactValues = () => axiosInstance.get(`${BASE}/impact-values/`).then(res => res.data);
export const getImpactValueById = (id) => axiosInstance.get(`${BASE}/impact-values/${id}/`).then(res => res.data);
export const createImpactValue = (data) => axiosInstance.post(`${BASE}/impact-values/`, data).then(res => res.data);
export const updateImpactValue = (id, data) => axiosInstance.put(`${BASE}/impact-values/${id}/`, data).then(res => res.data);
export const deleteImpactValue = (id) => axiosInstance.delete(`${BASE}/impact-values/${id}/`).then(res => res.data);

// Client Profile
export const getClientProfileRules = () => axiosInstance.get(`${BASE}/client-profile/`).then(res => res.data);
export const getClientProfileRuleById = (id) => axiosInstance.get(`${BASE}/client-profile/${id}/`).then(res => res.data);
export const createClientProfileRule = (data) => axiosInstance.post(`${BASE}/client-profile/`, data).then(res => res.data);
export const updateClientProfileRule = (id, data) => axiosInstance.put(`${BASE}/client-profile/${id}/`, data).then(res => res.data);
export const deleteClientProfileRule = (id) => axiosInstance.delete(`${BASE}/client-profile/${id}/`).then(res => res.data);

// Financial Eligibility
export const getFinancialEligibilityRules = () => axiosInstance.get(`${BASE}/financial-eligibility/`).then(res => res.data);
export const getFinancialEligibilityRuleById = (id) => axiosInstance.get(`${BASE}/financial-eligibility/${id}/`).then(res => res.data);
export const createFinancialEligibilityRule = (data) => axiosInstance.post(`${BASE}/financial-eligibility/`, data).then(res => res.data);
export const updateFinancialEligibilityRule = (id, data) => axiosInstance.put(`${BASE}/financial-eligibility/${id}/`, data).then(res => res.data);
export const deleteFinancialEligibilityRule = (id) => axiosInstance.delete(`${BASE}/financial-eligibility/${id}/`).then(res => res.data);

// Collateral Quality
export const getCollateralQualityRules = () => axiosInstance.get(`${BASE}/collateral-quality/`).then(res => res.data);
export const getCollateralQualityRuleById = (id) => axiosInstance.get(`${BASE}/collateral-quality/${id}/`).then(res => res.data);
export const createCollateralQualityRule = (data) => axiosInstance.post(`${BASE}/collateral-quality/`, data).then(res => res.data);
export const updateCollateralQualityRule = (id, data) => axiosInstance.put(`${BASE}/collateral-quality/${id}/`, data).then(res => res.data);
export const deleteCollateralQualityRule = (id) => axiosInstance.delete(`${BASE}/collateral-quality/${id}/`).then(res => res.data);

// Scorecard -> Credit History
export const getCreditHistoryRules = () => axiosInstance.get(`${BASE}/credit-history/`).then(res => res.data);
export const getCreditHistoryRuleById = (id) => axiosInstance.get(`${BASE}/credit-history/${id}/`).then(res => res.data);
export const createCreditHistoryRule = (data) => axiosInstance.post(`${BASE}/credit-history/`, data).then(res => res.data);
export const updateCreditHistoryRule = (id, data) => axiosInstance.put(`${BASE}/credit-history/${id}/`, data).then(res => res.data);
export const deleteCreditHistoryRule = (id) => axiosInstance.delete(`${BASE}/credit-history/${id}/`).then(res => res.data);

// Scorecard -> Internal Score
export const getInternalScoreRules = () => axiosInstance.get(`${BASE}/internal-score/`).then(res => res.data);
export const getInternalScoreRule = (id) => axiosInstance.get(`${BASE}/internal-score/${id}/`).then(res => res.data);
export const createInternalScoreRule = (data) => axiosInstance.post(`${BASE}/internal-score/`, data).then(res => res.data);
export const updateInternalScoreRule = (id, data) => axiosInstance.put(`${BASE}/internal-score/${id}/`, data).then(res => res.data);
export const deleteInternalScoreRule = (id) => axiosInstance.delete(`${BASE}/internal-score/${id}/`).then(res => res.data);

// Scorecard -> Geo Location
export const getGeoLocationRules = () => axiosInstance.get(`${BASE}/geo-location/`).then(res => res.data);
export const getGeoLocationRule = (id) => axiosInstance.get(`${BASE}/geo-location/${id}/`).then(res => res.data);
export const createGeoLocationRule = (data) => axiosInstance.post(`${BASE}/geo-location/`, data).then(res => res.data);
export const updateGeoLocationRule = (id, data) => axiosInstance.put(`${BASE}/geo-location/${id}/`, data).then(res => res.data);
export const deleteGeoLocationRule = (id) => axiosInstance.delete(`${BASE}/geo-location/${id}/`).then(res => res.data);

// Risk Mitigation
export const getRiskMitigationRules = () => axiosInstance.get(`${BASE}/risk-mitigation/`).then(res => res.data);
export const getRiskMitigationRuleById = (id) => axiosInstance.get(`${BASE}/risk-mitigation/${id}/`).then(res => res.data);
export const createRiskMitigationRule = (data) => axiosInstance.post(`${BASE}/risk-mitigation/`, data).then(res => res.data);
export const updateRiskMitigationRule = (id, data) => axiosInstance.put(`${BASE}/risk-mitigation/${id}/`, data).then(res => res.data);
export const deleteRiskMitigationRule = (id) => axiosInstance.delete(`${BASE}/risk-mitigation/${id}/`).then(res => res.data);

// Verification -> Internal
export const getInternalVerificationRules = () => axiosInstance.get(`${BASE}/internal-verification/`).then(res => res.data);
export const getInternalVerificationRule = (id) => axiosInstance.get(`${BASE}/internal-verification/${id}/`).then(res => res.data);
export const createInternalVerificationRule = (data) => axiosInstance.post(`${BASE}/internal-verification/`, data).then(res => res.data);
export const updateInternalVerificationRule = (id, data) => axiosInstance.put(`${BASE}/internal-verification/${id}/`, data).then(res => res.data);
export const deleteInternalVerificationRule = (id) => axiosInstance.delete(`${BASE}/internal-verification/${id}/`).then(res => res.data);

// Verification -> Agency
export const getAgencyVerificationRules = () => axiosInstance.get(`${BASE}/agency-verification/`).then(res => res.data);
export const getAgencyVerificationRuleById = (id) => axiosInstance.get(`${BASE}/agency-verification/${id}/`).then(res => res.data);
export const createAgencyVerificationRule = (data) => axiosInstance.post(`${BASE}/agency-verification/`, data).then(res => res.data);
export const updateAgencyVerificationRule = (id, data) => axiosInstance.put(`${BASE}/agency-verification/${id}/`, data).then(res => res.data);
export const deleteAgencyVerificationRule = (id) => axiosInstance.delete(`${BASE}/agency-verification/${id}/`).then(res => res.data);

export const ruleManagementService = {
  getRuleMasters, getRuleMasterById, createRuleMaster, updateRuleMaster, deleteRuleMaster,
  getImpactValues, getImpactValueById, createImpactValue, updateImpactValue, deleteImpactValue,
  getClientProfileRules, getClientProfileRuleById, createClientProfileRule, updateClientProfileRule, deleteClientProfileRule,
  getFinancialEligibilityRules, getFinancialEligibilityRuleById, createFinancialEligibilityRule, updateFinancialEligibilityRule, deleteFinancialEligibilityRule,
  getCollateralQualityRules, getCollateralQualityRuleById, createCollateralQualityRule, updateCollateralQualityRule, deleteCollateralQualityRule,
  getCreditHistoryRules, getCreditHistoryRuleById, createCreditHistoryRule, updateCreditHistoryRule, deleteCreditHistoryRule,
  getInternalScoreRules, getInternalScoreRule, createInternalScoreRule, updateInternalScoreRule, deleteInternalScoreRule,
  getGeoLocationRules, getGeoLocationRule, createGeoLocationRule, updateGeoLocationRule, deleteGeoLocationRule,
  getRiskMitigationRules, getRiskMitigationRuleById, createRiskMitigationRule, updateRiskMitigationRule, deleteRiskMitigationRule,
  getInternalVerificationRules, getInternalVerificationRule, createInternalVerificationRule, updateInternalVerificationRule, deleteInternalVerificationRule,
  getAgencyVerificationRules, getAgencyVerificationRuleById, createAgencyVerificationRule, updateAgencyVerificationRule, deleteAgencyVerificationRule,
};