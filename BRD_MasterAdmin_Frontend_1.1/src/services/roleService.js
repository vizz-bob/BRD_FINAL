import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "/adminpanel/access-control/"; // backend path

const roleService = {
  // =========================
  // ROLES
  // =========================

  createRole: async (data) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}roles/`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRoles: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}roles/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // =========================
  // PERMISSIONS
  // =========================

  createPermission: async (data) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}permissions/`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getPermissions: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}permissions/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // =========================
  // ROLE ↔ PERMISSION
  // =========================

  assignPermissionsToRole: async ({ role, permissions }) => {
  try {
    // Ensure array exists
    const cleanedPermissions = (permissions || []).map((id) =>
      id.replace(/[“”]/g, "").trim()
    );

    const response = await axiosInstance.post(
      `${BASE_URL}assign-permission/`,
      {
        role,                  // role UUID
        permissions: cleanedPermissions, // ✅ plural
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},


  // New function to get permissions assigned to a role
  getRolePermissions: async (roleId) => {
    // Backend endpoint that returns all permission IDs assigned to a role
    // We'll use the existing RolePermission list endpoint with a filter: ?role=<roleId>
    try {
      const res = await axiosInstance.get(
      `${BASE_URL}role-permissions/?role=${roleId}`
      );
      if (!res.data) return []; // handle undefined
      return res.data.map((rp) => rp.permission);
    } catch (error) {
      console.error("Failed to fetch role permissions", err);
    return [];
    }
    
  },

  // =========================
  // USER ↔ ROLE
  // =========================

  assignRoleToUser: async (data) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}assign-role/`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserRoles: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}user-roles/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default roleService;
