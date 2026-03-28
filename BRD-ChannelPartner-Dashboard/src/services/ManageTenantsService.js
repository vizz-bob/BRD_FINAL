// ManageTenantsService.js
// Bridges ManageTenants.jsx (camelCase frontend) ↔ Django REST API (snake_case backend)

const BASE_URL = "/manage";

// ─────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────
const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `HTTP error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

const headers = { "Content-Type": "application/json" };

// ─────────────────────────────────────────────
// Field Mappers
// ─────────────────────────────────────────────

/**
 * Convert Django snake_case ShowTenant → camelCase shape used by ManageTenants.jsx
 *
 * Django fields:
 *   id, name, plan, region, status, location, agents, volume,
 *   contact_name, email, number, active_modules (comma-string), joined
 *
 * Frontend shape:
 *   id, name, plan, region, active(bool), city, state, agents, monthlyVolume,
 *   contactName, contactEmail, contactPhone, modules(array), joined
 */
export const toFrontend = (t) => {
  const [city = "", state = ""] = (t.location || "").split(",").map((s) => s.trim());
  return {
    id:           String(t.id),
    name:         t.name,
    city,
    state,
    region:       t.region.charAt(0).toUpperCase() + t.region.slice(1).toLowerCase(),
    plan:         t.plan.charAt(0).toUpperCase() + t.plan.slice(1).toLowerCase(),
    active:       t.status === "ACTIVE",
    agents:       t.agents,
    monthlyVolume: t.volume ? `₹${t.volume}` : "",
    contactName:  t.contact_name,
    contactEmail: t.email,
    contactPhone: t.number,
    modules:      t.active_modules
                    ? t.active_modules.split(",").map((m) => m.trim()).filter(Boolean)
                    : [],
    joined:       t.joined || "",
  };
};

/**
 * Convert frontend camelCase shape → Django snake_case ShowTenant payload
 */
export const toBackend = (t) => ({
  name:           t.name,
  plan:           t.plan.toUpperCase(),
  region:         t.region.toUpperCase(),
  status:         t.active ? "ACTIVE" : "INACTIVE",
  location:       [t.city, t.state].filter(Boolean).join(", "),
  agents:         Number(t.agents) || 0,
  volume:         Number(String(t.monthlyVolume || "0").replace(/[^\d.]/g, "")) || 0,
  contact_name:   t.contactName,
  email:          t.contactEmail,
  number:         t.contactPhone || "",
  active_modules: Array.isArray(t.modules) ? t.modules.join(", ") : "",
  joined:         t.joined || null,
  edit_tenant:    false,
  delete:         false,
  deactivate:     !t.active,
});

// ─────────────────────────────────────────────
// DASHBOARD  →  /manage/
// ─────────────────────────────────────────────
export const DashboardService = {
  /**
   * GET /manage/
   * Returns the latest dashboard stats row.
   * Shape: { total_tenants, active, enterprises, total_agents }
   */
  get: () =>
    fetch(`${BASE_URL}/`, { headers })
      .then(handleResponse)
      .then((list) => (Array.isArray(list) ? list[list.length - 1] : list)),

  /**
   * POST /manage/
   * Sync dashboard counters computed by the frontend.
   * Call after every create / delete / toggle in ManageTenants.jsx.
   *
   * @param {{ totalTenants, active, enterprises, totalAgents }} stats
   */
  sync: ({ totalTenants, active, enterprises, totalAgents }) =>
    fetch(`${BASE_URL}/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        total_tenants: totalTenants,
        active,
        enterprises,
        total_agents: totalAgents,
      }),
    }).then(handleResponse),
};

// ─────────────────────────────────────────────
// NEW TENANT (onboarding form)  →  /manage/tenant/
// ─────────────────────────────────────────────
export const NewTenantService = {
  /**
   * POST /manage/tenant/
   * Submit the Add Tenant modal form.
   * Accepts the same camelCase shape as ManageTenants.jsx form state.
   */
  create: (t) =>
    fetch(`${BASE_URL}/tenant/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        organisation_name: t.name,
        city:              t.city,
        state:             t.state || "",
        region:            t.region.toUpperCase(),
        plan:              t.plan.toUpperCase(),
        monthly_volume:    Number(String(t.monthlyVolume || "0").replace(/[^\d.]/g, "")) || 0,
        status:            t.active ? "ACTIVE" : "INACTIVE",
        contact_name:      t.contactName,
        email:             t.contactEmail,
        phone:             t.contactPhone || "",
        agent_mgmt:        (t.modules || []).includes("Agent Mgmt"),
        payout:            (t.modules || []).includes("Payout"),
        performance:       (t.modules || []).includes("Performance"),
        offers:            (t.modules || []).includes("Offers"),
        kyc:               (t.modules || []).includes("KYC"),
        cancel:            false,
        add_tenant:        true,
      }),
    }).then(handleResponse),

  getAll: () =>
    fetch(`${BASE_URL}/tenant/`, { headers }).then(handleResponse),

  getById: (pk) =>
    fetch(`${BASE_URL}/tenant/${pk}/`, { headers }).then(handleResponse),

  delete: (pk) =>
    fetch(`${BASE_URL}/tenant/${pk}/`, { method: "DELETE", headers }).then(handleResponse),
};

// ─────────────────────────────────────────────
// SHOW TENANT (list + detail panel)  →  /manage/show-tenant/
// ─────────────────────────────────────────────
export const ShowTenantService = {
  /**
   * GET /manage/show-tenant/
   * Returns tenants mapped to frontend camelCase shape.
   * Filters match the toolbar dropdowns in ManageTenants.jsx:
   *   { plan: "Pro", region: "East" }  →  ?plan=PRO&region=EAST
   */
  getAll: async (filters = {}) => {
    const clean = {};
    if (filters.plan   && filters.plan   !== "All") clean.plan   = filters.plan.toUpperCase();
    if (filters.region && filters.region !== "All") clean.region = filters.region.toUpperCase();
    if (filters.status && filters.status !== "All") clean.status = filters.status.toUpperCase();

    const qs  = new URLSearchParams(clean).toString();
    const url = qs ? `${BASE_URL}/show-tenant/?${qs}` : `${BASE_URL}/show-tenant/`;
    const data = await fetch(url, { headers }).then(handleResponse);
    return (data || []).map(toFrontend);
  },

  /**
   * GET /manage/show-tenant/<pk>/
   */
  getById: async (pk) => {
    const data = await fetch(`${BASE_URL}/show-tenant/${pk}/`, { headers }).then(handleResponse);
    return toFrontend(data);
  },

  /**
   * POST /manage/show-tenant/
   * Called by ManageTenants.jsx handleSave when tenant.id is new.
   * Returns the created record in frontend shape.
   */
  create: async (tenant) => {
    const data = await fetch(`${BASE_URL}/show-tenant/`, {
      method: "POST",
      headers,
      body: JSON.stringify(toBackend(tenant)),
    }).then(handleResponse);
    return toFrontend(data);
  },

  /**
   * PUT /manage/show-tenant/<pk>/
   * Called by ManageTenants.jsx handleSave when editing an existing tenant.
   * Returns updated record in frontend shape.
   */
  update: async (pk, tenant) => {
    const data = await fetch(`${BASE_URL}/show-tenant/${pk}/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(toBackend(tenant)),
    }).then(handleResponse);
    return toFrontend(data);
  },

  /**
   * PATCH /manage/show-tenant/<pk>/
   * Low-level partial update for arbitrary backend fields.
   */
  patch: async (pk, patch) => {
    const data = await fetch(`${BASE_URL}/show-tenant/${pk}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(patch),
    }).then(handleResponse);
    return toFrontend(data);
  },

  /**
   * DELETE /manage/show-tenant/<pk>/
   * Called by ManageTenants.jsx handleDelete.
   */
  delete: (pk) =>
    fetch(`${BASE_URL}/show-tenant/${pk}/`, {
      method: "DELETE",
      headers,
    }).then(handleResponse),

  // ── Status convenience helpers ──────────────────────────────────

  /** Matches ManageTenants.jsx toggleActive → deactivate branch */
  deactivate: (pk) =>
    ShowTenantService.patch(pk, { status: "INACTIVE", deactivate: true }),

  /** Matches ManageTenants.jsx toggleActive → activate branch */
  activate: (pk) =>
    ShowTenantService.patch(pk, { status: "ACTIVE", deactivate: false }),
};

// ─────────────────────────────────────────────
// Choice constants — mirror Django model choices
// Used for filter dropdowns and form selects
// ─────────────────────────────────────────────
export const REGION_CHOICES = ["North", "South", "East", "West", "Central"];
export const PLAN_CHOICES   = ["Starter", "Pro", "Enterprise"];
export const STATUS_CHOICES = ["ACTIVE", "INACTIVE"];
