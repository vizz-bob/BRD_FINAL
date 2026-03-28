// import axiosInstance from "../utils/axiosInstance";

// const BASE = "tenants/rules-config/";

// const rulesService = {
//   // GET CONFIG (ALWAYS RETURN FIRST ITEM OR NULL)
//   async getConfig(tenantId) {
//     if (!tenantId) return null;

//     try {
//       const res = await axiosInstance.get(`${BASE}?tenant=${encodeURIComponent(tenantId)}`);

//       return Array.isArray(res.data) && res.data.length ? res.data[0] : null;
//     } catch (err) {
//       console.error("rulesService.getConfig error:", err);
//       return null;
//     }
//   },

//   // SAVE CONFIG -> if id exists, UPDATE; else CREATE
//   async saveConfig(id, config) {
//     const payload = { config };  // ONLY send config, NEVER send tenant

//     try {
//       if (id) {
//         // UPDATE
//         const res = await axiosInstance.put(`${BASE}${id}/`, payload);
//         return res.data;
//       }

//       // CREATE
//       const res = await axiosInstance.post(BASE, payload);
//       return res.data;
//     } catch (err) {
//       console.error("rulesService.saveConfig error:", err);
//       throw err;
//     }
//   },
// };
import axiosInstance from "../utils/axiosInstance";

const BASE = "rulemanagement/";

const rulesService = {
  // GET CONFIG (ALWAYS RETURN FIRST ITEM OR NULL)
  async getConfig(tenantId) {
    if (!tenantId) return null;
    
    try {
      const url = tenantId
        ? `${BASE}tenant/${encodeURIComponent(tenantId)}/`
        : `${BASE}tenant/`;
      
      const res = await axiosInstance.get(url);
      return res.data?.config ? res.data : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // SAVE CONFIG -> if id exists, UPDATE; else CREATE
  async saveConfig(ruleId, config, tenantId) {
    const url = tenantId
      ? `${BASE}tenant/${encodeURIComponent(tenantId)}/`
      : `${BASE}tenant/`;
    
    const res = await axiosInstance.post(url, { config });
    return res.data;
  },

  // GET ALL RULES
  async getRules(tenantId) {
    try {
      const url = tenantId
        ? `${BASE}tenant/${encodeURIComponent(tenantId)}/`
        : `${BASE}`;
      
      const res = await axiosInstance.get(url);
      return res.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  // GET RULE BY TYPE
  async getRulesByType(tenantId, ruleType) {
    try {
      const url = tenantId
        ? `${BASE}tenant/${encodeURIComponent(tenantId)}/`
        : `${BASE}`;
      
      const res = await axiosInstance.get(url);
      const allRules = res.data || [];
      return allRules.filter(rule => rule.rule_code === ruleType);
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  // CREATE RULE
  async createRule(ruleData, tenantId) {
    try {
      const url = tenantId
        ? `${BASE}tenant/${encodeURIComponent(tenantId)}/`
        : `${BASE}`;
      
      const res = await axiosInstance.post(url, ruleData);
      return res.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  // UPDATE RULE
  async updateRule(ruleId, ruleData, tenantId) {
    try {
      const url = tenantId
        ? `${BASE}tenant/${encodeURIComponent(tenantId)}/`
        : `${BASE}`;
      
      const res = await axiosInstance.put(`${url}${ruleId}/`, ruleData);
      return res.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  // DELETE RULE
  async deleteRule(ruleId, tenantId) {
    try {
      const url = tenantId
        ? `${BASE}tenant/${encodeURIComponent(tenantId)}/`
        : `${BASE}`;
      
      const res = await axiosInstance.delete(`${url}${ruleId}/`);
      return res.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};

export default rulesService;
