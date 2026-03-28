import axiosInstance from "../utils/axiosInstance";

// ✅ Fixed: resolved merge conflict — using updated LMS endpoint from feature branch
const BASE_URL = "lms/loan-accounts/";

export const loanAccountAPI = {

  getAllAccounts: () => axiosInstance.get(BASE_URL),

  getAccountById: (id) => axiosInstance.get(`${BASE_URL}${id}/`),

  createAccount: (data) => axiosInstance.post(BASE_URL, data),

  updateAccount: (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data),

  partialUpdateAccount: (id, data) => axiosInstance.patch(`${BASE_URL}${id}/`, data),

  deleteAccount: (id) => axiosInstance.delete(`${BASE_URL}${id}/`),

  // Custom endpoints
  getSchedule: (id) => axiosInstance.get(`${BASE_URL}${id}/schedule/`),
  getTransactions: (id) => axiosInstance.get(`${BASE_URL}${id}/transactions/`),
  downloadStatement: (id) => axiosInstance.get(`${BASE_URL}${id}/statement/`, { responseType: "blob" }),
  forecloseAccount: (id, data) => axiosInstance.post(`${BASE_URL}${id}/foreclose/`, data),

  // ✅ Fixed: added disbursement endpoints from feature branch — were missing in HEAD
  getDisbursementQueue: () => axiosInstance.get(`${BASE_URL}disbursement-queue/`),
  disburseNow: (id) => axiosInstance.post(`${BASE_URL}${id}/disburse-now/`),
};