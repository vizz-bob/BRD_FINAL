import axiosInstance from "../utils/axiosInstance";

/**
 * Base paths exactly as backend exposes them
 */
const BASE_PATHS = {
  eligibility: "/adminpanel/eligibility-management/eligibility",
  banking: "/adminpanel/eligibility-management/banking",
  obligations: "/adminpanel/eligibility-management/obligations",
  score_cards: "/adminpanel/eligibility-management/score-cards",
};

/**
 * Generic CRUD creator
 */
const createCrudService = (BASE) => ({
  list: async () => {
    try {
      const res = await axiosInstance.get(`${BASE}/`);
      return res.data || [];
    } catch (error) {
      console.error(`Error fetching list (${BASE}):`, error.response?.data || error);
      return [];
    }
  },

  retrieve: async (id) => {
    try {
      const res = await axiosInstance.get(`${BASE}/${id}/`);
      return res.data || null;
    } catch (error) {
      console.error(`Error retrieving ${BASE} ${id}:`, error.response?.data || error);
      return null;
    }
  },

  create: async (data) => {
    try {
      const res = await axiosInstance.post(`${BASE}/`, data);
      return res.data || null;
    } catch (error) {
      console.error(`Error creating (${BASE}):`, error.response?.data || error);
      throw error; // important for form validation
    }
  },

  update: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${BASE}/${id}/`, data);
      return res.data || null;
    } catch (error) {
      console.error(`Error updating ${BASE} ${id}:`, error.response?.data || error);
      throw error;
    }
  },

  partialUpdate: async (id, data) => {
    try {
      const res = await axiosInstance.patch(`${BASE}/${id}/`, data);
      return res.data || null;
    } catch (error) {
      console.error(`Error partially updating ${BASE} ${id}:`, error.response?.data || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const res = await axiosInstance.delete(`${BASE}/${id}/`);
      return res.status === 204;
    } catch (error) {
      console.error(`Error deleting ${BASE} ${id}:`, error.response?.data || error);
      return false;
    }
  },
});

/**
 * Exported services
 */
export const eligibilityManagementService = createCrudService(
  BASE_PATHS.eligibility
);

export const bankingManagementService = createCrudService(
  BASE_PATHS.banking
);

export const obligationsManagementService = createCrudService(
  BASE_PATHS.obligations
);

export const scoreCardManagementService = createCrudService(
  BASE_PATHS.score_cards
);
