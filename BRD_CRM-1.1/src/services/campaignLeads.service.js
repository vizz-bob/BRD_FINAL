import axiosInstance from '../utils/axiosInstance';

// All campaign lead endpoints live under data_lead/campaign-leads/
const BASE = '/data_lead/campaign-leads';

const CampaignLeadAPI = {
  // GET /data_lead/campaign-leads/
  list: (params = {}) =>
    axiosInstance.get(`${BASE}/`, { params }),

  // GET /data_lead/campaign-leads/:id/
  retrieve: (id) =>
    axiosInstance.get(`${BASE}/${id}/`),

  // POST /data_lead/campaign-leads/  — multipart (file upload)
  create: (formData) =>
    axiosInstance.post(`${BASE}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // DELETE /data_lead/campaign-leads/:id/
  delete: (id) =>
    axiosInstance.delete(`${BASE}/${id}/`),

  // GET /data_lead/campaign-leads/unassigned/
  unassigned: (params = {}) =>
    axiosInstance.get(`${BASE}/unassigned/`, { params }),

  // POST /data_lead/campaign-leads/allocate/
  // Payload: { user_id: number, lead_ids: number[] }
  allocate: (payload) =>
    axiosInstance.post(`${BASE}/allocate/`, payload),

  // POST /data_lead/campaign-leads/reallocate/
  // Payload: { from_user_id?: number, to_user_id: number, lead_ids: number[] }
  reallocate: (payload) =>
    axiosInstance.post(`${BASE}/reallocate/`, payload),

  // Dedicated file upload — hits /campaign-leads/upload-file/
  // Must delete Content-Type so axios sets multipart/form-data with correct boundary
  uploadFile: (formData) => axiosInstance.post(`${BASE}/upload-file/`, formData, {
    headers: { "Content-Type": undefined },
  }),
};

export default CampaignLeadAPI;