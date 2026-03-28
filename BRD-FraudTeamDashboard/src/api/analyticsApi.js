import api from "./axiosInstance";
import { analyticsMock } from "./mock/analyticsMock";

const normalizeAnalyticsPayload = (payload = {}) => {
  if (payload.fraudScoreDistribution && payload.riskCategoryPie) {
    return payload;
  }

  const riskDistribution = Array.isArray(payload.risk_distribution)
    ? payload.risk_distribution
    : [];

  const scoreRanges = payload.risk_score_distribution || {};

  return {
    ...payload,
    fraudScoreDistribution: [
      { bucket: "0-20", count: scoreRanges["0-20"] || 0 },
      { bucket: "21-40", count: scoreRanges["21-40"] || 0 },
      { bucket: "41-60", count: scoreRanges["41-60"] || 0 },
      { bucket: "61-80", count: scoreRanges["61-80"] || 0 },
      { bucket: "81-100", count: scoreRanges["81-100"] || 0 },
    ],
    riskCategoryPie: riskDistribution.map((row) => ({
      name: row.risk_level,
      value: row.count,
    })),
    syntheticAlertsTrend: [
      {
        date: "Last 7 Days",
        count: payload.synthetic_id_weekly || 0,
      },
    ],
    amlTrend: [
      {
        date: "Last 7 Days",
        count: payload.aml_hits_weekly || 0,
      },
    ],
  };
};

export const getAnalyticsData = async () => {
  try {
    const response = await api.get("/fraud/analytics/");

    // The unified AnalyticsDashboardView already returns perfectly formatted camelCase keys
    // for the Analytics charts (fraudScoreDistribution, riskCategoryPie, etc) alongside
    // the snake_case keys used by the Home Dashboard. We just need to return response.data.
    return response.data;
  } catch (error) {
    console.error("Failed to fetch analytics data from backend:", error);
    throw error;
  }
};
