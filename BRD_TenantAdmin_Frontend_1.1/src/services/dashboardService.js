import axiosInstance from "../utils/axiosInstance";

export const dashboardApi = {
  fetchDashboard: () => axiosInstance.get("adminpanel/dashboard/full/"),
};
