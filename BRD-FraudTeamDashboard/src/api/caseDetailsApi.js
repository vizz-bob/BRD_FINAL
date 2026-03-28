import api from "./axiosInstance";
import { caseDetailsMockData } from "./mock/caseDetailsMock";

export const getCaseDetails = async (caseId) => {
  try {
    const response = await api.get(`/cases/${caseId}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch case details for ${caseId}:`, error);
    throw error;
  }
};

export const updateCaseStatus = async (caseId, action) => {
  try {
    const response = await api.patch(`/cases/${caseId}/action/${action}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to update status for ${caseId}:`, error);
    throw error;
  }
};
