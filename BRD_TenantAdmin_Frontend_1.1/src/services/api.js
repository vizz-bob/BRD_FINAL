import axiosInstance from "../utils/axiosInstance";

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
      const res = await axiosInstance.get("adminpanel/role-master/");
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Error fetching roles:", err);
      return { ok: false, error: err };
    }
  },

  // Create a new role
  create: async (payload) => {
    try {
      const res = await axiosInstance.post("adminpanel/role-master/", payload);
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Error creating role:", err);
      return { ok: false, error: err };
    }
  },

  // Get permissions for a role
  getPermissions: async (roleId) => {
    try {
      const res = await axiosInstance.get(`adminpanel/role-master/${roleId}/permissions/`);
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Error fetching permissions:", err);
      return { ok: false, error: err };
    }
  },

  // Update permissions for a role
  updatePermissions: async (roleId, permissions) => {
    try {
      const res = await axiosInstance.post(`adminpanel/role-master/${roleId}/permissions/`, { permissions });
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("Error updating permissions:", err);
      return { ok: false, error: err };
    }
  },
};

