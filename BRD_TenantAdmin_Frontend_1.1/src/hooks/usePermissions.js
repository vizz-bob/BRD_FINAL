import { useState, useEffect } from "react";
import { rolesApi } from "../services/api";
import { userAPI } from "../services/userService"; // Assuming you have a way to get 'me'

// Cache to prevent frequent API calls
const PERMISSIONS_CACHE = {};

export function usePermissions() {
  const [permissions, setPermissions] = useState({});
  const [roleType, setRoleType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        // 1. Get Current User Info (or decode from token)
        // ideally: const user = await authService.getCurrentUser();
        // For now, we simulate fetching the user's role ID from local storage or an API
        const roleId = localStorage.getItem("USER_ROLE_ID"); 
        const type = localStorage.getItem("USER_ROLE_TYPE"); // 'admin', 'manager', 'user'

        setRoleType(type || "");

        if (!roleId) {
            setLoading(false);
            return;
        }

        // 2. Check Cache
        if (PERMISSIONS_CACHE[roleId]) {
          setPermissions(PERMISSIONS_CACHE[roleId]);
          setLoading(false);
          return;
        }

        // 3. Fetch Permissions for this Role
        const res = await rolesApi.getPermissions(roleId);
        if (res.ok) {
           // Normalize response: API might return array ['perm1'] or object {perm1: true}
           const permObj = Array.isArray(res.data) 
             ? res.data.reduce((acc, key) => ({ ...acc, [key]: true }), {}) 
             : res.data;
           
           PERMISSIONS_CACHE[roleId] = permObj;
           setPermissions(permObj);
        }
      } catch (err) {
        console.error("Permission Load Error", err);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, []);

  // Helper function to check a specific permission
  // Usage: if (can('manage_users')) { ... }
  const can = (permissionName) => {
    // Admins usually have all access, or check specific flag
    if (roleType === 'admin' || roleType === 'MASTER_ADMIN') return true;
    return !!permissions[permissionName];
  };

  return { permissions, roleType, loading, can };
}