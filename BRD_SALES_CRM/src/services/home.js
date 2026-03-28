// ─────────────────────────────────────────────────────────────────
//  services/home.js
//  Central API service layer connecting React frontend to Django
//  backend. Covers all endpoints from urls.py:
//    /api/dashboard/
//    /api/leads/
//    /api/reminders/
//    /api/notifications/
//    /api/team/
//    /api/incentives/
// ─────────────────────────────────────────────────────────────────

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ══════════════════════════════════════════════
//  AUTH HELPERS
//  Django REST Framework uses session auth by default.
//  Store the token/session after login and attach to every request.
// ══════════════════════════════════════════════

/**
 * Get stored auth token from localStorage.
 * Replace with your preferred auth method (JWT, session cookie, etc.)
 */
const getAuthToken = () => localStorage.getItem("authToken");

/**
 * Build common headers for every request.
 * Attaches Authorization token if present.
 * Reads CSRF token from cookie for POST/PUT/PATCH/DELETE.
 */
const getHeaders = (isFormData = false) => {
  const headers = {};

  // Auth token (if using token auth)
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Content-Type (skip for FormData — browser sets it with boundary)
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // CSRF token for Django (reads from cookie set by Django)
  const csrfToken = getCookie("csrftoken");
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  return headers;
};

/** Read a cookie value by name (used for CSRF) */
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// ══════════════════════════════════════════════
//  CORE FETCH WRAPPER
//  Single place to handle errors, JSON parsing, and auth errors.
// ══════════════════════════════════════════════

/**
 * Core fetch wrapper.
 * @param {string} endpoint  - e.g. "/api/leads/"
 * @param {string} method    - GET | POST | PUT | PATCH | DELETE
 * @param {object|FormData}  body - request payload
 * @returns {Promise<any>}   parsed JSON response
 */
const request = async (endpoint, method = "GET", body = null) => {
  const isFormData = body instanceof FormData;

  const config = {
    method,
    headers: getHeaders(isFormData),
    credentials: "include", // send session cookies for Django session auth
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Handle 401 Unauthorized — clear token and redirect to login
  if (response.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
    return;
  }

  // Handle 204 No Content (DELETE responses)
  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Attach Django validation errors to the thrown error
    const error = new Error(data?.detail || `Request failed: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// ══════════════════════════════════════════════
//  AUTH SERVICE
//  Login / Logout using Django REST Framework token auth
// ══════════════════════════════════════════════

export const authService = {
  /**
   * Login with username + password.
   * Stores returned token in localStorage.
   * POST /api/auth/login/
   */
  login: async (username, password) => {
    const data = await request("/api/auth/login/", "POST", { username, password });
    if (data?.token) {
      localStorage.setItem("authToken", data.token);
    }
    return data;
  },

  /**
   * Logout and clear stored token.
   * POST /api/auth/logout/
   */
  logout: async () => {
    await request("/api/auth/logout/", "POST");
    localStorage.removeItem("authToken");
  },

  /** Check if user is currently authenticated */
  isAuthenticated: () => !!getAuthToken(),
};

// ══════════════════════════════════════════════
//  DASHBOARD SERVICE
//  Maps to: DashboardViewSet → /api/dashboard/
// ══════════════════════════════════════════════

export const dashboardService = {
  getMetrics: (filter = "all") => request(`/api/dashboard/metrics/?filter=${filter}`),
  getReport: (metric, filter = "all") => request(`/api/dashboard/report/${metric}/?filter=${filter}`),
};

// ══════════════════════════════════════════════
//  LEADS SERVICE
//  Maps to: LeadViewSet → /api/leads/
//
//  Lead model fields:
//    borrower_name, contact_number, city_region,
//    loan_product (business_loan | personal_loan | home_loan | msme_loan | lap),
//    ticket_size, internal_remarks,
//    stage (new | contacted | qualified | application |
//           docs_pending | approved | disbursed | rejected),
//    assigned_to (User FK), pan_document, aadhaar_document,
//    gst_document, is_active, applied_at
// ══════════════════════════════════════════════

export const leadService = {
  /**
   * Get all leads. Supports query params for filtering.
   * GET /api/leads/
   * @param {object} params - e.g. { stage: 'new', assigned_to: 3, loan_product: 'home_loan' }
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/leads/${query ? `?${query}` : ""}`);
  },

  /**
   * Get a single lead by ID.
   * GET /api/leads/:id/
   */
  getById: (id) => request(`/api/leads/${id}/`),

  /**
   * Create a new lead.
   * POST /api/leads/
   * @param {object} leadData - { borrower_name, contact_number, loan_product, ticket_size, ... }
   */
  create: (leadData) => request("/api/leads/", "POST", leadData),

  /**
   * Update all fields of a lead.
   * PUT /api/leads/:id/
   */
  update: (id, leadData) => request(`/api/leads/${id}/`, "PUT", leadData),

  /**
   * Partially update a lead (e.g. just stage or assigned_to).
   * PATCH /api/leads/:id/
   * @param {object} fields - only the fields to update
   */
  patch: (id, fields) => request(`/api/leads/${id}/`, "PATCH", fields),

  /**
   * Delete a lead.
   * DELETE /api/leads/:id/
   */
  delete: (id) => request(`/api/leads/${id}/`, "DELETE"),

  /**
   * Upload KYC documents (PAN, Aadhaar, GST) for a lead.
   * Uses FormData since files are being uploaded.
   * PATCH /api/leads/:id/
   * @param {number} id
   * @param {{ pan?: File, aadhaar?: File, gst?: File }} files
   */
  uploadDocuments: (id, files) => {
    const formData = new FormData();
    if (files.pan) formData.append("pan_document", files.pan);
    if (files.aadhaar) formData.append("aadhaar_document", files.aadhaar);
    if (files.gst) formData.append("gst_document", files.gst);
    return request(`/api/leads/${id}/`, "PATCH", formData);
  },

  /**
   * Update only the stage of a lead.
   * PATCH /api/leads/:id/
   * @param {number} id
   * @param {string} stage - one of LeadStage values
   */
  updateStage: (id, stage) => request(`/api/leads/${id}/`, "PATCH", { stage }),

  /**
   * Assign a lead to a team member.
   * PATCH /api/leads/:id/
   * @param {number} leadId
   * @param {number} userId
   */
  assignTo: (leadId, userId) =>
    request(`/api/leads/${leadId}/`, "PATCH", { assigned_to: userId }),

  // ── Lead Stage Constants (mirrors Django LeadStage choices) ──
  STAGES: {
    NEW: "new",
    CONTACTED: "contacted",
    QUALIFIED: "qualified",
    APPLICATION: "application",
    DOCS_PENDING: "docs_pending",
    APPROVED: "approved",
    DISBURSED: "disbursed",
    REJECTED: "rejected",
  },

  // ── Loan Product Constants (mirrors Django LoanProduct choices) ──
  PRODUCTS: {
    BUSINESS_LOAN: "business_loan",
    PERSONAL_LOAN: "personal_loan",
    HOME_LOAN: "home_loan",
    MSME_LOAN: "msme_loan",
    LAP: "lap",
  },
};

// ══════════════════════════════════════════════
//  REMINDERS SERVICE
//  Maps to: ReminderViewSet → /api/reminders/
//
//  Reminder model fields:
//    lead (FK), title, due_date,
//    reminder_type (call | email | meeting | follow_up | document),
//    notes, is_completed, completed_at
// ══════════════════════════════════════════════

export const reminderService = {
  /**
   * Get all reminders. Filter by lead or completion status.
   * GET /api/reminders/
   * @param {object} params - e.g. { lead: 5, is_completed: false }
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/reminders/${query ? `?${query}` : ""}`);
  },

  /**
   * Get a single reminder.
   * GET /api/reminders/:id/
   */
  getById: (id) => request(`/api/reminders/${id}/`),

  /**
   * Create a new reminder for a lead.
   * POST /api/reminders/
   * @param {object} data - { lead, title, due_date, reminder_type, notes }
   */
  create: (data) => request("/api/reminders/", "POST", data),

  /**
   * Update a reminder.
   * PUT /api/reminders/:id/
   */
  update: (id, data) => request(`/api/reminders/${id}/`, "PUT", data),

  /**
   * Mark a reminder as completed.
   * PATCH /api/reminders/:id/
   */
  markComplete: (id) =>
    request(`/api/reminders/${id}/`, "PATCH", {
      is_completed: true,
      completed_at: new Date().toISOString(),
    }),

  /**
   * Delete a reminder.
   * DELETE /api/reminders/:id/
   */
  delete: (id) => request(`/api/reminders/${id}/`, "DELETE"),

  // ── Reminder Type Constants ──
  TYPES: {
    CALL: "call",
    EMAIL: "email",
    MEETING: "meeting",
    FOLLOW_UP: "follow_up",
    DOCUMENT: "document",
  },
};

// ══════════════════════════════════════════════
//  NOTIFICATIONS SERVICE
//  Maps to: NotificationViewSet → /api/notifications/
//
//  Notification model fields:
//    lead (FK nullable), sent_by (User FK),
//    recipients (M2M User), message, is_read
// ══════════════════════════════════════════════

export const notificationService = {
  /**
   * Get all notifications for the current user.
   * GET /api/notifications/
   * @param {object} params - e.g. { is_read: false }
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/notifications/${query ? `?${query}` : ""}`);
  },

  /**
   * Get unread notifications count.
   * GET /api/notifications/?is_read=false
   */
  getUnread: () => request("/api/notifications/?is_read=false"),

  /**
   * Create / send a notification.
   * POST /api/notifications/
   * @param {object} data - { message, recipients: [userId], lead? }
   */
  create: (data) => request("/api/notifications/", "POST", data),

  /**
   * Mark a notification as read.
   * PATCH /api/notifications/:id/
   */
  markRead: (id) => request(`/api/notifications/${id}/`, "PATCH", { is_read: true }),

  /**
   * Mark ALL notifications as read.
   * PATCH each — or use a custom bulk action if defined in ViewSet.
   */
  markAllRead: async () => {
    const unread = await notificationService.getUnread();
    const ids = (unread?.results || unread || []).map((n) => n.id);
    return Promise.all(ids.map((id) => notificationService.markRead(id)));
  },

  /**
   * Delete a notification.
   * DELETE /api/notifications/:id/
   */
  delete: (id) => request(`/api/notifications/${id}/`, "DELETE"),
};

// ══════════════════════════════════════════════
//  TEAM SERVICE
//  Maps to: TeamMemberViewSet → /api/team/
//
//  TeamMember model fields:
//    user (OneToOne), role (sales_executive | relationship_manager |
//    team_lead | admin), phone, city, monthly_target
// ══════════════════════════════════════════════

export const teamService = {
  /**
   * Get all team members.
   * GET /api/team/
   * @param {object} params - e.g. { role: 'sales_executive', city: 'Mumbai' }
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/team/${query ? `?${query}` : ""}`);
  },

  /**
   * Get a single team member.
   * GET /api/team/:id/
   */
  getById: (id) => request(`/api/team/${id}/`),

  /**
   * Create a team member profile.
   * POST /api/team/
   * @param {object} data - { user, role, phone, city, monthly_target }
   */
  create: (data) => request("/api/team/", "POST", data),

  /**
   * Update a team member.
   * PUT /api/team/:id/
   */
  update: (id, data) => request(`/api/team/${id}/`, "PUT", data),

  /**
   * Partially update a team member (e.g. update monthly_target only).
   * PATCH /api/team/:id/
   */
  patch: (id, fields) => request(`/api/team/${id}/`, "PATCH", fields),

  /**
   * Delete a team member.
   * DELETE /api/team/:id/
   */
  delete: (id) => request(`/api/team/${id}/`, "DELETE"),

  // ── Role Constants ──
  ROLES: {
    SALES_EXECUTIVE: "sales_executive",
    RELATIONSHIP_MANAGER: "relationship_manager",
    TEAM_LEAD: "team_lead",
    ADMIN: "admin",
  },
};

// ══════════════════════════════════════════════
//  INCENTIVES SERVICE
//  Maps to: IncentiveViewSet → /api/incentives/
//
//  Incentive model fields:
//    team_member (User FK), month (DateField — first day of month),
//    amount, disbursed_leads, notes
// ══════════════════════════════════════════════

export const incentiveService = {
  /**
   * Get all incentives.
   * GET /api/incentives/
   * @param {object} params - e.g. { team_member: 3, month: '2024-01-01' }
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/incentives/${query ? `?${query}` : ""}`);
  },

  /**
   * Get incentives for a specific team member.
   * GET /api/incentives/?team_member=:userId
   */
  getByMember: (userId) => request(`/api/incentives/?team_member=${userId}`),

  /**
   * Get incentives for a specific month.
   * @param {number} year  - e.g. 2024
   * @param {number} month - 1–12
   */
  getByMonth: (year, month) => {
    const monthStr = `${year}-${String(month).padStart(2, "0")}-01`;
    return request(`/api/incentives/?month=${monthStr}`);
  },

  /**
   * Get a single incentive record.
   * GET /api/incentives/:id/
   */
  getById: (id) => request(`/api/incentives/${id}/`),

  /**
   * Create an incentive record.
   * POST /api/incentives/
   * @param {object} data - { team_member, month, amount, disbursed_leads, notes }
   * Note: month must be first day of month e.g. "2024-03-01"
   */
  create: (data) => request("/api/incentives/", "POST", data),

  /**
   * Update an incentive record.
   * PUT /api/incentives/:id/
   */
  update: (id, data) => request(`/api/incentives/${id}/`, "PUT", data),

  /**
   * Partially update incentive (e.g. update amount only).
   * PATCH /api/incentives/:id/
   */
  patch: (id, fields) => request(`/api/incentives/${id}/`, "PATCH", fields),

  /**
   * Delete an incentive record.
   * DELETE /api/incentives/:id/
   */
  delete: (id) => request(`/api/incentives/${id}/`, "DELETE"),

  /**
   * Helper: format a JS Date to Django-expected month field (first day of month).
   * @param {Date} date
   * @returns {string} e.g. "2024-03-01"
   */
  formatMonth: (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}-01`;
  },
};

// ══════════════════════════════════════════════
//  RESOURCES SERVICE
//  Maps to: ResourceViewSet → /api/resources/
// ══════════════════════════════════════════════

export const resourceService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/resources/${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/api/resources/${id}/`),
  create: (data) => request("/api/resources/", "POST", data),
  update: (id, data) => request(`/api/resources/${id}/`, "PUT", data),
  patch: (id, fields) => request(`/api/resources/${id}/`, "PATCH", fields),
  delete: (id) => request(`/api/resources/${id}/`, "DELETE"),
};

// ══════════════════════════════════════════════
//  REPORTS SERVICE
//  Maps to: ReportViewSet → /api/reports/
// ══════════════════════════════════════════════

export const reportService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/reports/${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/api/reports/${id}/`),
  create: (data) => request("/api/reports/", "POST", data),
  update: (id, data) => request(`/api/reports/${id}/`, "PUT", data),
  patch: (id, fields) => request(`/api/reports/${id}/`, "PATCH", fields),
  delete: (id) => request(`/api/reports/${id}/`, "DELETE"),
};

// ══════════════════════════════════════════════
//  USAGE EXAMPLES (for reference)
// ══════════════════════════════════════════════

/*

── Fetch all new leads assigned to user 3:
   const leads = await leadService.getAll({ stage: 'new', assigned_to: 3 });

── Create a new lead:
   const lead = await leadService.create({
     borrower_name: "Rajesh Kumar",
     contact_number: "9876543210",
     loan_product: leadService.PRODUCTS.HOME_LOAN,
     ticket_size: 2500000,
     city_region: "Mumbai",
     stage: leadService.STAGES.NEW,
   });

── Move lead to next stage:
   await leadService.updateStage(lead.id, leadService.STAGES.CONTACTED);

── Upload KYC documents:
   await leadService.uploadDocuments(lead.id, {
     pan:     panFileInput.files[0],
     aadhaar: aadhaarFileInput.files[0],
   });

── Create reminder for a lead:
   await reminderService.create({
     lead: lead.id,
     title: "Follow up call",
     due_date: "2024-03-15T10:00:00Z",
     reminder_type: reminderService.TYPES.CALL,
     notes: "Discuss loan eligibility",
   });

── Get this month's incentives for user 5:
   const thisMonth = incentiveService.formatMonth(new Date());
   const incentive = await incentiveService.getAll({ team_member: 5, month: thisMonth });

── Send a notification:
   await notificationService.create({
     message: "Lead #42 has been approved",
     recipients: [3, 7],
     lead: 42,
   });

*/