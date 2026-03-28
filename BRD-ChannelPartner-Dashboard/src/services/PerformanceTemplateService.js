// PerformanceTemplateService.js
// Base URL matches Django: path('performance/', include('performance_template.urls'))

const BASE_URL = "/performance";

// ─────────────────────────────────────────
// Helper
// ─────────────────────────────────────────
const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data && (data.detail || data.message || JSON.stringify(data))) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  // Add Authorization header if needed:
  // Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─────────────────────────────────────────
// DASHBOARD
// GET  /performance/dashboard/
// POST /performance/dashboard/
// GET  /performance/dashboard/<pk>/
// PUT  /performance/dashboard/<pk>/
// DEL  /performance/dashboard/<pk>/
// ─────────────────────────────────────────
export const DashboardService = {
  /**
   * List all dashboard entries
   * @returns {Promise<Array>}
   */
  list: async () => {
    const res = await fetch(`${BASE_URL}/dashboard/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Create a new dashboard entry
   * @param {Object} data - { total_templates, active, draft, agents_covered }
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const res = await fetch(`${BASE_URL}/dashboard/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Retrieve a single dashboard entry
   * @param {number} pk
   * @returns {Promise<Object>}
   */
  retrieve: async (pk) => {
    const res = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Update a dashboard entry (full update)
   * @param {number} pk
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Partial update a dashboard entry
   * @param {number} pk
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  partialUpdate: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Delete a dashboard entry
   * @param {number} pk
   * @returns {Promise<null>}
   */
  delete: async (pk) => {
    const res = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (res.status === 204) return null;
    return handleResponse(res);
  },
};

// ─────────────────────────────────────────
// TEMPLATES
// GET  /performance/
// POST /performance/
// GET  /performance/<pk>/
// PUT  /performance/<pk>/
// DEL  /performance/<pk>/
// ─────────────────────────────────────────

/**
 * Payload shape for NewTemplate:
 * {
 *   template_name: string,
 *   agent_type: "DSA" | "BROKER" | "LEAD_PARTNER",
 *   review_cycle: "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "ANNUAL",
 *   status: "ACTIVE" | "DRAFT",
 *   bronze_min, bronze_max, bronze_bonus,
 *   silver_min, silver_max, silver_bonus,
 *   gold_min,   gold_max,   gold_bonus,
 *   platinum_min, platinum_max, platinum_bonus,
 *   cancel: boolean,
 *   create_template: boolean,
 *   metrics: [{ metric_name, weight, target, unit }]  // nested write if supported
 * }
 */
export const TemplateService = {
  /**
   * List all templates
   * @returns {Promise<Array>}
   */
  list: async () => {
    const res = await fetch(`${BASE_URL}/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Create a new template (with optional nested metrics)
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const res = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Retrieve a single template by PK
   * @param {number} pk
   * @returns {Promise<Object>}
   */
  retrieve: async (pk) => {
    const res = await fetch(`${BASE_URL}/${pk}/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Full update of a template
   * @param {number} pk
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/${pk}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Partial update of a template
   * @param {number} pk
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  partialUpdate: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/${pk}/`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Delete a template
   * @param {number} pk
   * @returns {Promise<null>}
   */
  delete: async (pk) => {
    const res = await fetch(`${BASE_URL}/${pk}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (res.status === 204) return null;
    return handleResponse(res);
  },
};

// ─────────────────────────────────────────
// PERFORMANCE METRICS  (nested under template)
// If your router exposes metrics as a sub-resource,
// update the paths below accordingly, e.g.:
//   /performance/<template_pk>/metrics/
// ─────────────────────────────────────────

/**
 * Payload shape for PerformanceMetric:
 * {
 *   template: number,        // FK to NewTemplate
 *   metric_name: string,
 *   weight: number,
 *   target: number,
 *   unit: string             // optional, defaults to ""
 * }
 */
export const MetricService = {
  /**
   * List metrics — optionally filter by template PK via query param
   * @param {number|null} templatePk
   * @returns {Promise<Array>}
   */
  list: async (templatePk = null) => {
    const url = templatePk
      ? `${BASE_URL}/metrics/?template=${templatePk}`
      : `${BASE_URL}/metrics/`;
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Create a performance metric
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const res = await fetch(`${BASE_URL}/metrics/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Retrieve a single metric
   * @param {number} pk
   * @returns {Promise<Object>}
   */
  retrieve: async (pk) => {
    const res = await fetch(`${BASE_URL}/metrics/${pk}/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Full update of a metric
   * @param {number} pk
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/metrics/${pk}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Partial update of a metric
   * @param {number} pk
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  partialUpdate: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/metrics/${pk}/`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * Delete a metric
   * @param {number} pk
   * @returns {Promise<null>}
   */
  delete: async (pk) => {
    const res = await fetch(`${BASE_URL}/metrics/${pk}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (res.status === 204) return null;
    return handleResponse(res);
  },
};

// ─────────────────────────────────────────
// ENUMS  (mirror Django model choices)
// ─────────────────────────────────────────
export const AGENT_TYPE = {
  DSA: "DSA",
  BROKER: "BROKER",
  LEAD_PARTNER: "LEAD_PARTNER",
};

export const REVIEW_CYCLE = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  HALF_YEARLY: "HALF_YEARLY",
  ANNUAL: "ANNUAL",
};

export const STATUS = {
  ACTIVE: "ACTIVE",
  DRAFT: "DRAFT",
};

// ─────────────────────────────────────────
// DEFAULT TIER CONFIG  (mirrors model defaults)
// ─────────────────────────────────────────
export const DEFAULT_TIERS = {
  bronze:   { min: 0,  max: 49,  bonus: 0 },
  silver:   { min: 50, max: 74,  bonus: 2000 },
  gold:     { min: 75, max: 89,  bonus: 5000 },
  platinum: { min: 90, max: 100, bonus: 10000 },
};