// src/services/crm.service.js
import axiosInstance from "../utils/axiosInstance";

/* ===================== CONTACTS ===================== */
export const getContactStats = () => 
  axiosInstance.get("corecrm/contacts/stats/");

export const getContacts = (params = {}) =>
  axiosInstance.get("corecrm/contacts/", { params });

export const getContactById = (id) =>
  axiosInstance.get(`corecrm/contacts/${id}/`);

export const createContact = (data) =>
  axiosInstance.post("corecrm/contacts/", data);

export const updateContact = (id, data) =>
  axiosInstance.put(`corecrm/contacts/${id}/`, data);

export const partialUpdateContact = (id, data) =>
  axiosInstance.patch(`corecrm/contacts/${id}/`, data);

export const deleteContact = (id) =>
  axiosInstance.delete(`corecrm/contacts/${id}/`);


/* ===================== ACCOUNTS ===================== */
export const getAccounts = (params = {}) =>
  axiosInstance.get("corecrm/accounts/", { params });

export const getAccountById = (id) =>
  axiosInstance.get(`corecrm/accounts/${id}/`);

export const createAccount = (data) =>
  axiosInstance.post("corecrm/accounts/", data);

export const updateAccount = (id, data) =>
  axiosInstance.put(`corecrm/accounts/${id}/`, data);

export const deleteAccount = (id) =>
  axiosInstance.delete(`corecrm/accounts/${id}/`);


/* ===================== TASKS ===================== */
export const getTasks = (params = {}) =>
  axiosInstance.get("corecrm/tasks/", { params });

export const getTaskById = (id) =>
  axiosInstance.get(`corecrm/tasks/${id}/`);

export const createTask = (data) =>
  axiosInstance.post("corecrm/tasks/", data);

export const updateTask = (id, data) =>
  axiosInstance.put(`corecrm/tasks/${id}/`, data);

export const deleteTask = (id) =>
  axiosInstance.delete(`corecrm/tasks/${id}/`);


/* ===================== MEETINGS ===================== */
export const getMeetings = (params = {}) =>
  axiosInstance.get("corecrm/meetings/", { params });

export const getMeetingById = (id) =>
  axiosInstance.get(`corecrm/meetings/${id}/`);

export const createMeeting = (data) =>
  axiosInstance.post("corecrm/meetings/", data);

export const updateMeeting = (id, data) =>
  axiosInstance.put(`corecrm/meetings/${id}/`, data);

export const deleteMeeting = (id) =>
  axiosInstance.delete(`corecrm/meetings/${id}/`);