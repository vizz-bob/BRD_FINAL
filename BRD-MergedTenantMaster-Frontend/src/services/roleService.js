import axiosInstance from "../utils/axiosInstance";

// ✅ Fixed: resolved merge conflict — removed leading slash, matches axiosInstance baseURL pattern
const BASE_URL = "adminpanel/access-control/";
const LEGACY_ROLES_URL = "adminpanel/roles/roles/";
const LEGACY_ROLE_DETAIL_URL = "adminpanel/roles/";

// ✅ Kept from feature branch: fallback trigger on 403/404
const shouldFallback = (error) => {
  const code = error?.response?.status;
  return code === 403 || code === 404;
};

// ✅ Kept from feature branch: normalizes role shape from either endpoint
const normalizeRole = (role) => {
  const status = role?.status || (role?.is_active ? "active" : "inactive");
  const roleTypeFromDescription =
    typeof role?.description === "string" && role.description.startsWith("role_type:")
      ? role.description.replace("role_type:", "")
      : "sole";

  return {
    ...role,
    role_name: role?.role_name || role?.name || "",
    status,
    role_type: role?.role_type || roleTypeFromDescription,
  };
};

// ✅ Kept from feature branch: builds payload in backend-expected format
const buildRolePayload = (data = {}) => {
  const roleName = data.role_name || data.name || "";
  const status = data.status || (data.is_active ? "active" : "inactive");
  const roleType = data.role_type || "sole";

  return {
    name: roleName,
    description: data.description || `role_type:${roleType}`,
    is_active: data.is_active ?? status === "active",
  };
};

const roleService = {
  // =========================
  // ROLES
  // =========================

  createRole: async (data) => {
    try {
      // ✅ Fixed: use buildRolePayload + normalizeRole from feature branch
      const payload = buildRolePayload(data);
      const response = await axiosInstance.post(`${BASE_URL}roles/`, payload);
      return normalizeRole(response.data);
    } catch (error) {
      // ✅ Fixed: added fallback logic from feature branch
      if (shouldFallback(error)) {
        const legacyPayload = { name: data?.role_name || data?.name || "" };
        const legacy = await axiosInstance.post(LEGACY_ROLES_URL, legacyPayload);
        return normalizeRole(legacy.data);
      }
      throw error.response?.data || error;
    }
  },

  getRoles: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}roles/`);
      // ✅ Fixed: normalize array + paginated response from feature branch
      const rows = Array.isArray(response.data)
        ? response.data
        : (response.data?.results || []);
      return rows.map(normalizeRole);
    } catch (error) {
      // ✅ Fixed: added fallback logic from feature branch
      if (shouldFallback(error)) {
        const legacy = await axiosInstance.get(LEGACY_ROLES_URL);
        const rows = Array.isArray(legacy.data)
          ? legacy.data
          : (legacy.data?.results || []);
        return rows.map(normalizeRole);
      }
      throw error.response?.data || error;
    }
  },

  deleteRole: async (id) => {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}roles/${id}/`);
      return response.data;
    } catch (error) {
      // ✅ Fixed: added fallback logic from feature branch
      if (shouldFallback(error)) {
        const legacy = await axiosInstance.delete(`${LEGACY_ROLE_DETAIL_URL}${id}/`);
        return legacy.data;
      }
      throw error.response?.data || error;
    }
  },

  updateRole: async (id, data) => {
    try {
      // ✅ Fixed: use buildRolePayload + normalizeRole from feature branch
      const payload = buildRolePayload(data);
      const response = await axiosInstance.patch(`${BASE_URL}roles/${id}/`, payload);
      return normalizeRole(response.data);
    } catch (error) {
      // ✅ Fixed: added fallback logic from feature branch
      if (shouldFallback(error)) {
        const legacyPayload = { name: data?.role_name || data?.name || "" };
        const legacy = await axiosInstance.patch(`${LEGACY_ROLE_DETAIL_URL}${id}/`, legacyPayload);
        return normalizeRole(legacy.data);
      }
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
  // ROLE <-> PERMISSION
  // =========================

  assignPermissionsToRole: async ({ role, permissions }) => {
    try {
      // ✅ Fixed: use String(id) cast from feature branch — safer than assuming id is already a string
      const cleanedPermissions = (permissions || []).map((id) =>
        String(id).replace(/[""]/g, "").trim()
      );

      const response = await axiosInstance.post(
        `${BASE_URL}assign-permission/`,
        {
          role,
          permissions: cleanedPermissions,
        }
      );
      return response.data;
    } catch (error) {
      // ✅ Fixed: added fallback logic from feature branch
      if (shouldFallback(error)) {
        const permission_ids = (permissions || [])
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id));
        const legacy = await axiosInstance.post(
          `${LEGACY_ROLES_URL}${role}/permissions/`,
          { permission_ids }
        );
        return legacy.data;
      }
      throw error.response?.data || error;
    }
  },

  getRolePermissions: async (roleId) => {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}role-permissions/?role=${roleId}`
      );
      if (!res.data) return [];
      return res.data.map((rp) => rp.permission);
    } catch (error) {
      // ✅ Fixed: added fallback logic from feature branch
      if (shouldFallback(error)) {
        try {
          const legacy = await axiosInstance.get(`${LEGACY_ROLES_URL}${roleId}/permissions/`);
          const rows = Array.isArray(legacy.data) ? legacy.data : (legacy.data?.results || []);
          return rows.map((p) => p.id);
        } catch (legacyError) {
          console.error("Failed to fetch role permissions", legacyError);
          return [];
        }
      }
      console.error("Failed to fetch role permissions", error);
      return [];
    }
  },

  // =========================
  // USER <-> ROLE
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

  // =========================
  // TENANT API ALIASES
  // =========================

  list: async () => {
    const data = await roleService.getRoles();
    return { data };
  },
  create: (data) => roleService.createRole(data),
  update: (id, data) => roleService.updateRole(id, data),
  delete: (id) => roleService.deleteRole(id),
};

export const roleAPI = roleService;
export { roleService };
export default roleService;