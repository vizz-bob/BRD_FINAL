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

// export default rulesService;


import axiosInstance from "../utils/axiosInstance";

const BASE = "rules/tenant/";

const rulesService = {
  async getConfig(tenantId) {
    try {
      const url = tenantId
        ? `rules/tenant/${tenantId}/`
        : `rules/`;

      const res = await axiosInstance.get(url);
      return res.data?.config ? res.data : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async saveConfig(ruleId, config, tenantId) {
    const url = tenantId
      ? `rules/tenant/${tenantId}/`
      : `rules/`;

    const res = await axiosInstance.post(url, { config });
    return res.data;
  },
};
export default rulesService;
