import axiosInstance from '../utils/axiosInstance'

const BASE = '/data_lead';
const BULK_UPLOAD_BASE = '/bulk_upload';

const toFormData = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => fd.append(key, v));
      } else {
        fd.append(key, value);
      }
    }
  });
  return fd;
};

export const getLeads = (params = {}) =>
  axiosInstance.get(`${BASE}/leads/`, { params });

/*
|--------------------------------------------------------------------------
| THIRD PARTY LEADS  →  /data_lead/third-party-leads/
|--------------------------------------------------------------------------
| POST  /third-party-leads/manual/         → create single lead manually
| POST  /third-party-leads/api-sync/       → bulk sync from external API
| POST  /third-party-leads/upload-file/    → CSV file upload
| GET   /third-party-leads/unassigned/     → unassigned leads
| GET   /third-party-leads/assigned/       → assigned leads (?user_id=)
| POST  /third-party-leads/allocate/       → { user_id, lead_ids }
| POST  /third-party-leads/reallocate/     → { from_user_id?, to_user_id, lead_ids }
*/
export const ThirdPartyLeadService = {
  list: (params = {}) =>
    axiosInstance.get(`${BASE}/third-party-leads/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BASE}/third-party-leads/${id}/`),

  delete: (id) =>
    axiosInstance.delete(`${BASE}/third-party-leads/${id}/`),

  manualCreate: (data) =>
    axiosInstance.post(`${BASE}/third-party-leads/manual/`, data),

  getUsers: () =>
    axiosInstance.get(`${BASE}/users/`),

  uploadFile: (formData, config = {}) =>
    axiosInstance.post(`${BASE}/third-party-leads/upload-file/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    }),

  apiSync: (leads) =>
    axiosInstance.post(`${BASE}/third-party-leads/api-sync/`, { leads }),

  unassigned: (params = {}) =>
    axiosInstance.get(`${BASE}/third-party-leads/unassigned/`, { params }),

  assigned: (params = {}) =>
    axiosInstance.get(`${BASE}/third-party-leads/assigned/`, { params }),

  allocate: (payload) =>
    axiosInstance.post(`${BASE}/third-party-leads/allocate/`, payload),

  reallocate: (payload) =>
    axiosInstance.post(`${BASE}/third-party-leads/reallocate/`, payload),

  updateStatus: (id, payload) =>
    axiosInstance.patch(`${BASE}/third-party-leads/${id}/`, payload),
};

/*
|--------------------------------------------------------------------------
| CAMPAIGN LEADS  →  /data_lead/campaign-leads/
|--------------------------------------------------------------------------
*/
export const CampaignLeadService = {
  list: (params = {}) =>
    axiosInstance.get(`${BASE}/campaign-leads/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BASE}/campaign-leads/${id}/`),

  uploadFile: (formData, config = {}) =>
    axiosInstance.post(`${BASE}/campaign-leads/upload-file/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    }),

  unassigned: (params = {}) =>
    axiosInstance.get(`${BASE}/campaign-leads/unassigned/`, { params }),

  allocate: (payload) =>
    axiosInstance.post(`${BASE}/campaign-leads/allocate/`, payload),

  reallocate: (payload) =>
    axiosInstance.post(`${BASE}/campaign-leads/reallocate/`, payload),
};

/*
|--------------------------------------------------------------------------
| INTERNAL LEADS  →  /data_lead/internal-leads/
|--------------------------------------------------------------------------
*/
export const InternalLeadService = {
  list: (params = {}) =>
    axiosInstance.get(`${BASE}/internal-leads/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BASE}/internal-leads/${id}/`),

  create: (data) =>
    axiosInstance.post(`${BASE}/internal-leads/`, data),

  update: (id, data) =>
    axiosInstance.put(`${BASE}/internal-leads/${id}/`, data),

  delete: (id) =>
    axiosInstance.delete(`${BASE}/internal-leads/${id}/`),

  employeeReferral: (data) =>
    axiosInstance.post(`${BASE}/internal-leads/employee-referral/`, data),

  uploadFile: (formData) =>
    axiosInstance.post(`${BASE}/internal-leads/upload-file/`, formData, {
      headers: { 'Content-Type': undefined },
    }),

  allocate: (payload) =>
    axiosInstance.post(`${BASE}/internal-leads/allocate/`, payload),

  reallocate: (id, payload) =>
    axiosInstance.post(`${BASE}/internal-leads/${id}/reallocate/`, payload),

  stats: () =>
    axiosInstance.get(`${BASE}/internal-leads/stats/`),
};

/*
|--------------------------------------------------------------------------
| ONLINE LEADS  →  /data_lead/online-leads/
|--------------------------------------------------------------------------
*/
export const OnlineLeadService = {
  list: (params = {}) =>
    axiosInstance.get(`${BASE}/online-leads/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BASE}/online-leads/${id}/`),

  create: (data) =>
    axiosInstance.post(`${BASE}/online-leads/`, data),

  uploadFile: (formData) =>
    axiosInstance.post(`${BASE}/online-leads/upload-file/`, formData, {
      headers: { 'Content-Type': undefined },
    }),

  allocate: (payload) =>
    axiosInstance.post(`${BASE}/online-leads/allocate/`, payload),

  reallocate: (id, payload) =>
    axiosInstance.post(`${BASE}/online-leads/${id}/reallocate/`, payload),

  stats: () =>
    axiosInstance.get(`${BASE}/online-leads/stats/`),

  update: (id, data) =>
    axiosInstance.put(`${BASE}/online-leads/${id}/`, data),

  delete: (id) =>
    axiosInstance.delete(`${BASE}/online-leads/${id}/`),
};

/*
|--------------------------------------------------------------------------
| USED LEADS  →  /data_lead/used-leads/
|--------------------------------------------------------------------------
*/
export const UsedLeadService = {
  list: (params = {}) =>
    axiosInstance.get(`${BASE}/used-leads/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BASE}/used-leads/${id}/`),

  allocate: (payload) =>
    axiosInstance.post(`${BASE}/used-leads/allocate/`, payload),

  reallocate: (id, payload) =>
    axiosInstance.post(`${BASE}/used-leads/${id}/reallocate/`, payload),

  allData: (params = {}) =>
    axiosInstance.get(`${BASE}/used-leads/all_data/`, { params }),
};

/*
|--------------------------------------------------------------------------
| ARCHIVED LEADS  →  /data_lead/archived-leads/
|--------------------------------------------------------------------------
| POST /archived-leads/allocate/          → { lead_ids, user_id }
| POST /archived-leads/{id}/reallocate/   → { user_id, reason }
| POST /archived-leads/{id}/reactivate/   → (staff only)
| GET  /archived-leads/all_data/          → ?is_reactivated=true|false
| GET  /archived-leads/export/            → CSV blob
*/
export const ArchivedLeadService = {
  list: (params = {}) =>
    axiosInstance.get(`${BASE}/archived-leads/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BASE}/archived-leads/${id}/`),

  allocate: (payload) =>
    axiosInstance.post(`${BASE}/archived-leads/allocate/`, payload),

  reallocate: (id, payload) =>
    axiosInstance.post(`${BASE}/archived-leads/${id}/reallocate/`, payload),

  reactivate: (id) =>
    axiosInstance.post(`${BASE}/archived-leads/${id}/reactivate/`),

  allData: (params = {}) =>
    axiosInstance.get(`${BASE}/archived-leads/all_data/`, { params }),

  export: (params = {}) =>
    axiosInstance.get(`${BASE}/archived-leads/export/`, {
      params,
      responseType: 'blob',
    }),
};

/*
|--------------------------------------------------------------------------
| BULK UPLOAD  →  /bulk_upload/
|--------------------------------------------------------------------------
*/
export const BulkUploadService = {
  list: (params = {}) =>
    axiosInstance.get(`${BASE}/bulk-uploads/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BASE}/bulk-uploads/${id}/`),

  create: (data) =>
    axiosInstance.post(`${BASE}/bulk-uploads/`, toFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, data) =>
    axiosInstance.put(`${BASE}/bulk-uploads/${id}/`, toFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) =>
    axiosInstance.delete(`${BASE}/bulk-uploads/${id}/`),
};

export const FileUploadService = {
  list: (params = {}) =>
    axiosInstance.get(`${BULK_UPLOAD_BASE}/file-uploads/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BULK_UPLOAD_BASE}/file-uploads/${id}/`),

  create: (formData) =>
    axiosInstance.post(`${BULK_UPLOAD_BASE}/file-uploads/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) =>
    axiosInstance.delete(`${BULK_UPLOAD_BASE}/file-uploads/${id}/`),
};

export const ManualEntryService = {
  list: (params = {}) =>
    axiosInstance.get(`${BULK_UPLOAD_BASE}/manual-entries/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BULK_UPLOAD_BASE}/manual-entries/${id}/`),

  create: (data) =>
    axiosInstance.post(`${BULK_UPLOAD_BASE}/manual-entries/`, data),

  update: (id, data) =>
    axiosInstance.put(`${BULK_UPLOAD_BASE}/manual-entries/${id}/`, data),

  delete: (id) =>
    axiosInstance.delete(`${BULK_UPLOAD_BASE}/manual-entries/${id}/`),
};

export const FtpIntegrationService = {
  list: (params = {}) =>
    axiosInstance.get(`${BULK_UPLOAD_BASE}/ftp-integrations/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BULK_UPLOAD_BASE}/ftp-integrations/${id}/`),

  create: (data) =>
    axiosInstance.post(`${BULK_UPLOAD_BASE}/ftp-integrations/`, data),

  update: (id, data) =>
    axiosInstance.put(`${BULK_UPLOAD_BASE}/ftp-integrations/${id}/`, data),

  delete: (id) =>
    axiosInstance.delete(`${BULK_UPLOAD_BASE}/ftp-integrations/${id}/`),

  testConnection: (id) =>
    axiosInstance.post(`${BULK_UPLOAD_BASE}/ftp-integrations/${id}/test_connection/`),
};

export const ApiIntegrationService = {
  list: (params = {}) =>
    axiosInstance.get(`${BULK_UPLOAD_BASE}/api-integrations/`, { params }),

  retrieve: (id) =>
    axiosInstance.get(`${BULK_UPLOAD_BASE}/api-integrations/${id}/`),

  create: (data) =>
    axiosInstance.post(`${BULK_UPLOAD_BASE}/api-integrations/`, data),

  update: (id, data) =>
    axiosInstance.put(`${BULK_UPLOAD_BASE}/api-integrations/${id}/`, data),

  delete: (id) =>
    axiosInstance.delete(`${BULK_UPLOAD_BASE}/api-integrations/${id}/`),

  testApi: (id) =>
    axiosInstance.post(`${BULK_UPLOAD_BASE}/api-integrations/${id}/test_api/`),
};
