import axios from 'axios';
import CONFIG from '../config/apiConfig';

const API_URL = CONFIG.API_BASE_URL;

const documentValidationApi = axios.create({
  baseURL: `${API_URL}/document-validation`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================
// DOCUMENT ENDPOINTS
// ==========================

/**
 * Fetch all documents from backend
 */
export const fetchDocuments = async () => {
  try {
    const response = await documentValidationApi.get('documents/');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

/**
 * Fetch a single document by ID
 */
export const fetchDocumentById = async (documentId) => {
  try {
    const response = await documentValidationApi.get(`documents/${documentId}/`);
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
    const response = await documentValidationApi.post('documents/', {
      name: documentData.name,
      document_type: documentData.document_type,
      client_name: documentData.client_name,
      status: documentData.status || 'Pending',
      issues: documentData.issues || '',
    });
    return response.data;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

/**
 * Update an existing document
 */
export const updateDocument = async (documentId, documentData) => {
  try {
    const response = await documentValidationApi.put(`documents/${documentId}/`, {
      name: documentData.name,
      document_type: documentData.document_type,
      client_name: documentData.client_name,
      status: documentData.status,
      issues: documentData.issues || '',
    });
    return response.data;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (documentId) => {
  try {
    const response = await documentValidationApi.delete(`documents/${documentId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/**
 * Validate a document (mark as Valid)
 */
export const validateDocument = async (documentId) => {
  try {
    const response = await documentValidationApi.patch(`documents/${documentId}/`, {
      status: 'Valid',
      issues: '',
    });
    return response.data;
  } catch (error) {
    console.error('Error validating document:', error);
    throw error;
  }
};

/**
 * Reject a document (mark as Invalid)
 */
export const rejectDocument = async (documentId, issues = 'Rejected by legal team') => {
  try {
    const response = await documentValidationApi.patch(`documents/${documentId}/`, {
      status: 'Invalid',
      issues: issues,
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting document:', error);
    throw error;
  }
};

// ==========================
// UPLOAD ENDPOINTS
// ==========================

/**
 * Fetch all uploads
 */
export const fetchUploads = async () => {
  try {
    const response = await documentValidationApi.get('uploads/');
    return response.data;
  } catch (error) {
    console.error('Error fetching uploads:', error);
    throw error;
  }
};

/**
 * Upload a document file
 */
export const uploadDocument = async (formData) => {
  try {
    // Create a new instance without default JSON header for FormData
    const uploadApi = axios.create({
      baseURL: `${API_URL}/document-validation`,
    });
    
    const response = await uploadApi.post('uploads/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Delete an upload record
 */
export const deleteUpload = async (uploadId) => {
  try {
    const response = await documentValidationApi.delete(`uploads/${uploadId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting upload:', error);
    throw error;
  }
};

// ==========================
// HELPER FUNCTIONS
// ==========================

/**
 * Get document statistics
 */
export const getDocumentStats = async (documents) => {
  return {
    total: documents.length,
    pending: documents.filter((doc) => doc.status === 'Pending').length,
    valid: documents.filter((doc) => doc.status === 'Valid').length,
    invalid: documents.filter((doc) => doc.status === 'Invalid').length,
  };
};
