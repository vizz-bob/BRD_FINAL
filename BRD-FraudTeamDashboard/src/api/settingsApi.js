import api from "./axiosInstance";

const parseName = (profile = {}) => {
  if (profile.full_name) {
    const parts = profile.full_name.trim().split(/\s+/);
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
    };
  }

  return {
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
  };
};

export const settingsApi = {
  async getProfile() {
    try {
      const response = await api.get("/settings/profile/");
      return response.data;
    } catch {
      const fallback = await api.get("/accounts/me/");
      return fallback.data;
    }
  },

  async updateProfile(profilePayload) {
    const { firstName, lastName } = parseName(profilePayload);
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: profilePayload.email,
    };

    if (profilePayload.phone !== undefined) {
      payload.phone = profilePayload.phone;
    }

    try {
      const response = await api.patch("/settings/profile/", payload);
      return response.data;
    } catch {
      const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
      const response = await api.patch("/fraud/settings/profile/edit/", {
        full_name: fullName,
        email: profilePayload.email,
      });
      return response.data;
    }
  },

  async updateEmail(email) {
    const response = await api.patch("/settings/email/", { email });
    return response.data;
  },

  async updatePassword(newPassword, confirmPassword) {
    const response = await api.patch("/settings/password/", {
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return response.data;
  },

  async getNotifications() {
    const response = await api.get("/settings/notifications/");
    return response.data;
  },

  async updateNotifications(payload) {
    const response = await api.patch("/settings/notifications/", payload);
    return response.data;
  },

  async getRoles() {
    const response = await api.get("/settings/roles/");
    return response.data;
  },

  async createRole(name) {
    const response = await api.post("/settings/roles/", { name });
    return response.data;
  },

  async deleteRole(roleId) {
    const response = await api.delete(`/settings/roles/${roleId}/`);
    return response.data;
  },

  async getRolePermissions(roleId) {
    const response = await api.get(`/settings/roles/${roleId}/permissions/`);
    return response.data;
  },

  async saveRolePermissions(roleId, permissions) {
    const response = await api.post(`/settings/roles/${roleId}/permissions/`, {
      permissions,
    });
    return response.data;
  },

  async getModules() {
    const response = await api.get("/settings/modules/");
    return response.data;
  },
  async getUsers() {
    const response = await api.get("/settings/users/");
    return response.data;
  },
  async getGroups() {
    const response = await api.get("/settings/groups/");
    return response.data;
  },
};
