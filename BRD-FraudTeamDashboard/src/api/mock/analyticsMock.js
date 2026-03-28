
export const analyticsMock = {
  fraudScoreDistribution: [
    { range: "0-20", count: 12 },
    { range: "21-40", count: 48 },
    { range: "41-60", count: 72 },
    { range: "61-80", count: 39 },
    { range: "81-100", count: 19 },
  ],

  riskCategoryPie: [
    { category: "High Risk", value: 22 },
    { category: "Medium Risk", value: 45 },
    { category: "Low Risk", value: 33 },
  ],

  syntheticAlertsTrend: [
    { date: "2025-01-01", value: 5 },
    { date: "2025-01-02", value: 9 },
    { date: "2025-01-03", value: 7 },
    { date: "2025-01-04", value: 12 },
    { date: "2025-01-05", value: 8 },
  ],

  amlTrend: [
    { date: "2025-01-01", hits: 2 },
    { date: "2025-01-02", hits: 3 },
    { date: "2025-01-03", hits: 1 },
    { date: "2025-01-04", hits: 4 },
    { date: "2025-01-05", hits: 2 },
  ],
};
