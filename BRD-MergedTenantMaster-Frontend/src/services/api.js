import axiosInstance from "../utils/axiosInstance";

export const api = axiosInstance;

// Tenants
export const tenantAPI = {
  getAll: () => axiosInstance.get("/"),
  getById: (id) => axiosInstance.get(`${id}/`),
  create: (data) => axiosInstance.post("/", data),
  update: (id, data) => axiosInstance.put(`${id}/`, data),
  delete: (id) => axiosInstance.delete(`${id}/`),
};

// Branches
export const branchAPI = {
  getAll: () => axiosInstance.get("branches/"),
  getById: (id) => axiosInstance.get(`branches/${id}/`),
};

export const rolesApi = {
  // List all roles
  list: async () => {
    try {
      const res = await axiosInstance.get("adminpanel/roles/");
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Error fetching roles:", err);
      return { ok: false, error: err };
    }
  },

  // Create a new role
  create: async (payload) => {
    try {
      const res = await axiosInstance.post("adminpanel/roles/", payload);
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Error creating role:", err);
      return { ok: false, error: err };
    }
  },

  // Fetch permissions for a role
  getPermissions: async (roleId) => {
    try {
      const res = await axiosInstance.get(`adminpanel/access-control/role-permissions?role=${roleId}`);
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Error fetching permissions:", err);
      return { ok: false, error: err };
    }
  },

  // Update permissions for a role
  updatePermissions: async (roleId, permissionData) => {
    try {
      const res = await axiosInstance.post(`adminpanel/access-control/assign-permission/`, permissionData);
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Error updating permissions:", err);
      return { ok: false, error: err };
    }
  },
};

