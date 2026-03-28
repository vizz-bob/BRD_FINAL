// DashboardService.js
// Base API URL — update this to match your Django backend host
const BASE_URL = "http://localhost:8000/api";

// ─────────────────────────────────────────────
// Utility: central fetch wrapper
// ─────────────────────────────────────────────
async function apiRequest(endpoint, method = "GET", body = null) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      // If you add token auth later: "Authorization": `Bearer ${token}`
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Request failed with status ${response.status}`
    );
  }

  // 204 No Content (DELETE responses have no body)
  if (response.status === 204) return null;

  return response.json();
}

// ─────────────────────────────────────────────
// DASHBOARD
// Maps to: GET/POST /api/dashboard/
//          GET/PUT/PATCH/DELETE /api/dashboard/<pk>/
// ─────────────────────────────────────────────
export const DashboardAPI = {
  /**
   * GET /api/dashboard/
   * Returns list of all dashboard snapshots
   */
  getAll: () => apiRequest("/dashboard/"),

  /**
   * GET /api/dashboard/<pk>/
   * Returns a single dashboard snapshot by ID
   */
  getById: (pk) => apiRequest(`/dashboard/${pk}/`),

  /**
   * POST /api/dashboard/
   * Create a new dashboard snapshot
   * @param {Object} data - { total_agents, active_agents, total_payouts, ... }
   */
  create: (data) => apiRequest("/dashboard/", "POST", data),

  /**
   * PUT /api/dashboard/<pk>/
   * Full update of a dashboard snapshot
   */
  update: (pk, data) => apiRequest(`/dashboard/${pk}/`, "PUT", data),

  /**
   * PATCH /api/dashboard/<pk>/
   * Partial update of a dashboard snapshot
   */
  partialUpdate: (pk, data) => apiRequest(`/dashboard/${pk}/`, "PATCH", data),

  /**
   * DELETE /api/dashboard/<pk>/
   */
  delete: (pk) => apiRequest(`/dashboard/${pk}/`, "DELETE"),
};

// ─────────────────────────────────────────────
// RECENT AGENTS
// Maps to: GET/POST /api/recent-agents/
//          GET/PUT/PATCH/DELETE /api/recent-agents/<pk>/
// ─────────────────────────────────────────────
export const RecentAgentsAPI = {
  /**
   * GET /api/recent-agents/
   * Returns list of all recent agents
   */
  getAll: () => apiRequest("/recent-agents/"),

  /**
   * GET /api/recent-agents/<pk>/
   */
  getById: (pk) => apiRequest(`/recent-agents/${pk}/`),

  /**
   * POST /api/recent-agents/
   * @param {Object} data - { agent_id, name, agent_type, payout, status }
   */
  create: (data) => apiRequest("/recent-agents/", "POST", data),

  /**
   * PUT /api/recent-agents/<pk>/
   */
  update: (pk, data) => apiRequest(`/recent-agents/${pk}/`, "PUT", data),

  /**
   * PATCH /api/recent-agents/<pk>/
   */
  partialUpdate: (pk, data) =>
    apiRequest(`/recent-agents/${pk}/`, "PATCH", data),

  /**
   * DELETE /api/recent-agents/<pk>/
   */
  delete: (pk) => apiRequest(`/recent-agents/${pk}/`, "DELETE"),
};

// ─────────────────────────────────────────────
// ACCOUNTS (Create Account)
// Maps to: GET/POST /api/accounts/
//          GET/PUT/PATCH/DELETE /api/accounts/<pk>/
// ─────────────────────────────────────────────
export const AccountsAPI = {
  /**
   * GET /api/accounts/
   */
  getAll: () => apiRequest("/accounts/"),

  /**
   * GET /api/accounts/<pk>/
   */
  getById: (pk) => apiRequest(`/accounts/${pk}/`),

  /**
   * POST /api/accounts/
   * Register a new account
   * @param {Object} data - { full_name, email, phone, password, confirm_password, role, agree_terms }
   */
  register: (data) => apiRequest("/accounts/", "POST", data),

  /**
   * PUT /api/accounts/<pk>/
   */
  update: (pk, data) => apiRequest(`/accounts/${pk}/`, "PUT", data),

  /**
   * PATCH /api/accounts/<pk>/
   */
  partialUpdate: (pk, data) => apiRequest(`/accounts/${pk}/`, "PATCH", data),

  /**
   * DELETE /api/accounts/<pk>/
   */
  delete: (pk) => apiRequest(`/accounts/${pk}/`, "DELETE"),
};

// ─────────────────────────────────────────────
// SIGN IN
// Maps to: POST /api/sign-in/
//          GET/PUT/PATCH/DELETE /api/sign-in/<pk>/
// ─────────────────────────────────────────────
export const AuthAPI = {
  /**
   * POST /api/sign-in/
   * Sign in with email and password
   * @param {Object} credentials - { email, password, remember_me }
   */
  signIn: (credentials) => apiRequest("/sign-in/", "POST", credentials),

  /**
   * GET /api/sign-in/
   * List sign-in records (admin use)
   */
  getAll: () => apiRequest("/sign-in/"),

  /**
   * GET /api/sign-in/<pk>/
   */
  getById: (pk) => apiRequest(`/sign-in/${pk}/`),

  /**
   * DELETE /api/sign-in/<pk>/
   */
  delete: (pk) => apiRequest(`/sign-in/${pk}/`, "DELETE"),
};

// ─────────────────────────────────────────────
// USAGE EXAMPLES
// ─────────────────────────────────────────────

/*
--- Dashboard ---
const snapshots = await DashboardAPI.getAll();
const snapshot  = await DashboardAPI.getById(1);
const newSnap   = await DashboardAPI.create({ total_agents: 10, date: "2025-01-01" });
await DashboardAPI.partialUpdate(1, { active_agents: 8 });
await DashboardAPI.delete(1);

--- Recent Agents ---
const agents    = await RecentAgentsAPI.getAll();
const agent     = await RecentAgentsAPI.getById(3);
const newAgent  = await RecentAgentsAPI.create({
  agent_id: "AGT-001", name: "Ravi Kumar",
  agent_type: "DSA", payout: 5000.00, status: "active"
});

--- Accounts ---
const account = await AccountsAPI.register({
  full_name: "Priya Sharma", email: "priya@example.com",
  phone: "9876543210",  password: "SecurePass@1",
  confirm_password: "SecurePass@1", role: "DSA_MANAGER",
  agree_terms: true
});

--- Auth ---
const session = await AuthAPI.signIn({
  email: "priya@example.com", password: "SecurePass@1", remember_me: true
});
*/