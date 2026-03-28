import axiosInstance from "../utils/axiosInstance";

/* =====================================================
   BASE PATH
===================================================== */
const BASE_URL = "/users/audit-logs/";

/* =====================================================
   MOCK DATA (Auto fallback until backend stable)
===================================================== */
const MOCK_LOGS = [
  {
    id: 1,
    user_email: "andheri.branch@los.com",
    description: "Home Loan product synced",
    action_type: "CREATE",
    module: "BRANCH",
    timestamp: "2025-12-24T11:30:00",
    ip_address: "192.168.1.11",
  },
  {
    id: 2,
    user_email: "admin@los.com",
    description: "Interest rate updated",
    action_type: "UPDATE",
    module: "RULE",
    timestamp: "2025-12-24T15:12:00",
    ip_address: "192.168.1.22",
  },
  {
    id: 3,
    user_email: "system@los.com",
    description: "Multiple failed login attempts",
    action_type: "SECURITY",
    module: "SECURITY",
    timestamp: "2025-12-25T09:10:00",
    ip_address: "10.0.0.9",
  },
];

/* =====================================================
   SERVICE
===================================================== */
export const auditService = {
  /* =====================================================
     AUDIT OVERVIEW
  ===================================================== */
  async getOverview() {
    try {
      const res = await axiosInstance.get(`${BASE_URL}overview/`);
      return res.data;
    } catch {
      return {
        total_logs: MOCK_LOGS.length,
        abnormal_logs: MOCK_LOGS.filter((l) => l.module === "SECURITY").length,
        branch_logs: MOCK_LOGS.filter((l) => l.module === "BRANCH").length,
      };
    }
  },

  /* =====================================================
     MAIN AUDIT LOGS
  ===================================================== */
  async getLogs(params = {}) {
    try {
      const res = await axiosInstance.get(BASE_URL, { params });
      return res.data?.results || [];
    } catch {
      let data = MOCK_LOGS;

      if (params.search) {
        data = data.filter(
          (l) =>
            l.user_email.toLowerCase().includes(params.search.toLowerCase()) ||
            l.description.toLowerCase().includes(params.search.toLowerCase())
        );
      }

      if (params.module) {
        data = data.filter((l) => l.module === params.module);
      }

      return data;
    }
  },

  /* =====================================================
     USER ACTIVITY LOGS
  ===================================================== */
  async getUserActivity(params = {}) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}user-activity/`, { params });
      return res.data?.results || [];
    } catch {
      return MOCK_LOGS.filter((l) => l.module === "SECURITY");
    }
  },

  /* =====================================================
     SYSTEM EVENTS
  ===================================================== */
  async getSystemEvents(params = {}) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}system-events/`, { params });
      return res.data?.results || [];
    } catch {
      return MOCK_LOGS.filter((l) => l.module === "RULE");
    }
  },

  /* =====================================================
     ADD LOG
  ===================================================== */
  async addLog(payload) {
    try {
      const res = await axiosInstance.post(BASE_URL, payload);
      return res.data;
    } catch {
      MOCK_LOGS.push({ ...payload, id: Date.now() });
      return payload;
    }
  },

  /* =====================================================
     UPDATE LOG
  ===================================================== */
  async updateLog(id, payload) {
    try {
      const res = await axiosInstance.patch(`${BASE_URL}${id}/`, payload);
      return res.data;
    } catch {
      return payload;
    }
  },

  /* =====================================================
     DELETE LOG
  ===================================================== */
  async deleteLog(id) {
    try {
      await axiosInstance.delete(`${BASE_URL}${id}/`);
    } catch {
      // MOCK delete
    }
  },

  /* =====================================================
     EXPORT LOGS
  ===================================================== */
  async exportLogs(params = {}) {
    try {
      const res = await axiosInstance.get(`${BASE_URL}export/`, {
        params,
        responseType: "blob",
      });
      return res;
    } catch {
      return null;
    }
  },
};
