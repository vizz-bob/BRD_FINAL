import axiosInstance from "../utils/axiosInstance";

const BASE = "/adminpanel/home-dashboard";

export const dashboardService = {
  getSummaryCards: async () => {
  try {
    const res = await axiosInstance.get(`${BASE}/summary/`);
    const data = res.data || {};

    return {
      totalOrganizations: data.total_organizations || 0,
      totalBranches: data.total_branches || 0,
      activeUsers: data.active_users || 0,
      activeLoans: data.active_loans || 0,
      dailyDisbursement: data.daily_disbursement || "0.00",
      apiStatus: data.api_status || "OK",
      alerts: 0, // API does not return alerts, default to 0
    };
  } catch {
    return {
      totalOrganizations: 0,
      totalBranches: 0,
      activeUsers: 0,
      activeLoans: 0,
      dailyDisbursement: "0.00",
      apiStatus: "Error",
      alerts: 0,
    };
  }
},


  getLoanTrends: async () => {
    try {
      const res = await axiosInstance.get(`${BASE}/disbursement-trends/`);
      return res.data?.charts?.monthlyDisbursement || [];
    } catch {
      return [];
    }
  },

  getUsersPerBranch: async () => {
    try {
      const res = await axiosInstance.get(`${BASE}/summary/`);
      return res.data?.charts?.usersPerBranch || [];
    } catch {
      return [];
    }
  },

  getActivities: async () => {
    try {
      const res = await axiosInstance.get(`${BASE}/activity/`);
      return res.data || [];
    } catch {
      return [];
    }
  },

  getAlerts: async () => {
    try {
      const res = await axiosInstance.get(`${BASE}/alerts/`);
      return res.data || [];
    } catch {
      return [];
    }
  },
};
