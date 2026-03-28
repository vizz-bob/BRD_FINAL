import axios from "../utils/axiosInstance";
// LIST
export const getMandates = () => {
  return axios.get("/banking/mandates/");
};


// CREATE
export const createMandate = (data) => {
  return axios.post("/banking/mandates/", data);
};

// DETAIL
export const getMandateById = (id) => {
  return axios.get(`/banking/mandates/${id}/`);
};

// UPDATE (PATCH)
export const updateMandate = (id, data) => {
  return axios.patch(`/banking/mandates/${id}/`, data);
};

