import { apiClient } from "./api"; // assuming we have a configured axios instance in api.js

export const settingsService = {
    // Profile
    getProfile: async () => {
        const response = await apiClient.get("/auth/profile/");
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await apiClient.patch("/auth/profile/", data);
        return response.data;
    },

    // Notifications
    getNotificationPrefs: async () => {
        const response = await apiClient.get("/auth/notifications/");
        return response.data;
    },
    updateNotificationPrefs: async (data) => {
        const response = await apiClient.patch("/auth/notifications/", data);
        return response.data;
    },

    // Availability
    getAvailability: async () => {
        const response = await apiClient.get("/auth/availability/");
        return response.data;
    },
    updateAvailability: async (data) => {
        const response = await apiClient.post("/auth/availability/", data);
        return response.data;
    },

    // Security
    changePassword: async (data) => {
        const response = await apiClient.post("/auth/change-password/", data);
        return response.data;
    },
    toggleTwoFactor: async (enabled) => {
        const response = await apiClient.post("/auth/two-factor/", { enabled });
        return response.data;
    },

    // Team Members
    getTeamMembers: async () => {
        const response = await apiClient.get("/auth/team-members/");
        return response.data;
    },
    createTeamMember: async (data) => {
        const response = await apiClient.post("/auth/team-members/", data);
        return response.data;
    },
    deleteTeamMember: async (id) => {
        const response = await apiClient.delete(`/auth/team-members/${id}/`);
        return response.data;
    },

    // Territories
    getTerritories: async () => {
        const response = await apiClient.get("/auth/territories/");
        return response.data;
    },
    createTerritory: async (data) => {
        const response = await apiClient.post("/auth/territories/", data);
        return response.data;
    },
    updateTerritory: async (id, data) => {
        const response = await apiClient.patch(`/auth/territories/${id}/`, data);
        return response.data;
    },
    deleteTerritory: async (id) => {
        const response = await apiClient.delete(`/auth/territories/${id}/`);
        return response.data;
    },
    assignTerritory: async (id, userId) => {
        const response = await apiClient.patch(`/auth/territories/${id}/assign/`, { user_id: userId });
        return response.data;
    },

    // Integrations
    getIntegrations: async () => {
        const response = await apiClient.get("/auth/integrations/");
        return response.data;
    },
    createIntegration: async (data) => {
        const response = await apiClient.post("/auth/integrations/", data);
        return response.data;
    },
    updateIntegration: async (id, data) => {
        const response = await apiClient.patch(`/auth/integrations/${id}/`, data);
        return response.data;
    },
    toggleIntegration: async (id) => {
        const response = await apiClient.post(`/auth/integrations/${id}/toggle/`);
        return response.data;
    },
    syncIntegration: async (id) => {
        const response = await apiClient.post(`/auth/integrations/${id}/sync/`);
        return response.data;
    },
    deleteIntegration: async (id) => {
        const response = await apiClient.delete(`/auth/integrations/${id}/`);
        return response.data;
    },

    // General Settings
    getGeneralSettings: async () => {
        const response = await apiClient.get("/auth/general-settings/");
        return response.data;
    },
    updateGeneralSettings: async (data) => {
        const response = await apiClient.patch("/auth/general-settings/", data);
        return response.data;
    },

    // Privacy Settings
    getPrivacySettings: async () => {
        const response = await apiClient.get("/auth/privacy-settings/");
        return response.data;
    },
    updatePrivacySettings: async (data) => {
        const response = await apiClient.patch("/auth/privacy-settings/", data);
        return response.data;
    },

    // Data & Privacy Settings
    getDataPrivacySettings: async () => {
        const response = await apiClient.get("/auth/data-privacy/");
        return response.data;
    },
    updateDataPrivacySettings: async (data) => {
        const response = await apiClient.patch("/auth/data-privacy/", data);
        return response.data;
    },
    exportLeads: async () => {
        // First enable the flag, then download
        await apiClient.patch("/auth/data-privacy/", { export_leads: true });
        const response = await apiClient.post("/auth/data-privacy/export-leads/", {}, { responseType: "blob" });
        return response.data; // Blob
    },
    exportReports: async () => {
        // First enable the flag, then download
        await apiClient.patch("/auth/data-privacy/", { export_reports: true });
        const response = await apiClient.post("/auth/data-privacy/export-reports/", {}, { responseType: "blob" });
        return response.data; // Blob
    },

    // Delete Account
    deleteAccount: async (confirmText) => {
        const response = await apiClient.delete("/auth/delete-account/", { data: { confirm: confirmText } });
        return response.data;
    },
};
