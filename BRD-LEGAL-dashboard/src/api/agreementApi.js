import axios from 'axios';
import CONFIG from '../config/apiConfig';

const API_URL = CONFIG.API_BASE_URL;

const agreementApi = axios.create({
  baseURL: `${API_URL}/agreement-approvals`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================
// AGREEMENT ENDPOINTS
// ==========================

/**
 * Fetch all agreements from backend
 */
export const fetchAgreements = async () => {
  try {
    const response = await agreementApi.get('list/');
    return response.data;
  } catch (error) {
    console.error('Error fetching agreements:', error);
    throw error;
  }
};

/**
 * Fetch a single agreement by ID
 */
export const fetchAgreementById = async (agreementId) => {
  try {
    const response = await agreementApi.get(`${agreementId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agreement:', error);
    throw error;
  }
};

/**
 * Create a new agreement
 */
export const createAgreement = async (agreementData) => {
  try {
    const response = await agreementApi.post('create/', {
      agreement_id: agreementData.agreement_id || generateAgreementId(),
      agreement_type: agreementData.agreement_type,
      client_name: agreementData.client_name,
      amount: agreementData.amount,
      priority: agreementData.priority,
      assigned_to: agreementData.assigned_to,
      status: agreementData.status || 'Pending',
    });
    return response.data;
  } catch (error) {
    console.error('Error creating agreement:', error);
    throw error;
  }
};

/**
 * Update an existing agreement
 */
export const updateAgreement = async (agreementId, agreementData) => {
  try {
    const response = await agreementApi.put(`${agreementId}/`, {
      agreement_id: agreementData.agreement_id,
      agreement_type: agreementData.agreement_type,
      client_name: agreementData.client_name,
      amount: agreementData.amount,
      priority: agreementData.priority,
      assigned_to: agreementData.assigned_to,
      status: agreementData.status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating agreement:', error);
    throw error;
  }
};

/**
 * Delete an agreement
 */
export const deleteAgreement = async (agreementId) => {
  try {
    const response = await agreementApi.delete(`${agreementId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting agreement:', error);
    throw error;
  }
};

/**
 * Approve an agreement
 */
export const approveAgreement = async (agreementId) => {
  try {
    const response = await agreementApi.patch(`${agreementId}/`, {
      status: 'Approved',
    });
    return response.data;
  } catch (error) {
    console.error('Error approving agreement:', error);
    throw error;
  }
};

/**
 * Reject an agreement
 */
export const rejectAgreement = async (agreementId) => {
  try {
    const response = await agreementApi.patch(`${agreementId}/`, {
      status: 'Rejected',
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting agreement:', error);
    throw error;
  }
};

/**
 * Bulk assign agreements to an agent
 */
export const bulkAssignAgreements = async (agreementIds, assignee) => {
  try {
    const response = await agreementApi.post('bulk-assign/', {
      agreements: agreementIds,
      assigned_to: assignee,
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk assigning agreements:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 */
export const fetchDashboardStats = async () => {
  try {
    const response = await agreementApi.get('dashboard/');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Generate a unique agreement ID
 */
const generateAgreementId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `AGR-${timestamp}-${random}`;
};

export default agreementApi;
