import axios from "axios";

const MASTER_BASE_URL =
  import.meta.env.VITE_MASTER_API_BASE_URL || "http://127.0.0.1:8000";

const tenantSubscriptionService = {
  async getPlans() {
    try {
      const res = await axios.get(
        `${MASTER_BASE_URL}/api/v1/adminpanel/subscription/plans/`
      );

      const data = res.data?.results ?? res.data ?? [];

      // ✅ If API gives valid array → use it
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }

      // ⚠️ No data → fallback
      console.warn("No plans from API, using default plans");

      return this.getDefaultPlans();

    } catch (err) {
      console.warn(
        "Subscription API unavailable — using default plans:",
        err.message
      );

      return this.getDefaultPlans();
    }
  },

  // ✅ LOCAL STATIC PLANS (NO BACKEND NEEDED)
  getDefaultPlans() {
    return [
      {
        id: "free",
        name: "Free Plan",
        price: 0,
        duration_days: 30,
        description: "Basic access with limited features",
      },
      {
        id: "pro",
        name: "Pro Plan",
        price: 999,
        duration_days: 30,
        description: "Advanced features for growing businesses",
      },
    ];
  },
};

export default tenantSubscriptionService;