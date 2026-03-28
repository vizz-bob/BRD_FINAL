import axios from 'axios';
import CONFIG from '../config/apiConfig';

const API_URL = CONFIG.API_BASE_URL;

const dashboardApi = axios.create({
  baseURL: `${API_URL}/dashboard`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch dashboard summary statistics
 */
export const fetchDashboardSummary = async () => {
  try {
    console.log('Fetching dashboard summary from:', `${API_URL}/dashboard/dashboard-summary/`);
    const response = await dashboardApi.get('dashboard-summary/');
    console.log('Dashboard summary response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  }
};

/**
 * Fetch all documents
 */
export const fetchDocuments = async () => {
  try {
    console.log('Fetching documents from:', `${API_URL}/dashboard/documents/`);
    const response = await dashboardApi.get('documents/');
    console.log('Documents response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  }
};

/**
 * Fetch all reviews
 */
export const fetchReviews = async () => {
  try {
    console.log('Fetching reviews from:', `${API_URL}/dashboard/reviews/`);
    const response = await dashboardApi.get('reviews/');
    console.log('Reviews response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  }
};

/**
 * Fetch document by ID
 */
export const fetchDocumentById = async (documentId) => {
  try {
    const response = await dashboardApi.get(`documents/${documentId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

/**
 * Create a new document
 */
export const createDocument = async (documentData) => {
  try {
    const response = await dashboardApi.post('documents/', documentData);
    return response.data;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

/**
 * Create a new review
 */
export const createReview = async (reviewData) => {
  try {
    const response = await dashboardApi.post('reviews/', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

/**
 * Generate report
 */
export const generateReport = async (reportData) => {
  try {
    const response = await dashboardApi.post('reports/', reportData);
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export default {
  fetchDashboardSummary,
  fetchDocuments,
  fetchReviews,
  fetchDocumentById,
  createDocument,
  createReview,
  generateReport,
};
