import axiosInstance from "../utils/axiosInstance";

const DATA_INGESTION_BASE = "data-ingestion/";
const QUALIFIED_BASE = "qualified_leads/";
const BASE = "pipeline/";

export const rawLeadsPoolService = {
    list: (params = {}) => axiosInstance.get(`${DATA_INGESTION_BASE}raw_leads/`, { params }),
    patch: (id, data) => axiosInstance.patch(`${DATA_INGESTION_BASE}raw_leads/${id}/`, data),
    delete: (id) => axiosInstance.delete(`${DATA_INGESTION_BASE}raw_leads/${id}/`),
    stats: () => axiosInstance.get(`${DATA_INGESTION_BASE}ingestion-stats/`)
};

export const rawLeadService = {
    list: (params = {}) => axiosInstance.get(`${BASE}raw-leads/`, { params }),
    create: (data) => axiosInstance.post(`${BASE}raw-leads/`, data),
    retrieve: (id) => axiosInstance.get(`${BASE}raw-leads/${id}/`),
    patch: (id, data) => axiosInstance.patch(`${BASE}raw-leads/${id}/`, data),
    delete: (id) => axiosInstance.delete(`${BASE}raw-leads/${id}/`),
};

export const suppressionListService = {
    list: (params = {}) => axiosInstance.get(`${DATA_INGESTION_BASE}suppression-list/`, { params }),
    create: (data) => axiosInstance.post(`${DATA_INGESTION_BASE}suppression-list/`, data),
    delete: (id) => axiosInstance.delete(`${DATA_INGESTION_BASE}suppression-list/${id}/`),
};

export const meetingsService = {
    create: (data) => axiosInstance.post(`${BASE}meetings/`, data),
    list: (params = {}) => axiosInstance.get(`${BASE}meetings/`, { params }),
    saveOutcome: (data) => axiosInstance.patch(`${BASE}save-outcome/`,data),
    reschedule: (id,data) => axiosInstance.post(`${BASE}reschedule-meeting/${id}/`,data),
    cancel: (id) => axiosInstance.post(`${BASE}cancel-meeting/${id}/`)
};

export const qualifiedLeadsService = {
    create: (data) => axiosInstance.post(`${QUALIFIED_BASE}qualified-leads/`, data),
}

export const followUpService = {
    create: (data) => axiosInstance.post(`${BASE}follow-ups/`, data),
    list: (params = {}) => axiosInstance.get(`${BASE}follow-ups/`, { params }),
    patch: (data, id) => axiosInstance.patch(`${BASE}follow-ups/${id}/`,data),
    stats: () => axiosInstance.get(`${BASE}follow-ups/stats/`)
};

export const loanApplicationService = {
    create: (data) => axiosInstance.post(`${BASE}loan-applications/`, data,{
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    list: (params = {}) => axiosInstance.get(`${BASE}loan-applications/`, { params }),
};

export const escalationsService ={
    list: (params = {}) => axiosInstance.get(`${BASE}escalations-list/`, { params }),
    dashboard: () => axiosInstance.get(`${BASE}escalation-dashboard/`),
    
}

export const disbursedLoansService = {
    list: () => axiosInstance.get(`${BASE}disbursed-loans/`)
}

export const leadDeadService = {
    list: () => axiosInstance.get(`${BASE}lead-dead/`),
    create: (data) => axiosInstance.post(`${BASE}lead-dead/`,data)
}

export const leadExpiredService = {
    list: () => axiosInstance.get(`${BASE}lead-expired/`),
    create: (data) => axiosInstance.post(`${BASE}lead-expired/`,data)
}

export const leadLostService = {
    list: () => axiosInstance.get(`${BASE}lead-lost/`),
    create: (data) => axiosInstance.post(`${BASE}lead-lost/`,data)
}

export const leadRejectedService = {
    list: () => axiosInstance.get(`${BASE}lead-rejected/`),
    create: (data) => axiosInstance.post(`${BASE}lead-rejected/`,data)
}

export const leadStatusDashboard = () => {
    return axiosInstance.get(`${BASE}lead-status-dashboard/`)
}