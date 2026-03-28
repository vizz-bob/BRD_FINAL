// pages/legal/DocumentDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDocumentById } from "../../api/documentValidationApi";
import { fetchDocumentById as fetchDocumentByIdDashboard, fetchDocuments as fetchAllDocuments } from "../../api/dashboardApi";

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDocumentDetails();
  }, [id]);

  const loadDocumentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data = null;
      let lastError = null;
      
      // Try Document Validation API first
      try {
        data = await fetchDocumentById(id);
        console.log('Successfully fetched from Document Validation API:', data);
      } catch (err) {
        lastError = err;
        console.log('Document not found in Document Validation API, trying Dashboard API...');
      }
      
      // If not found, try Dashboard API direct fetch
      if (!data) {
        try {
          data = await fetchDocumentByIdDashboard(id);
          console.log('Successfully fetched from Dashboard API (direct):', data);
        } catch (err) {
          lastError = err;
          console.log('Direct fetch failed, trying to fetch all documents and search...');
        }
      }
      
      // If still not found, try fetching all documents and searching
      if (!data) {
        try {
          const allDocsResponse = await fetchAllDocuments();
          const allDocs = allDocsResponse.results ? allDocsResponse.results : allDocsResponse;
          const found = allDocs.find(doc => doc.id === parseInt(id) || doc.document_id === parseInt(id) || doc.id === id || doc.document_id === id);
          if (found) {
            data = found;
            console.log('Successfully found document in all documents list:', data);
          }
        } catch (err) {
          console.log('Failed to fetch all documents:', err);
        }
      }
      
      if (!data) {
        throw lastError || new Error('Document not found in any API');
      }
      
      // Safe date parsing
      let uploadDate = 'N/A';
      try {
        const dateValue = data.upload_date || data.created_at || data.date || null;
        if (dateValue) {
          const dateObj = new Date(dateValue);
          if (!isNaN(dateObj.getTime())) {
            uploadDate = dateObj.toISOString().slice(0, 10);
          } else {
            console.warn('Invalid date value:', dateValue);
          }
        }
      } catch (e) {
        console.warn('Error parsing date field:', e);
      }
      
      // Transform API response to component format - handle both API response formats
      const transformedDoc = {
        id: data.document_id || data.id,
        name: data.name || data.document_name || 'Unknown',
        type: data.document_type || 'Unknown',
        client: data.client_name || 'Unknown',
        uploadDate: uploadDate,
        status: data.status || 'Unknown',
        issues: data.issues ? (typeof data.issues === 'string' ? data.issues.split(',').map(i => i.trim()).filter(i => i) : data.issues) : [],
      };
      
      console.log('Transformed document:', transformedDoc);
      setDoc(transformedDoc);
    } catch (err) {
      console.error('Error loading document:', err);
      setError('Failed to load document details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading document details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 mb-4">{error}</p>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={loadDocumentDetails}
            >
              Try again
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => navigate("/legal/documents")}
            >
              Back to Documents
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Document not found</h2>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/legal/documents")}
        >
          Back to Documents
        </button>
      </div>
    );
  }

  const statusColors = {
    Valid: "bg-green-100 text-green-800",
    Invalid: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{doc.name}</h1>
            <p className="text-gray-500 mt-1">Document ID: {doc.id}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              statusColors[doc.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {doc.status}
          </span>
        </div>

        {/* Document Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Document Type
            </label>
            <p className="text-gray-900">{doc.type}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Client Name
            </label>
            <p className="text-gray-900">{doc.client}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Upload Date
            </label>
            <p className="text-gray-900">{doc.uploadDate}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Status
            </label>
            <p className="text-gray-900">{doc.status}</p>
          </div>
        </div>

        {/* Issues Section (if any) */}
        {doc.issues && doc.issues.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Issues Found
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-2">
                {doc.issues.map((issue, idx) => (
                  <li key={idx} className="text-red-700">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Status-based Information */}
        {doc.status === "Valid" && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                ✓ This document has been validated and approved.
              </p>
            </div>
          </div>
        )}

        {doc.status === "Invalid" && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">
                ✗ This document has been rejected. Please review the issues
                above and resubmit.
              </p>
            </div>
          </div>
        )}

        {doc.status === "Pending" && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-semibold">
                ⏳ This document is pending review. Please wait for validation.
              </p>
            </div>
          </div>
        )}

        {/* Document Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Additional Information
          </h2>
          <p className="text-gray-600">
            Use this page to review all details about the document. For any
            questions or further review, contact the legal department.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => navigate("/legal/documents")}
          >
            Back to Documents
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={loadDocumentDetails}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
