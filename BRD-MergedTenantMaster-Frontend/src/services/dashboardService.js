import axiosInstance from "../utils/axiosInstance";

export const dashboardApi = {
  fetchDashboard: () => axiosInstance.get("/dashboard/kpis-and-charts/"),
};