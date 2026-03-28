const BASE_URL = "http://127.0.0.1:8000/api/sitevisit";

// ─── Helper ───────────────────────────────────────────────────────────────────

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  console.log(`[siteVisitService] ${options.method || "GET"} → ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  console.log(`[siteVisitService] ← ${response.status} ${response.url}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`[siteVisitService] Error body:`, errorData);
    const error = new Error(
      errorData.detail || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204) return null;

  const data = await response.json();
  console.log(`[siteVisitService] Data:`, data);
  return data;
}

// ─── Site Visit Reports ───────────────────────────────────────────────────────

export const getAllSiteVisits = () => request("/site-visits/");

export const getSiteVisit = (id) => request(`/site-visits/${id}/`);

export const createSiteVisit = (data) =>
  request("/site-visits/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateSiteVisit = (id, data) =>
  request(`/site-visits/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const patchSiteVisit = (id, data) =>
  request(`/site-visits/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteSiteVisit = (id) =>
  request(`/site-visits/${id}/`, { method: "DELETE" });

// ─── Site Visit Photos ────────────────────────────────────────────────────────

export const getSitePhotos = (reportId = null) => {
  const query = reportId ? `?report=${reportId}` : "";
  return request(`/site-photos/${query}`);
};

export const getSitePhoto = (id) => request(`/site-photos/${id}/`);

export const uploadSitePhoto = (reportId, imageFile) => {
  const formData = new FormData();
  formData.append("report", reportId);
  formData.append("image", imageFile);
  return request("/site-photos/", { method: "POST", body: formData });
};

export const deleteSitePhoto = (id) =>
  request(`/site-photos/${id}/`, { method: "DELETE" });

// ─── Recommendations ──────────────────────────────────────────────────────────

export const getRecommendations = (reportId = null) => {
  const query = reportId ? `?report=${reportId}` : "";
  return request(`/recommendations/${query}`);
};

export const getRecommendation = (id) => request(`/recommendations/${id}/`);

export const createRecommendation = (data) =>
  request("/recommendations/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateRecommendation = (id, data) =>
  request(`/recommendations/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const patchRecommendation = (id, data) =>
  request(`/recommendations/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteRecommendation = (id) =>
  request(`/recommendations/${id}/`, { method: "DELETE" });

// ─── Rejected Documents ───────────────────────────────────────────────────────
// matches urls.py: router.register(r"rejected", RejectedViewSet)


export const getAllRejected = async () => {
  const response = await siteVisitAPI.get("/rejections/");  
  return response.data;
};

export const getRejected = (id) => request(`/rejected/${id}/`);

export const createRejected = (data) =>
  request("/rejected/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateRejected = (id, data) =>
  request(`/rejected/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const patchRejected = (id, data) =>
  request(`/rejected/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteRejected = (id) =>
  request(`/rejected/${id}/`, { method: "DELETE" });
