// src/services/tenantSubscriptionService.js
// ─────────────────────────────────────────────────────────────────────────────
// Fetches subscription plans from the MASTER backend (public endpoint).
// No auth header needed — the plans list is AllowAny on master.
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

const MASTER_BASE_URL =
  import.meta.env.VITE_MASTER_API_BASE_URL || "http://127.0.0.1:8001";

const tenantSubscriptionService = {
  async getPlans() {
    try {
      const res = await axios.get(
        `${MASTER_BASE_URL}/api/v1/adminpanel/subscription/plans/`
      );

      // Handle both plain array and paginated { results: [] }
      const data = res.data?.results ?? res.data ?? [];

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Empty or invalid plans response");
      }

      // Return raw plans — SubscriptionPlans.jsx handles normalization
      return data;
    } catch (err) {
      console.warn("Subscription API unavailable — showing free plan only:", err.message);
      // Return empty array; SubscriptionPlans.jsx always shows the static free plan
      return [];
    }
  },
};

export default tenantSubscriptionService;
