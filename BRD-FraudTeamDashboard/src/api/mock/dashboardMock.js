console.log("dashboardMock.js LOADED FROM:", import.meta.url);

export const dashboardMock = {
  stats: {
    fraudScore: 78,
    fraudTrend: "+12.5%",
    syntheticAlerts: 12,
    syntheticTrend: "+8.2%",
    amlHits: 5,
    amlTrend: "+15.3%",
    behavioralFlags: 18,
    behavioralTrend: "+22.1%",
    patternMatches: 4,
    patternTrend: "+5.7%"
  },

  summary: {
    totalCases: 142,
    highRiskCases: 37,
    amlHitsToday: 12
  },

  highRiskApplicants: [
    { id: "CASE-1001", name: "Ravi Sharma", score: 82, aml: "HIT", status: "REVIEW" },
    { id: "CASE-1002", name: "Aman Verma", score: 76, aml: "CLEAR", status: "PENDING" },
    { id: "CASE-1003", name: "Sameer Khan", score: 91, aml: "HIT", status: "REVIEW" },
  ],

  alerts: [
    { type: "AML Match", detail: "Applicant matched PEP list", time: "2m ago" },
    { type: "High Fraud Score", detail: "Fraud score > 80 detected", time: "15m ago" },
    { type: "Document Mismatch", detail: "Aadhaar and PAN did not match", time: "1h ago" },
  ]
};
