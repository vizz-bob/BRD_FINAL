import { apiClient } from "./api";

const request = async (url, method = "GET", data = null) => {
  const config = { method, url };
  if (data) config.data = data;
  const response = await apiClient(config);
  return response.data;
};

// ══════════════════════════════════════════════
//  STATUS CONSTANTS
//  Mirrors Django CommissionStatement.STATUS_CHOICES
// ══════════════════════════════════════════════

export const COMMISSION_STATUS = {
  PAID: "PAID",
  PENDING: "PENDING",
};

// ══════════════════════════════════════════════
//  COMMISSION SERVICE
//  All CRUD operations for /incentives/ endpoint
// ══════════════════════════════════════════════

export const commissionService = {

  // ── READ ────────────────────────────────────

  /**
   * Get all commission statements.
   * Supports filtering via query params.
   * GET /incentives/
   *
   * @param {object} params - filter options:
   *   {
   *     user     : number,   // filter by user ID
   *     month    : number,   // 1–12
   *     year     : number,   // e.g. 2024
   *     status   : string,   // "PAID" | "PENDING"
   *   }
   *
   * @example
   *   commissionService.getAll({ year: 2024, status: "PENDING" })
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/incentives/${query ? `?${query}` : ""}`);
  },

  /**
   * Get a single commission statement by ID.
   * GET /incentives/:id/
   *
   * @param {number} id
   */
  getById: (id) => request(`/incentives/${id}/`),

  /**
   * Get all statements for a specific user.
   * GET /incentives/?user=:userId
   *
   * @param {number} userId
   */
  getByUser: (userId) => request(`/incentives/?user=${userId}`),

  /**
   * Get all statements for a specific month/year.
   * GET /incentives/?month=:month&year=:year
   *
   * @param {number} month - 1 to 12
   * @param {number} year  - e.g. 2024
   */
  getByMonth: (month, year) => request(`/incentives/?month=${month}&year=${year}`),

  /**
   * Get all PENDING commission statements.
   * GET /incentives/?status=PENDING
   */
  getPending: () => request(`/incentives/?status=${COMMISSION_STATUS.PENDING}`),

  /**
   * Get all PAID commission statements.
   * GET /incentives/?status=PAID
   */
  getPaid: () => request(`/incentives/?status=${COMMISSION_STATUS.PAID}`),

  /**
   * Get statement for a specific user + month + year.
   * Matches the unique_together constraint: (user, month, year)
   * GET /incentives/?user=:userId&month=:month&year=:year
   *
   * @param {number} userId
   * @param {number} month
   * @param {number} year
   */
  getByUserAndMonth: (userId, month, year) =>
    request(`/incentives/?user=${userId}&month=${month}&year=${year}`),

  // ── CREATE ──────────────────────────────────

  /**
   * Create a new commission statement.
   * POST /incentives/
   *
   * @param {object} data - {
   *   user                 : number,   // User ID (required)
   *   month                : number,   // 1–12 (required)
   *   year                 : number,   // e.g. 2024 (required)
   *   total_amount         : string,   // e.g. "15000.00" (required)
   *   disbursed_volume_bonus: string,  // default "0.00"
   *   conversion_bonus     : string,   // default "0.00"
   *   speed_bonus          : string,   // default "0.00"
   *   team_bonus           : string,   // default "0.00"
   *   status               : string,   // "PAID" | "PENDING" (default "PENDING")
   * }
   *
   * @example
   *   commissionService.create({
   *     user: 3,
   *     month: 3,
   *     year: 2024,
   *     total_amount: "18500.00",
   *     disbursed_volume_bonus: "5000.00",
   *     conversion_bonus: "3000.00",
   *     speed_bonus: "1500.00",
   *     team_bonus: "2000.00",
   *     status: "PENDING",
   *   });
   */
  create: (data) => request("/incentives/", "POST", data),

  // ── UPDATE ──────────────────────────────────

  /**
   * Full update of a commission statement.
   * PUT /incentives/:id/
   *
   * @param {number} id
   * @param {object} data - all fields required
   */
  update: (id, data) => request(`/incentives/${id}/`, "PUT", data),

  /**
   * Partial update — update only specific fields.
   * PATCH /incentives/:id/
   *
   * @param {number} id
   * @param {object} fields - only the fields you want to change
   *
   * @example
   *   commissionService.patch(5, { status: "PAID" })
   *   commissionService.patch(5, { total_amount: "20000.00", team_bonus: "3000.00" })
   */
  patch: (id, fields) => request(`/incentives/${id}/`, "PATCH", fields),

  /**
   * Mark a commission statement as PAID.
   * PATCH /incentives/:id/
   *
   * @param {number} id
   */
  markAsPaid: (id) =>
    request(`/incentives/${id}/`, "PATCH", { status: COMMISSION_STATUS.PAID }),

  /**
   * Mark a commission statement as PENDING.
   * PATCH /incentives/:id/
   *
   * @param {number} id
   */
  markAsPending: (id) =>
    request(`/incentives/${id}/`, "PATCH", { status: COMMISSION_STATUS.PENDING }),

  /**
   * Update bonus breakdown fields only.
   * PATCH /incentives/:id/
   *
   * @param {number} id
   * @param {object} bonuses - {
   *   disbursed_volume_bonus?: string,
   *   conversion_bonus?      : string,
   *   speed_bonus?           : string,
   *   team_bonus?            : string,
   *   total_amount?          : string,
   * }
   */
  updateBonuses: (id, bonuses) => request(`/incentives/${id}/`, "PATCH", bonuses),

  // ── DELETE ──────────────────────────────────

  /**
   * Delete a commission statement.
   * DELETE /incentives/:id/
   *
   * @param {number} id
   */
  delete: (id) => request(`/incentives/${id}/`, "DELETE"),

  // ── HELPERS ─────────────────────────────────

  /**
   * Calculate total_amount from individual bonus fields.
   * Use this on the frontend before creating/updating a statement.
   *
   * @param {object} bonuses - {
   *   disbursed_volume_bonus: number,
   *   conversion_bonus      : number,
   *   speed_bonus           : number,
   *   team_bonus            : number,
   * }
   * @returns {string} total as fixed 2 decimal string e.g. "18500.00"
   */
  calcTotal: ({ disbursed_volume_bonus = 0, conversion_bonus = 0, speed_bonus = 0, team_bonus = 0 }) => {
    const total =
      parseFloat(disbursed_volume_bonus) +
      parseFloat(conversion_bonus) +
      parseFloat(speed_bonus) +
      parseFloat(team_bonus);
    return total.toFixed(2);
  },

  /**
   * Get the current month and year as numbers.
   * Useful for defaulting form fields.
   * @returns {{ month: number, year: number }}
   */
  getCurrentMonthYear: () => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  },

  /**
   * Format month number to month name.
   * @param {number} month - 1 to 12
   * @returns {string} e.g. "March"
   */
  formatMonthName: (month) =>
    new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" }),
};