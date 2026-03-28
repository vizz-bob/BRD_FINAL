import api from "./axiosInstance";

const normalizeDashboardPayload = (payload = {}) => {
  const normalized = { ...payload };

  const normalizeAmlValue = (value) =>
    value === "HIT" || value === "SANCTION_HIT" ? "HIT" : "CLEAR";

  const normalizeScoreValue = (value) => {
    if (typeof value === "number") return `${value}%`;
    if (typeof value === "string" && value.trim()) {
      return value.includes("%") ? value : `${value}%`;
    }
    return "0%";
  };

  normalized.risk_distribution = Array.isArray(payload.risk_distribution)
    ? payload.risk_distribution
    : [];

  normalized.synthetic_weekly = Array.isArray(payload.synthetic_weekly)
    ? payload.synthetic_weekly.map((row) => ({
        count: row.count || 0,
        day: row.day || row.date || "",
      }))
    : [];

  normalized.aml_weekly = Array.isArray(payload.aml_weekly)
    ? payload.aml_weekly.map((row) => ({
        count: row.count || 0,
        day: row.day || row.date || "",
      }))
    : [];

  normalized.highRiskApplicants = Array.isArray(payload.highRiskApplicants)
    ? payload.highRiskApplicants.map((item) => ({
        ...item,
        id: item.id || item.case_id || "",
        aml: normalizeAmlValue(item.aml || item.aml_status),
        score: normalizeScoreValue(item.score ?? item.fraud_score ?? item.fraudScore),
      }))
    : [];

  normalized.alerts = Array.isArray(payload.alerts) ? payload.alerts : [];

  normalized.avg_fraud_score = payload.avg_fraud_score || 0;
  normalized.behavioral_flags = payload.behavioral_flags || 0;
  normalized.pattern_matches = payload.pattern_matches || 0;

  return normalized;
};

export const getFraudDashboard = async () => {
  try {
    const response = await api.get("/fraud/dashboard/");
    return normalizeDashboardPayload(response.data);
  } catch (error) {
    console.error("Failed to fetch fraud dashboard data from backend:", error);
    throw error;
  }
};
