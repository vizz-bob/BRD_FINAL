import axiosInstance from "../utils/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const base_url = `${BASE_URL}/api/v1/adminpanel/approval-master`;

/* ================= APPROVAL MASTER ================= */

export const approvalMasterService = {
  getApprovalList: () =>
    axiosInstance.get(`${base_url}/approval-list/`).then(res => res.data),

  getApprovalById: (id) =>
    axiosInstance.get(`${base_url}/approval-list/${id}/`).then(res => res.data),

  createApproval: (payload) =>
    axiosInstance.post(`${base_url}/approval-list/`, payload).then(res => res.data),

  updateApproval: (id, payload) =>
    axiosInstance.put(`${base_url}/approval-list/${id}/`, payload).then(res => res.data),

  deleteApproval: (id) =>
    axiosInstance.delete(`${base_url}/approval-list/${id}/`),

  toggleStatus: (id) =>
    axiosInstance.patch(`${base_url}/approval-list/${id}/toggle_status/`)
};

/* ================= APPROVAL ASSIGNMENT ================= */

export const approvalAssignmentService = {
  getAssignments: () =>
    axiosInstance.get(`${base_url}/manage-approval/`).then(res => res.data),

  getAssignmentById: (id) =>
    axiosInstance.get(`${base_url}/manage-approval/${id}/`).then(res => res.data),

  createAssignment: (payload) =>
    axiosInstance.post(`${base_url}/manage-approval/`, payload).then(res => res.data),

  updateAssignment: (id, payload) =>
    axiosInstance.put(`${base_url}/manage-approval/${id}/`, payload).then(res => res.data),

  deleteAssignment: (id) =>
    axiosInstance.delete(`${base_url}/manage-approval/${id}/`)
};

/* ================= ESCALATION MASTER ================= */

export const escalationMasterService = {
  getEscalations: () =>
    axiosInstance.get(`${base_url}/escalation-master/`).then(res => res.data),

  getEscalationById: (id) =>
    axiosInstance.get(`${base_url}/escalation-master/${id}/`).then(res => res.data),

  createEscalation: (payload) =>
    axiosInstance.post(`${base_url}/escalation-master/`, payload).then(res => res.data),

  updateEscalation: (id, payload) =>
    axiosInstance.put(`${base_url}/escalation-master/${id}/`, payload).then(res => res.data),

  deleteEscalation: (id) =>
    axiosInstance.delete(`${base_url}/escalation-master/${id}/`)
};
