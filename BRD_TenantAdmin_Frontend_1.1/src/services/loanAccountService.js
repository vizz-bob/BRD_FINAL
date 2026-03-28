import axiosInstance from "../utils/axiosInstance";

const BASE_URL = 'loan-accounts/lms-loan-accounts/';

export const loanAccountAPI = {
  // Fetch all LMS loan accounts
  getAllAccounts: () => axiosInstance.get(BASE_URL),

  // Fetch a single LMS loan account by ID
  getAccountById: (id) => axiosInstance.get(`${BASE_URL}${id}/`),

  // Create a new LMS loan account
  createAccount: (data) => axiosInstance.post(BASE_URL, data),

  // Update an existing LMS loan account
  updateAccount: (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data),

  // Partially update an existing LMS loan account
  partialUpdateAccount: (id, data) => axiosInstance.patch(`${BASE_URL}${id}/`, data),

  // Delete an LMS loan account
  deleteAccount: (id) => axiosInstance.delete(`${BASE_URL}${id}/`),

  // Placeholder for custom endpoints (you'll need backend support)
  getSchedule: (id) => axiosInstance.get(`${BASE_URL}${id}/schedule/`),
  getTransactions: (id) => axiosInstance.get(`${BASE_URL}${id}/transactions/`),
  downloadStatement: (id) => axiosInstance.get(`${BASE_URL}${id}/statement/`, { responseType: "blob" }),
  forecloseAccount: (id, data) => axiosInstance.post(`${BASE_URL}${id}/foreclose/`, data),
};
// import axiosInstance from "../utils/axiosInstance";

// const BASE_URL = 'loan-accounts/lms-loan-accounts/';

// export const loanAccountAPI = {
//     getAllAccounts: () => axiosInstance.get(BASE_URL),

//     getAccountById: (id) => axiosInstance.get(`${BASE_URL}${id}/`),

//     getSchedule: (id) => axiosInstance.get(`${BASE_URL}${id}/schedule/`),

//     getTransactions: (id) => axiosInstance.get(`${BASE_URL}${id}/transactions/`),

//     downloadStatement: (id) => axiosInstance.get(`${BASE_URL}${id}/statement/`, { responseType: 'blob' }),

//     forecloseAccount: (id, data) => axiosInstance.post(`${BASE_URL}${id}/foreclose/`, data)
// };
