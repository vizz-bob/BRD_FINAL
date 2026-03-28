import api from '../api/axios';

const leadService = {
    // Hot Leads
    getHotLeads: async () => {
        console.group('LeadService: getHotLeads');
        try {
            const response = await api.get('hot_lead/hot-leads/');
            console.log('Success:', response.data);
            return response.data;
        } finally {
            console.groupEnd();
        }
    },

    getHotLeadKanban: async () => {
        console.group('LeadService: getHotLeadKanban');
        try {
            const response = await api.get('conversion_board/leads/kanban/');
            console.log('Success:', response.data);
            return response.data;
        } finally {
            console.groupEnd();
        }
    },

    getHotLeadStats: async () => {
        console.group('LeadService: getHotLeadStats');
        try {
            const response = await api.get('conversion_board/leads/stats/');
            console.log('Success:', response.data);
            return response.data;
        } finally {
            console.groupEnd();
        }
    },

    updateHotLeadStatus: async (id, status) => {
        console.group(`LeadService: updateHotLeadStatus [ID: ${id}]`);
        try {
            const isHotLead = typeof id === 'string' && id.startsWith('HOT-');
            const numericId = isHotLead ? id.replace('HOT-', '') : id;

            const endpoint = isHotLead
                ? `hot_lead/hot-leads/${numericId}/update-status/`
                : `conversion_board/leads/${numericId}/update-status/`;

            const response = await api.patch(endpoint, { status });
            return response.data;
        } finally {
            console.groupEnd();
        }
    },

    updateHotLead: async (id, data) => {
        console.group(`LeadService: updateHotLead [ID: ${id}]`);
        try {
            const isHotLead = typeof id === 'string' && id.startsWith('HOT-');
            const numericId = isHotLead ? id.replace('HOT-', '') : id;

            const endpoint = isHotLead
                ? `hot_lead/hot-leads/${numericId}/update/`
                : `conversion_board/leads/${numericId}/update/`;

            const response = await api.patch(endpoint, data);
            return response.data;
        } finally {
            console.groupEnd();
        }
    },

    moveRawToQualified: async (id) => {
        const response = await api.post(`pipeline/stage-1/raw-leads/${id}/qualified/`);
        return response.data;
    },

    markRawLeadDead: async (id) => {
        const response = await api.post(`pipeline/stage-1/raw-leads/${id}/dead/`);
        return response.data;
    },

    // Transitions from Hot Leads
    moveToQualified: async (id) => {
        const isHotLead = typeof id === 'string' && id.startsWith('HOT-');
        const numericId = isHotLead ? id.replace('HOT-', '') : id;

        const endpoint = isHotLead
            ? `hot_lead/hot-leads/${numericId}/qualified/`
            : `conversion_board/leads/${numericId}/qualified/`;

        const response = await api.post(endpoint);
        return response.data;
    },

    markAsDormant: async (id) => {
        const isHotLead = typeof id === 'string' && id.startsWith('HOT-');
        const numericId = isHotLead ? id.replace('HOT-', '') : id;

        const endpoint = isHotLead
            ? `hot_lead/hot-leads/${numericId}/dead/`
            : `conversion_board/leads/${numericId}/dormant/`;

        const response = await api.post(endpoint);
        return response.data;
    },

    // Qualified Leads
    getQualifiedLeads: async (status = 'all') => {
        const params = status !== 'all' ? { status: status.toUpperCase().replace('-', '_') } : {};
        const response = await api.get('qualified_leads/qualified-leads/', { params });
        return response.data;
    },

    getQualifiedLeadDetails: async (id) => {
        const response = await api.get(`qualified_leads/qualified-leads/${id}/`);
        return response.data;
    },

    updateQualifiedLead: async (id, data) => {
        const response = await api.patch(`qualified_leads/qualified-leads/${id}/`, data);
        return response.data;
    },

    moveToHot: async (id) => {
        const response = await api.post(`qualified_leads/qualified-leads/${id}/move-to-hot/`);
        return response.data;
    },

    markIneligible: async (id) => {
        const response = await api.post(`qualified_leads/qualified-leads/${id}/mark-ineligible/`);
        return response.data;
    },

    scheduleFollowUp: async (id, data) => {
        const response = await api.post(`qualified_leads/qualified-leads/${id}/schedule-follow-up/`, data);
        return response.data;
    },

    uploadDocument: async (leadId, formData) => {
        const response = await api.post(`qualified_leads/qualified-leads/${leadId}/upload-document/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Lead Status Management (Unconverted Leads)
    getLostLeads: async () => {
        const response = await api.get('pipeline/lead-lost/');
        return response.data;
    },

    getDeadLeads: async () => {
        const response = await api.get('pipeline/lead-dead/');
        return response.data;
    },

    getExpiredLeads: async () => {
        const response = await api.get('pipeline/lead-expired/');
        return response.data;
    },

    getRejectedLeads: async () => {
        const response = await api.get('pipeline/lead-rejected/');
        return response.data;
    }
};

export default leadService;
