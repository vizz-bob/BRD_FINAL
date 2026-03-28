import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "/system-settings/";

export const systemSettingsService = {
  getSystemSecurityConfig: () =>
    axiosInstance.get(`${BASE_URL}system-security/`),

  updateSystemSecurityConfig: (payload) =>
    axiosInstance.put(`${BASE_URL}system-security/`, payload),

  getNotificationEmailConfig: () =>
    axiosInstance.get(`${BASE_URL}notifications-email/`),

  updateNotificationEmailConfig: (payload) =>
    axiosInstance.put(`${BASE_URL}notifications-email/`, payload),

  getLoanConfiguration: () =>
    axiosInstance.get(`${BASE_URL}loan-configuration/`),

  updateLoanConfiguration: (payload) =>
    axiosInstance.put(`${BASE_URL}loan-configuration/`, payload),
};
