// src/services/locationService.js
import axiosInstance from "../utils/axiosInstance.js";

export const locationAPI = {
  getCountries: async () => {
    const res = await axiosInstance.get("/locations/countries/"); // adjust endpoint if different
    return res.data;
  },

  getStates: async (countryId) => {
    if (!countryId) return [];
    const res = await axiosInstance.get(`/locations/countries/${countryId}/states/`);
    return res.data;
  },

  getCities: async (stateId) => {
    if (!stateId) return [];
    const res = await axiosInstance.get(`/locations/states/${stateId}/cities/`);
    return res.data;
  },
};
