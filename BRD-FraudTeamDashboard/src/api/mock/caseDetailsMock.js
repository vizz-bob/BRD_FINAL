export const caseDetailsMockData = {
  "CASE-001": {
    id: "CASE-001",
    applicant: {
      name: "Ravi Sharma",
      mobile: "9999999999",
      pan: "ABCDE1234F",
    },
    fraudEngine: {
      fraudScore: 82,
      syntheticId: "SUSPECT",
      aml: "CLEAR",
      behavioral: "HIGH RISK",
      pattern: "MATCH FOUND",
    },
    verifications: {
      kyc: { panMatch: true, aadhaarMatch: false },
      biometrics: { faceMatch: 82, liveness: true },
      geo: { negativeArea: false },
      financial: { incomeConfidence: 0.62 },
      bureau: { cibil: 720, blacklist: false },
      blockchain: { identityHashMatch: true },
    },
    workflow: { status: "REVIEW" },
    progressStage: 4,
    audit: [
      { id: 1, action: "Fraud score calculated", ts: "2025-06-12 10:05 AM" },
      { id: 2, action: "AML screening completed", ts: "2025-06-12 10:06 AM" },
    ],
  },

  "CASE-002": {
    id: "CASE-002",
    applicant: {
      name: "Aditya Singh",
      mobile: "8888888888",
      pan: "ABCDE2222A",
    },
    fraudEngine: {
      fraudScore: 45,
      syntheticId: "CLEAN",
      aml: "HIT",
      behavioral: "LOW RISK",
      pattern: "NO MATCH",
    },
    verifications: {
      kyc: { panMatch: true, aadhaarMatch: true },
      biometrics: { faceMatch: 60, liveness: true },
      geo: { negativeArea: false },
      financial: { incomeConfidence: 0.42 },
      bureau: { cibil: 680, blacklist: false },
      blockchain: { identityHashMatch: true },
    },
    workflow: { status: "PENDING" },
    progressStage: 2,
    audit: [
      { id: 1, action: "Case created", ts: "2025-06-12 09:00 AM" },
    ],
  },

  "CASE-003": {
    id: "CASE-003",
    applicant: {
      name: "Sameer Khan",
      mobile: "7777777777",
      pan: "ABCDE3333B",
    },
    fraudEngine: {
      fraudScore: 91,
      syntheticId: "SUSPECT",
      aml: "HIT",
      behavioral: "HIGH RISK",
      pattern: "MATCH FOUND",
    },
    verifications: {
      kyc: { panMatch: false, aadhaarMatch: false },
      biometrics: { faceMatch: 25, liveness: false },
      geo: { negativeArea: true },
      financial: { incomeConfidence: 0.21 },
      bureau: { cibil: 540, blacklist: true },
      blockchain: { identityHashMatch: false },
    },
    workflow: { status: "REJECTED" },
    progressStage: 5,
    audit: [
      { id: 1, action: "Case created", ts: "2025-06-10 3:05 PM" },
      { id: 2, action: "Rejected by underwriter", ts: "2025-06-11 11:20 AM" },
    ],
  },

  "CASE-004": {
    id: "CASE-004",
    applicant: {
      name: "Kunal Mehra",
      mobile: "6666666666",
      pan: "ABCDE4444C",
    },
    fraudEngine: {
      fraudScore: 58,
      syntheticId: "CLEAN",
      aml: "CLEAR",
      behavioral: "MEDIUM RISK",
      pattern: "NO MATCH",
    },
    verifications: {
      kyc: { panMatch: true, aadhaarMatch: true },
      biometrics: { faceMatch: 75, liveness: true },
      geo: { negativeArea: false },
      financial: { incomeConfidence: 0.55 },
      bureau: { cibil: 650, blacklist: false },
      blockchain: { identityHashMatch: true },
    },
    workflow: { status: "UNDER REVIEW" },
    progressStage: 3,
    audit: [
      { id: 1, action: "Case created", ts: "2025-08-01 12:00 PM" },
    ],
  },
};
