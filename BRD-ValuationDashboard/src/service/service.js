import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/field_valuation/",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================================
   Schedule Verification
============================================================ */

export const getScheduleVerifications = () =>
  API.get("schedule-verifications/");

export const createScheduleVerification = (data) =>
  API.post("schedule-verifications/", data);

export const getScheduleVerificationById = (id) =>
  API.get(`schedule-verifications/${id}/`);

export const updateScheduleVerification = (id, data) =>
  API.put(`schedule-verifications/${id}/`, data);

export const deleteScheduleVerification = (id) =>
  API.delete(`schedule-verifications/${id}/`);


/* ============================================================
   Assign Agent
============================================================ */

export const getAssignAgents = () =>
  API.get("assign-agents/");

export const createAssignAgent = (data) =>
  API.post("assign-agents/", data);

export const getAssignAgentById = (id) =>
  API.get(`assign-agents/${id}/`);

export const updateAssignAgent = (id, data) =>
  API.put(`assign-agents/${id}/`, data);

export const deleteAssignAgent = (id) =>
  API.delete(`assign-agents/${id}/`);


/* ============================================================
   Field Verification
============================================================ */

export const getFieldVerifications = () =>
  API.get("field-verifications/");

export const createFieldVerification = (data) =>
  API.post("field-verifications/", data);

export const getFieldVerificationById = (id) =>
  API.get(`field-verifications/${id}/`);

export const updateFieldVerification = (id, data) =>
  API.put(`field-verifications/${id}/`, data);

export const deleteFieldVerification = (id) =>
  API.delete(`field-verifications/${id}/`);


/* ============================================================
   Field Dashboard
============================================================ */

export const getFieldDashboard = () =>
  API.get("field-dashboard/");

export const createFieldDashboard = (data) =>
  API.post("field-dashboard/", data);

export const getFieldDashboardById = (id) =>
  API.get(`field-dashboard/${id}/`);

export const updateFieldDashboard = (id, data) =>
  API.put(`field-dashboard/${id}/`, data);

export const deleteFieldDashboard = (id) =>
  API.delete(`field-dashboard/${id}/`);