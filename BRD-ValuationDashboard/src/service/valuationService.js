// src/services/valuationService.js

const BASE_URL = "http://127.0.0.1:8000/api/valuation/";

// Generic request handler
const request = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Valuation API Error →", error);
    throw error;
  }
};



// ===============================
// 1️⃣ New Valuation Requests
// ===============================

export const getNewValuationRequests = () =>
  request(`${BASE_URL}new-valuation-requests/`);

export const createNewValuationRequest = (data) =>
  request(`${BASE_URL}new-valuation-requests/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateNewValuationRequest = (id, data) =>
  request(`${BASE_URL}new-valuation-requests/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteNewValuationRequest = (id) =>
  request(`${BASE_URL}new-valuation-requests/${id}/`, {
    method: "DELETE",
  });



// ===============================
// 2️⃣ Generate Reports
// ===============================

export const getReports = () =>
  request(`${BASE_URL}generate-reports/`);

export const createReport = (data) =>
  request(`${BASE_URL}generate-reports/`, {
    method: "POST",
    body: JSON.stringify(data),
  });



// ===============================
// 3️⃣ Location Distribution
// ===============================

export const getLocationDistribution = () =>
  request(`${BASE_URL}location-distribution/`);

export const createLocationDistribution = (data) =>
  request(`${BASE_URL}location-distribution/`, {
    method: "POST",
    body: JSON.stringify(data),
  });



// ===============================
// 4️⃣ Valuations
// ===============================

export const getValuations = () =>
  request(`${BASE_URL}valuations/`);

export const createValuation = (data) =>
  request(`${BASE_URL}valuations/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateValuation = (id, data) =>
  request(`${BASE_URL}valuations/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteValuation = (id) =>
  request(`${BASE_URL}valuations/${id}/`, {
    method: "DELETE",
  });



// ===============================
// 5️⃣ Valuation Dashboard (GET only)
// ===============================

export const getValuationDashboard = () =>
  request(`${BASE_URL}valuation-dashboard/`);