// src/services/authService.js

const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";

// Save tokens based on remember flag
function saveTokens(access, refresh, remember = false) {
  
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);

      

  // Clear the other storage to prevent conflicts

}

// Get token from either storage
function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY) || sessionStorage.getItem(ACCESS_KEY);
}

// --------------------------------------------- 
// // Decode JWT payload (no library needed) 
// // --------------------------------------------- 
function decodeJwtPayload(token) {
   if (!token) return null; 
   try { 
    const base64 = token.split(".")[1]; 
    const payload = atob(base64.replace(/-/g, "+").replace(/_/g, "/")); 
    return JSON.parse(payload); 
  } catch (e) { 
    console.warn("JWT decode failed:", e); 
    return null; 
  }
}

// --------------------------------------------- 
// // Extract Tenant ID from token payload 
// // --------------------------------------------- 
function getTenantIdFromToken() { 
  const token = getAccessToken(); 
  const payload = decodeJwtPayload(token); 
  
  if (!payload) return null; 
  return payload.tenant || payload.tenant_id || payload.tenantId || null; 
}

// Logout from both storages
function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login";
}

export default {
  saveTokens,
  getAccessToken,
  getTenantIdFromToken,
  logout,
};
