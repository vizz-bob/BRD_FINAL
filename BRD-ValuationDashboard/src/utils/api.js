// api.js - Centralized API helper for BRD Portal (Valuation Dashboard, Field Verifications, Property Checks)
// Includes automatic fallback to mock.js when API fails

import { MockAPI } from "./mock";

const API_BASE_URL = "/api/v1";

// Generic GET helper
async function apiGet(url, params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}${url}?${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("API GET failed");
  return response.json();
}

// Generic POST helper
async function apiPost(url, body = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error("API POST failed");
  return response.json();
}

// ----------------------------------------------
// Safe API Wrapper: if API fails → use mock data
// ----------------------------------------------
async function safeApiCall(apiCall, mockCall) {
  try {
    return await apiCall();
  } catch (err) {
    console.warn("API failed → using mock data.", err);
    return await mockCall();
  }
}

//----------------------------------------------
// 1. Valuation Dashboard APIs
//----------------------------------------------
export const ValuationAPI = {
  getDashboardData: (timeRange) =>
    safeApiCall(
      () => apiGet("/valuation/dashboard", { timeRange }),
      () => MockAPI.getDashboardData(timeRange)
    ),

  generateReport: (timeRange) =>
    safeApiCall(
      () => apiGet("/valuation/report/generate", { timeRange }),
      () => ({ success: true, message: "Report generated (mock)." })
    ),
};

//----------------------------------------------
// 2. Field Verifications Management APIs
//----------------------------------------------
export const FieldVerificationAPI = {
  getVerificationsList: (filters) =>
    safeApiCall(
      () => apiGet("/valuation/verifications/list", filters),
      () => MockAPI.getVerificationsList(filters)
    ),

  scheduleVerification: (id, body) =>
    safeApiCall(
      () => apiPost(`/valuation/verifications/${id}/schedule`, body),
      () => ({ success: true, message: "Scheduled (mock)." })
    ),

  assignAgent: (id, body) =>
    safeApiCall(
      () => apiPost(`/valuation/verifications/${id}/assign`, body),
      () => ({ success: true, message: "Agent assigned (mock)." })
    ),

  startVisit: (id) =>
    safeApiCall(
      () => apiPost(`/valuation/verifications/${id}/start`),
      () => ({ success: true, message: "Visit started (mock)." })
    ),

  viewReport: (id) =>
    safeApiCall(
      () => apiGet(`/valuation/verifications/${id}/report`),
      () => ({ success: true, report: "Mock verification report" })
    ),
};

//----------------------------------------------
// 3. Property Checks Management APIs
//----------------------------------------------
export const PropertyChecksAPI = {
  getPropertyChecksList: (params) =>
    safeApiCall(
      () => apiGet("/valuation/property-checks/list", params),
      () => MockAPI.getPropertyChecksList(params)
    ),

  updateCheckItem: (propertyId, body) =>
    safeApiCall(
      () => apiPost(`/valuation/property-checks/${propertyId}/update-item`, body),
      () => ({ success: true, message: "Check item updated (mock)." })
    ),
};

export default {
  ValuationAPI,
  FieldVerificationAPI,
  PropertyChecksAPI,
};