// src/services/collectionService.js
import axiosInstance from "../utils/axiosInstance";

export const collectionAPI = {
  getCollectionStats: async () => {
    const res = await axiosInstance.get(
      "/loan-collections/stats/"
    );
    return res.data;
  },

  getOverdueLoans: async () => {
    const res = await axiosInstance.get(
      "/loan-collections/overdue-loans/"
    );
    return res.data;
  }
};
