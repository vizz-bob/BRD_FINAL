// PromotionalOffersService.js
// Matches Django models: New_Offer_Details, New_Targetting, Dashboard
// Base: path('letter/', include('Promotional_Offers.urls'))

const BASE_URL = "/letter";

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS — mirror Django model choices exactly
// ─────────────────────────────────────────────────────────────────────────────

export const OFFER_TYPE_CHOICES = [
  { value: "BONUS",      label: "Bonus" },
  { value: "FLAT_BONUS", label: "Flat Bonus" },
  { value: "RATE_HIKE",  label: "Rate Hike" },
  { value: "CASHBACK",   label: "Cashback" },
  { value: "FREE_MONTH", label: "Free Month" },
];

export const STATUS_CHOICES = [
  { value: "ACTIVE",    label: "Active" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "PAUSED",    label: "Paused" },
];

export const AGENT_TYPE_CHOICES = [
  { value: "DSA",          label: "DSA" },
  { value: "BROKER",       label: "Broker" },
  { value: "LEAD_PARTNER", label: "Lead Partner" },
];

export const TENANT_CHOICES = [
  { value: "ALL",       label: "All" },
  { value: "MUMBAI",    label: "Mumbai" },
  { value: "DELHI",     label: "Delhi" },
  { value: "BANGALORE", label: "Bangalore" },
  { value: "HYDERABAD", label: "Hyderabad" },
  { value: "CHENNAI",   label: "Chennai" },
  { value: "PUNE",      label: "Pune" },
];

export const COLOR_CHOICES = [
  { value: "YELLOW",    label: "Yellow" },
  { value: "GREEN",     label: "Green" },
  { value: "PINK",      label: "Pink" },
  { value: "BLUE",      label: "Blue" },
  { value: "PURPLE",    label: "Purple" },
  { value: "RED",       label: "Red" },
  { value: "NAVY_BLUE", label: "Navy Blue" },
  { value: "AQUA",      label: "Aqua" },
];

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE HANDLER
// ─────────────────────────────────────────────────────────────────────────────

const handleResponse = async (response) => {
  if (!response.ok) {
    // DRF returns error details as JSON
    const error = await response.json().catch(() => ({}));
    // DRF validation errors can be an object — stringify for display
    const message =
      typeof error?.detail === "string"
        ? error.detail
        : JSON.stringify(error) || `HTTP ${response.status}`;
    throw new Error(message);
  }
  if (response.status === 204) return null; // DELETE success
  return response.json();
};

const getHeaders = () => ({
  "Content-Type": "application/json",
});

// ─────────────────────────────────────────────────────────────────────────────
// NEW OFFER DETAILS
// Model fields: offer_title, offer_type, status, max_usage_limit,
//               start_date, end_date, bonus_amount, rate_discount,
//               trigger_condition, offer_tag, description,
//               cancel, next_step, created_at
//
// Routes:
//   GET    /letter/           → list all offers
//   POST   /letter/           → create offer
//   GET    /letter/<pk>/      → retrieve offer
//   PUT    /letter/<pk>/      → full update
//   PATCH  /letter/<pk>/      → partial update
//   DELETE /letter/<pk>/      → delete
// ─────────────────────────────────────────────────────────────────────────────

export const OfferService = {

  /** GET /letter/ */
  getAllOffers: async () => {
    const res = await fetch(`${BASE_URL}/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * POST /letter/
   * Required fields: offer_title, offer_type, start_date, end_date
   * Optional fields: status, max_usage_limit, bonus_amount, rate_discount,
   *                  trigger_condition, offer_tag, description, cancel, next_step
   *
   * @param {Object} data
   * @param {string} data.offer_title
   * @param {string} data.offer_type        — one of OFFER_TYPE_CHOICES values
   * @param {string} data.start_date        — "YYYY-MM-DD"
   * @param {string} data.end_date          — "YYYY-MM-DD"
   * @param {string} [data.status]          — default "ACTIVE"
   * @param {number} [data.max_usage_limit]
   * @param {string} [data.bonus_amount]    — decimal string e.g. "5000.00"
   * @param {string} [data.rate_discount]   — decimal string e.g. "0.50"
   * @param {string} [data.trigger_condition]
   * @param {string} [data.offer_tag]
   * @param {string} [data.description]
   * @param {boolean}[data.cancel]          — default false
   * @param {boolean}[data.next_step]       — default false
   */
  createOffer: async (data) => {
    const res = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** GET /letter/<pk>/ */
  getOfferById: async (pk) => {
    const res = await fetch(`${BASE_URL}/${pk}/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /** PUT /letter/<pk>/ — full update (all required fields must be sent) */
  updateOffer: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/${pk}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** PATCH /letter/<pk>/ — partial update (only send changed fields) */
  partialUpdateOffer: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/${pk}/`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** DELETE /letter/<pk>/ */
  deleteOffer: async (pk) => {
    const res = await fetch(`${BASE_URL}/${pk}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW TARGETTING
// Model fields: target_agent_type, target_tenants, accent_color,
//               cancel, next_step, created_at
//
// Routes:
//   GET    /letter/targetting/           → list
//   POST   /letter/targetting/           → create
//   GET    /letter/targetting/<pk>/      → retrieve
//   PUT    /letter/targetting/<pk>/      → full update
//   PATCH  /letter/targetting/<pk>/      → partial update
//   DELETE /letter/targetting/<pk>/      → delete
// ─────────────────────────────────────────────────────────────────────────────

export const TargettingService = {

  /** GET /letter/targetting/ */
  getAllTargettings: async () => {
    const res = await fetch(`${BASE_URL}/targetting/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * POST /letter/targetting/
   * @param {Object} data
   * @param {string} data.target_agent_type  — one of AGENT_TYPE_CHOICES values
   * @param {string} [data.target_tenants]   — one of TENANT_CHOICES values, default "ALL"
   * @param {string} data.accent_color       — one of COLOR_CHOICES values
   * @param {boolean}[data.cancel]           — default false
   * @param {boolean}[data.next_step]        — default false
   */
  createTargetting: async (data) => {
    const res = await fetch(`${BASE_URL}/targetting/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** GET /letter/targetting/<pk>/ */
  getTargettingById: async (pk) => {
    const res = await fetch(`${BASE_URL}/targetting/${pk}/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /** PUT /letter/targetting/<pk>/ */
  updateTargetting: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/targetting/${pk}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** PATCH /letter/targetting/<pk>/ */
  partialUpdateTargetting: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/targetting/${pk}/`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** DELETE /letter/targetting/<pk>/ */
  deleteTargetting: async (pk) => {
    const res = await fetch(`${BASE_URL}/targetting/${pk}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// Model fields: total_offers, scheduled, active_now,
//               total_redemptions, created_at
//
// Routes:
//   GET    /letter/dashboard/           → list
//   POST   /letter/dashboard/           → create
//   GET    /letter/dashboard/<pk>/      → retrieve
//   PUT    /letter/dashboard/<pk>/      → full update
//   PATCH  /letter/dashboard/<pk>/      → partial update
//   DELETE /letter/dashboard/<pk>/      → delete
// ─────────────────────────────────────────────────────────────────────────────

export const DashboardService = {

  /** GET /letter/dashboard/ */
  getAllDashboards: async () => {
    const res = await fetch(`${BASE_URL}/dashboard/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * POST /letter/dashboard/
   * @param {Object} data
   * @param {number} [data.total_offers]      — default 0
   * @param {number} [data.scheduled]         — default 0
   * @param {number} [data.active_now]        — default 0
   * @param {number} [data.total_redemptions] — default 0
   */
  createDashboard: async (data) => {
    const res = await fetch(`${BASE_URL}/dashboard/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** GET /letter/dashboard/<pk>/ */
  getDashboardById: async (pk) => {
    const res = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  /** PUT /letter/dashboard/<pk>/ */
  updateDashboard: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** PATCH /letter/dashboard/<pk>/ */
  partialUpdateDashboard: async (pk, data) => {
    const res = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** DELETE /letter/dashboard/<pk>/ */
  deleteDashboard: async (pk) => {
    const res = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const PromotionalOffersService = {
  Offer:      OfferService,
  Targetting: TargettingService,
  Dashboard:  DashboardService,
};

export default PromotionalOffersService;
