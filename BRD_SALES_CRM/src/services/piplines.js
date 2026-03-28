// ─────────────────────────────────────────────────────────────────
//  services/leadCrmService.js
//  API service layer for Leads & CRM Tools module.
//
//  Django models : Lead, CRMTool
//  ViewSets      : LeadViewSet, CRMToolViewSet
//  Endpoints     :
//    /leads/       (LeadViewSet)
//    /crm-tools/   (CRMToolViewSet)
// ─────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ══════════════════════════════════════════════
//  AUTH HELPERS
// ══════════════════════════════════════════════

const getAuthToken = () => localStorage.getItem("authToken");

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Token ${token}`;
  const csrf = getCookie("csrftoken");
  if (csrf) headers["X-CSRFToken"] = csrf;
  return headers;
};

// ══════════════════════════════════════════════
//  CORE FETCH WRAPPER
// ══════════════════════════════════════════════

/**
 * @param {string} endpoint  - e.g. "/leads/"
 * @param {string} method    - GET | POST | PUT | PATCH | DELETE
 * @param {object} body      - request payload
 * @returns {Promise<any>}
 */
const request = async (endpoint, method = "GET", body = null) => {
  const config = {
    method,
    headers: getHeaders(),
    credentials: "include",
  };

  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
    return;
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.detail || `Request failed: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// ══════════════════════════════════════════════
//  CONSTANTS
//  Mirror Django model choices exactly
// ══════════════════════════════════════════════

/** Lead.STAGE_CHOICES */
export const LEAD_STAGES = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  APPLICATION_SUBMITTED: "APPLICATION_SUBMITTED",
  APPROVED: "APPROVED",
  DISBURSED: "DISBURSED",
};

/** Lead.LOAN_TYPE_CHOICES */
export const LOAN_TYPES = {
  HOME: "HOME",
  PERSONAL: "PERSONAL",
  BUSINESS: "BUSINESS",
};

/** CRMTool.STATUS_CHOICES */
export const CRM_STATUS = {
  ACTIVE: "ACTIVE",
  PASSIVE: "PASSIVE",
  ON_DEMAND: "ON_DEMAND",
};

// ══════════════════════════════════════════════
//  LEAD SERVICE
//  All CRUD + helper operations for /leads/
//
//  Lead model fields:
//    name, email, phone,
//    loan_type (HOME | PERSONAL | BUSINESS),
//    amount,
//    stage (NEW | CONTACTED | APPLICATION_SUBMITTED | APPROVED | DISBURSED),
//    assigned_to (User FK),
//    created_at, updated_at
// ══════════════════════════════════════════════

export const leadService = {

  // ── READ ────────────────────────────────────

  /**
   * Get all leads.
   * GET /leads/
   *
   * @param {object} params - optional filters:
   *   {
   *     stage       : string,  // "NEW" | "CONTACTED" | ...
   *     loan_type   : string,  // "HOME" | "PERSONAL" | "BUSINESS"
   *     assigned_to : number,  // User ID
   *   }
   *
   * @example
   *   leadService.getAll({ stage: "NEW", loan_type: "HOME" })
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/leads/${query ? `?${query}` : ""}`);
  },

  /**
   * Get a single lead by ID.
   * GET /leads/:id/
   *
   * @param {number} id
   */
  getById: (id) => request(`/leads/${id}/`),

  /**
   * Get all leads assigned to a specific user.
   * GET /leads/?assigned_to=:userId
   *
   * @param {number} userId
   */
  getByAssignee: (userId) => request(`/leads/?assigned_to=${userId}`),

  /**
   * Get all leads filtered by stage.
   * GET /leads/?stage=:stage
   *
   * @param {string} stage - one of LEAD_STAGES values
   */
  getByStage: (stage) => request(`/leads/?stage=${stage}`),

  /**
   * Get all leads filtered by loan type.
   * GET /leads/?loan_type=:loanType
   *
   * @param {string} loanType - one of LOAN_TYPES values
   */
  getByLoanType: (loanType) => request(`/leads/?loan_type=${loanType}`),

  // ── CREATE ──────────────────────────────────

  /**
   * Create a new lead.
   * POST /leads/
   *
   * @param {object} data - {
   *   name        : string,   // required
   *   phone       : string,   // required
   *   loan_type   : string,   // required — "HOME" | "PERSONAL" | "BUSINESS"
   *   amount      : string,   // required — e.g. "500000.00"
   *   email?      : string,   // optional
   *   stage?      : string,   // default "NEW"
   *   assigned_to?: number,   // User ID, optional
   * }
   *
   * @example
   *   leadService.create({
   *     name: "Arjun Sharma",
   *     phone: "9876543210",
   *     email: "arjun@email.com",
   *     loan_type: LOAN_TYPES.HOME,
   *     amount: "2500000.00",
   *     assigned_to: 4,
   *   });
   */
  create: (data) => request("/leads/", "POST", data),

  // ── UPDATE ──────────────────────────────────

  /**
   * Full update of a lead (all fields required).
   * PUT /leads/:id/
   *
   * @param {number} id
   * @param {object} data
   */
  update: (id, data) => request(`/leads/${id}/`, "PUT", data),

  /**
   * Partial update — only send fields you want to change.
   * PATCH /leads/:id/
   *
   * @param {number} id
   * @param {object} fields
   *
   * @example
   *   leadService.patch(7, { stage: "APPROVED", amount: "300000.00" })
   */
  patch: (id, fields) => request(`/leads/${id}/`, "PATCH", fields),

  /**
   * Move lead to a new stage.
   * PATCH /leads/:id/
   *
   * @param {number} id
   * @param {string} stage - one of LEAD_STAGES values
   *
   * @example
   *   leadService.updateStage(7, LEAD_STAGES.APPROVED)
   */
  updateStage: (id, stage) => request(`/leads/${id}/`, "PATCH", { stage }),

  /**
   * Reassign lead to a different user.
   * PATCH /leads/:id/
   *
   * @param {number} leadId
   * @param {number} userId
   */
  assignTo: (leadId, userId) =>
    request(`/leads/${leadId}/`, "PATCH", { assigned_to: userId }),

  // ── DELETE ──────────────────────────────────

  /**
   * Delete a lead.
   * DELETE /leads/:id/
   *
   * @param {number} id
   */
  delete: (id) => request(`/leads/${id}/`, "DELETE"),

  // ── STAGE PROGRESSION HELPERS ───────────────

  /**
   * Advance lead to the next stage in the pipeline.
   * Order: NEW → CONTACTED → APPLICATION_SUBMITTED → APPROVED → DISBURSED
   *
   * @param {number} id
   * @param {string} currentStage
   * @returns {Promise|null} null if already at final stage
   */
  advanceStage: (id, currentStage) => {
    const pipeline = [
      LEAD_STAGES.NEW,
      LEAD_STAGES.CONTACTED,
      LEAD_STAGES.APPLICATION_SUBMITTED,
      LEAD_STAGES.APPROVED,
      LEAD_STAGES.DISBURSED,
    ];
    const currentIndex = pipeline.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex === pipeline.length - 1) return null;
    const nextStage = pipeline[currentIndex + 1];
    return leadService.updateStage(id, nextStage);
  },

  /**
   * Get human-readable label for a stage value.
   * @param {string} stage
   * @returns {string}
   */
  getStageLabel: (stage) => {
    const labels = {
      NEW: "New",
      CONTACTED: "Contacted",
      APPLICATION_SUBMITTED: "Application Submitted",
      APPROVED: "Approved",
      DISBURSED: "Disbursed",
    };
    return labels[stage] || stage;
  },

  /**
   * Get human-readable label for a loan type value.
   * @param {string} loanType
   * @returns {string}
   */
  getLoanTypeLabel: (loanType) => {
    const labels = {
      HOME: "Home Loan",
      PERSONAL: "Personal Loan",
      BUSINESS: "Business Loan",
    };
    return labels[loanType] || loanType;
  },
};

// ══════════════════════════════════════════════
//  CRM TOOL SERVICE
//  All CRUD operations for /crm-tools/
//
//  CRMTool model fields:
//    name, status (ACTIVE | PASSIVE | ON_DEMAND),
//    sync_frequency, last_synced_at, description
// ══════════════════════════════════════════════

export const crmToolService = {

  // ── READ ────────────────────────────────────

  /**
   * Get all CRM tools.
   * GET /crm-tools/
   *
   * @param {object} params - optional filters:
   *   {
   *     status : string,  // "ACTIVE" | "PASSIVE" | "ON_DEMAND"
   *   }
   *
   * @example
   *   crmToolService.getAll({ status: "ACTIVE" })
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/crm-tools/${query ? `?${query}` : ""}`);
  },

  /**
   * Get a single CRM tool by ID.
   * GET /crm-tools/:id/
   *
   * @param {number} id
   */
  getById: (id) => request(`/crm-tools/${id}/`),

  /**
   * Get all active CRM tools.
   * GET /crm-tools/?status=ACTIVE
   */
  getActive: () => request(`/crm-tools/?status=${CRM_STATUS.ACTIVE}`),

  /**
   * Get all passive CRM tools.
   * GET /crm-tools/?status=PASSIVE
   */
  getPassive: () => request(`/crm-tools/?status=${CRM_STATUS.PASSIVE}`),

  /**
   * Get all on-demand CRM tools.
   * GET /crm-tools/?status=ON_DEMAND
   */
  getOnDemand: () => request(`/crm-tools/?status=${CRM_STATUS.ON_DEMAND}`),

  // ── CREATE ──────────────────────────────────

  /**
   * Create a new CRM tool entry.
   * POST /crm-tools/
   *
   * @param {object} data - {
   *   name             : string,  // required
   *   status           : string,  // required — "ACTIVE" | "PASSIVE" | "ON_DEMAND"
   *   sync_frequency?  : string,  // e.g. "Every 6 hours"
   *   last_synced_at?  : string,  // ISO datetime string
   *   description?     : string,
   * }
   *
   * @example
   *   crmToolService.create({
   *     name: "Salesforce",
   *     status: CRM_STATUS.ACTIVE,
   *     sync_frequency: "Every 1 hour",
   *     description: "Primary CRM for enterprise leads",
   *   });
   */
  create: (data) => request("/crm-tools/", "POST", data),

  // ── UPDATE ──────────────────────────────────

  /**
   * Full update of a CRM tool (all fields required).
   * PUT /crm-tools/:id/
   *
   * @param {number} id
   * @param {object} data
   */
  update: (id, data) => request(`/crm-tools/${id}/`, "PUT", data),

  /**
   * Partial update — only send fields you want to change.
   * PATCH /crm-tools/:id/
   *
   * @param {number} id
   * @param {object} fields
   *
   * @example
   *   crmToolService.patch(2, { status: "PASSIVE" })
   */
  patch: (id, fields) => request(`/crm-tools/${id}/`, "PATCH", fields),

  /**
   * Update the status of a CRM tool.
   * PATCH /crm-tools/:id/
   *
   * @param {number} id
   * @param {string} status - one of CRM_STATUS values
   *
   * @example
   *   crmToolService.updateStatus(2, CRM_STATUS.ACTIVE)
   */
  updateStatus: (id, status) => request(`/crm-tools/${id}/`, "PATCH", { status }),

  /**
   * Record a sync event — updates last_synced_at to now.
   * PATCH /crm-tools/:id/
   *
   * @param {number} id
   */
  recordSync: (id) =>
    request(`/crm-tools/${id}/`, "PATCH", {
      last_synced_at: new Date().toISOString(),
    }),

  // ── DELETE ──────────────────────────────────

  /**
   * Delete a CRM tool entry.
   * DELETE /crm-tools/:id/
   *
   * @param {number} id
   */
  delete: (id) => request(`/crm-tools/${id}/`, "DELETE"),

  // ── HELPERS ─────────────────────────────────

  /**
   * Get human-readable label for a CRM status value.
   * @param {string} status
   * @returns {string}
   */
  getStatusLabel: (status) => {
    const labels = {
      ACTIVE: "Active",
      PASSIVE: "Passive",
      ON_DEMAND: "On Demand",
    };
    return labels[status] || status;
  },

  /**
   * Format last_synced_at datetime to a readable string.
   * @param {string|null} isoString - ISO datetime from API
   * @returns {string}
   *
   * @example
   *   crmToolService.formatLastSynced("2024-03-15T10:30:00Z")
   *   // → "15 Mar 2024, 10:30 AM"
   */
  formatLastSynced: (isoString) => {
    if (!isoString) return "Never synced";
    return new Date(isoString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
};

// ══════════════════════════════════════════════
//  USAGE EXAMPLES (for reference)
// ══════════════════════════════════════════════

/*

── Create a new lead:
   await leadService.create({
     name: "Priya Patel",
     phone: "9876543210",
     email: "priya@example.com",
     loan_type: LOAN_TYPES.PERSONAL,
     amount: "150000.00",
     assigned_to: 3,
   });

── Move lead through pipeline:
   await leadService.updateStage(id, LEAD_STAGES.CONTACTED);
   await leadService.advanceStage(id, LEAD_STAGES.CONTACTED);  // auto next stage

── Filter leads by stage and loan type:
   const leads = await leadService.getAll({
     stage: LEAD_STAGES.APPLICATION_SUBMITTED,
     loan_type: LOAN_TYPES.HOME,
   });

── Create a CRM tool:
   await crmToolService.create({
     name: "Zoho CRM",
     status: CRM_STATUS.ACTIVE,
     sync_frequency: "Every 30 minutes",
     description: "Used for SME lead tracking",
   });

── Record a sync:
   await crmToolService.recordSync(toolId);

── Update CRM tool status:
   await crmToolService.updateStatus(toolId, CRM_STATUS.PASSIVE);

*/