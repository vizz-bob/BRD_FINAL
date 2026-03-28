import api from "./axiosInstance";
import { casesMock } from "./mock/caseMock";

export const getCases = async () => {
  try {
    const response = await api.get("/cases/list/");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch cases from backend:", err);
    throw err;
  }
};
