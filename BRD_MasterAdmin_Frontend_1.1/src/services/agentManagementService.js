import axiosInstance from "../utils/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const base_url = `${BASE_URL}/api/v1/adminpanel/agent`

export const agentManagementService = {
  getChannelPartners: () =>
    axiosInstance.get(`${base_url}/channel-partners/`).then(res => res.data),

  getChannelPartnerById: (id) =>
    axiosInstance.get(`${base_url}/channel-partners/${id}/`).then(res => res.data),

  createChannelPartner: (payload) =>
    axiosInstance.post(`${base_url}/channel-partners/`, payload).then(res => res.data),

  updateChannelPartner: (id, payload) =>
    axiosInstance.put(`${base_url}/channel-partners/${id}/`, payload).then(res => res.data),

  deleteChannelPartner: (id) =>
    axiosInstance.delete(`${base_url}/channel-partners/${id}/`),

  toggleStatus: (id) =>
    axiosInstance.patch(`${base_url}/approval-list/${id}/toggle_status/`)
};
