import axiosInstance from "../utils/axiosInstance";

const base_url = "adminpanel/agent"

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

  toggleStatus: async (id) => {
    const current = await axiosInstance.get(`${base_url}/channel-partners/${id}/`);
    const nextStatus = current?.data?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    return axiosInstance.patch(`${base_url}/channel-partners/${id}/`, { status: nextStatus });
  }
};
