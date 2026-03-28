import { apiClient } from "./api";

const request = async (url, method = "GET", data = null) => {
  const config = { method, url };
  if (data) config.data = data;
  const response = await apiClient(config);
  return response.data;
};

// ══════════════════════════════════════════════
//  REPORTS SERVICE
//  All CRUD + helper operations for /reports/
//
//  WeeklySnapshot model fields:
//    week_number      : int   — ISO week number (1–53)
//    year             : int   — e.g. 2024
//    total_leads      : int   — total leads for the week
//    applications     : int   — applications submitted that week
//    disbursed_amount : decimal — total amount disbursed
//    created_at       : datetime (auto, read-only)
// ══════════════════════════════════════════════

export const reportsService = {

  // ── READ ────────────────────────────────────

  /**
   * Get all weekly snapshots.
   * GET /reports/
   *
   * @param {object} params - optional filters:
   *   {
   *     year        : number,  // e.g. 2024
   *     week_number : number,  // 1–53
   *   }
   *
   * @example
   *   reportsService.getAll({ year: 2024 })
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reports/weekly/${query ? `?${query}` : ""}`);
  },

  /**
   * Get a single weekly snapshot by ID.
   * GET /reports/:id/
   *
   * @param {number} id
   */
  getById: (id) => request(`/reports/${id}/`),

  /**
   * Get all snapshots for a specific year.
   * GET /reports/?year=:year
   *
   * @param {number} year - e.g. 2024
   *
   * @example
   *   reportsService.getByYear(2024)
   */
  getByYear: (year) => request(`/reports/?year=${year}`),

  /**
   * Get snapshot for a specific week and year.
   * Matches unique_together: (week_number, year)
   * GET /reports/?week_number=:week&year=:year
   *
   * @param {number} weekNumber - 1 to 53
   * @param {number} year
   *
   * @example
   *   reportsService.getByWeekAndYear(12, 2024)
   */
  getByWeekAndYear: (weekNumber, year) =>
    request(`/reports/?week_number=${weekNumber}&year=${year}`),

  /**
   * Get snapshot for the current week.
   * Automatically calculates current ISO week number and year.
   *
   * @example
   *   reportsService.getCurrentWeek()
   */
  getCurrentWeek: () => {
    const { weekNumber, year } = reportsService.getCurrentWeekNumber();
    return reportsService.getByWeekAndYear(weekNumber, year);
  },

  /**
   * Get snapshots for the last N weeks from current date.
   * GET /reports/?year=:year  then filters client-side by week range
   *
   * @param {number} n - number of recent weeks to fetch (default 4)
   *
   * @example
   *   reportsService.getLastNWeeks(8)
   */
  getLastNWeeks: async (n = 4) => {
    const { weekNumber, year } = reportsService.getCurrentWeekNumber();
    const weeks = [];

    for (let i = 0; i < n; i++) {
      let w = weekNumber - i;
      let y = year;
      if (w <= 0) {
        y -= 1;
        w += reportsService.getTotalWeeksInYear(y);
      }
      weeks.push({ week_number: w, year: y });
    }

    // Fetch all at once using year filter, then filter by week range
    const allData = await reportsService.getByYear(year);
    const results = (allData?.results || allData || []).filter((snap) =>
      weeks.some((w) => w.week_number === snap.week_number && w.year === snap.year)
    );
    return results;
  },

  // ── CREATE ──────────────────────────────────

  /**
   * Create a new weekly snapshot.
   * POST /reports/
   *
   * @param {object} data - {
   *   week_number      : number,  // required — 1 to 53
   *   year             : number,  // required — e.g. 2024
   *   total_leads      : number,  // required
   *   applications     : number,  // required
   *   disbursed_amount : string,  // required — e.g. "1500000.00"
   * }
   *
   * @example
   *   reportsService.create({
   *     week_number: 12,
   *     year: 2024,
   *     total_leads: 45,
   *     applications: 18,
   *     disbursed_amount: "2750000.00",
   *   });
   */
  create: (data) => request("/reports/", "POST", data),

  /**
   * Create snapshot for the current week automatically.
   * Injects week_number and year from today's date.
   *
   * @param {object} metrics - {
   *   total_leads      : number,
   *   applications     : number,
   *   disbursed_amount : string,
   * }
   *
   * @example
   *   reportsService.createForCurrentWeek({
   *     total_leads: 38,
   *     applications: 14,
   *     disbursed_amount: "1800000.00",
   *   });
   */
  createForCurrentWeek: (metrics) => {
    const { weekNumber, year } = reportsService.getCurrentWeekNumber();
    return reportsService.create({
      ...metrics,
      week_number: weekNumber,
      year,
    });
  },

  // ── UPDATE ──────────────────────────────────

  /**
   * Full update of a weekly snapshot (all fields required).
   * PUT /reports/:id/
   *
   * @param {number} id
   * @param {object} data
   */
  update: (id, data) => request(`/reports/${id}/`, "PUT", data),

  /**
   * Partial update — only send fields you want to change.
   * PATCH /reports/:id/
   *
   * @param {number} id
   * @param {object} fields
   *
   * @example
   *   reportsService.patch(3, { disbursed_amount: "3200000.00" })
   *   reportsService.patch(3, { total_leads: 50, applications: 22 })
   */
  patch: (id, fields) => request(`/reports/${id}/`, "PATCH", fields),

  /**
   * Update only the disbursed amount for a snapshot.
   * PATCH /reports/:id/
   *
   * @param {number} id
   * @param {string|number} amount - e.g. "3200000.00"
   */
  updateDisbursedAmount: (id, amount) =>
    request(`/reports/${id}/`, "PATCH", {
      disbursed_amount: String(parseFloat(amount).toFixed(2)),
    }),

  /**
   * Update lead and application counts for a snapshot.
   * PATCH /reports/:id/
   *
   * @param {number} id
   * @param {number} totalLeads
   * @param {number} applications
   */
  updateCounts: (id, totalLeads, applications) =>
    request(`/reports/${id}/`, "PATCH", {
      total_leads: totalLeads,
      applications: applications,
    }),

  // ── DELETE ──────────────────────────────────

  /**
   * Delete a weekly snapshot.
   * DELETE /reports/:id/
   *
   * @param {number} id
   */
  delete: (id) => request(`/reports/${id}/`, "DELETE"),

  // ── DATE / WEEK HELPERS ──────────────────────

  /**
   * Get the current ISO week number and year.
   * ISO weeks start on Monday. Week 1 = week containing first Thursday of year.
   *
   * @returns {{ weekNumber: number, year: number }}
   *
   * @example
   *   reportsService.getCurrentWeekNumber()
   *   // → { weekNumber: 12, year: 2024 }
   */
  getCurrentWeekNumber: () => {
    const now = new Date();
    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const day = date.getUTCDay() || 7; // make Sunday = 7
    date.setUTCDate(date.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return { weekNumber, year: date.getUTCFullYear() };
  },

  /**
   * Get total ISO weeks in a given year (52 or 53).
   * @param {number} year
   * @returns {number} 52 or 53
   */
  getTotalWeeksInYear: (year) => {
    const dec28 = new Date(year, 11, 28);
    const day = dec28.getDay() || 7;
    dec28.setDate(dec28.getDate() + 4 - day);
    const yearStart = new Date(dec28.getFullYear(), 0, 1);
    return Math.ceil((((dec28 - yearStart) / 86400000) + 1) / 7);
  },

  /**
   * Get the Monday date of a given ISO week and year.
   * @param {number} weekNumber
   * @param {number} year
   * @returns {Date}
   */
  getWeekStartDate: (weekNumber, year) => {
    const jan4 = new Date(year, 0, 4);
    const day = jan4.getDay() || 7;
    const weekStart = new Date(jan4);
    weekStart.setDate(jan4.getDate() - (day - 1) + (weekNumber - 1) * 7);
    return weekStart;
  },

  /**
   * Format a week as a readable date range string.
   * @param {number} weekNumber
   * @param {number} year
   * @returns {string} e.g. "18 Mar – 24 Mar 2024"
   */
  formatWeekRange: (weekNumber, year) => {
    const start = reportsService.getWeekStartDate(weekNumber, year);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const fmt = (d) =>
      d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

    return `${fmt(start)} – ${fmt(end)} ${year}`;
  },

  /**
   * Format disbursed_amount for display (Indian locale).
   * @param {string|number} amount
   * @returns {string} e.g. "₹27,50,000.00"
   */
  formatAmount: (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(amount) || 0),

  /**
   * Calculate conversion rate from a snapshot.
   * Conversion = (applications / total_leads) * 100
   *
   * @param {object} snapshot - { total_leads, applications }
   * @returns {string} e.g. "40.00"
   */
  calcConversionRate: ({ total_leads, applications }) => {
    if (!total_leads || total_leads === 0) return "0.00";
    return ((applications / total_leads) * 100).toFixed(2);
  },
};

// ══════════════════════════════════════════════
//  USAGE EXAMPLES (for reference)
// ══════════════════════════════════════════════

/*

── Get all snapshots for 2024:
   const snapshots = await reportsService.getByYear(2024);

── Get current week snapshot:
   const thisWeek = await reportsService.getCurrentWeek();

── Get last 8 weeks of data (for chart):
   const recentWeeks = await reportsService.getLastNWeeks(8);

── Create snapshot for current week:
   await reportsService.createForCurrentWeek({
     total_leads: 38,
     applications: 14,
     disbursed_amount: "1800000.00",
   });

── Update disbursed amount:
   await reportsService.updateDisbursedAmount(id, 3200000);

── Display week as date range:
   reportsService.formatWeekRange(12, 2024)
   // → "18 Mar – 24 Mar 2024"

── Calculate conversion rate:
   reportsService.calcConversionRate({ total_leads: 45, applications: 18 })
   // → "40.00"

── Format disbursed amount:
   reportsService.formatAmount("2750000.00")
   // → "₹27,50,000.00"

*/