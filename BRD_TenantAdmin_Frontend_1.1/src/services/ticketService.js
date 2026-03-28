// src/services/ticketService.js
import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "/support/tickets/";

const ticketService = {
  /*
   * Get all tickets (with optional query params)
   * Example params: { status: "open", priority: "high", page: 1 }
   */
  getTickets(params = {}) {
    return axiosInstance.get(BASE_PATH, { params });
  },

  /* Get a single ticket by ID */
  getTicketById(ticketId) {
    return axiosInstance.get(`${BASE_PATH}${ticketId}/`);
  },

  /* Create a new ticket */
  createTicket(data) {
    return axiosInstance.post(BASE_PATH, data);
  },

  /* Update a ticket completely (PUT) */
  updateTicket(ticketId, data) {
    return axiosInstance.put(`${BASE_PATH}${ticketId}/`, data);
  },

  /* Partially update a ticket (PATCH) */
  patchTicket(ticketId, data) {
    return axiosInstance.patch(`${BASE_PATH}${ticketId}/`, data);
  },

  /* Delete a ticket */
  deleteTicket(ticketId) {
    return axiosInstance.delete(`${BASE_PATH}${ticketId}/`);
  },
};

export default ticketService;
