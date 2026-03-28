// src/services/collectionService.js
import axiosInstance from "../utils/axiosInstance";

export const collectionAPI = {
  getCollectionStats: async () => {
    const res = await axiosInstance.get(
      "/adminpanel/collection-management/stats/"
    );
    return res.data;
  },

  getOverdueLoans: async () => {
    const res = await axiosInstance.get(
      "/adminpanel/collection-management/overdue-loans/"
    );
    return res.data;
  },

  recordAction: async (id, actionType, remarks) => {
    const res = await axiosInstance.patch(
      `/adminpanel/collection-management/${id}/record-action/`,
      { action_type: actionType, remarks: remarks }
    );
    return res.data;
  }
};
