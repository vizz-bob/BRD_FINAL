import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadDocumentModal from "../../components/UploadDocumentModal";
import {
  StatCard,
  DocumentVerificationMetrics,
} from "../../components/DashboardComponents";
import {
  DocumentDuplicateIcon,
  ClockIcon,
  EyeIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  fetchDocuments,
  validateDocument,
  rejectDocument,
  createDocument,
  uploadDocument,
} from "../../api/documentValidationApi";

const DocumentValidation = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch documents on component mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDocuments();
      
      // Handle both array and paginated responses
      const docsArray = Array.isArray(data) ? data : (data.results || []);
      
      // Transform API response to component format
      const transformedDocs = docsArray.map((doc) => ({
        id: doc.document_id,
        name: doc.name,
        type: doc.document_type,
        client: doc.client_name,
        uploadDate: new Date(doc.upload_date).toISOString().slice(0, 10),
        status: doc.status,
        issues: doc.issues ? doc.issues.split(',').map(i => i.trim()).filter(i => i) : [],
      }));
      
      setDocuments(transformedDocs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Failed to load documents. Please try again.');
      // Fallback to empty array
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = documents.filter((doc) => {
    if (filter !== "all" && doc.status.toLowerCase() !== filter.toLowerCase()) return false;
    if (
      searchQuery &&
      !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.client.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleValidate = async (id) => {
    try {
      // Update UI optimistically
      setDocuments(
        documents.map((doc) =>
          doc.id === id ? { ...doc, status: "Valid", issues: [] } : doc
        )
      );
      
      // Call API
      await validateDocument(id);
      
      // Refresh from backend silently in background
      const data = await fetchDocuments();
      const docsArray = Array.isArray(data) ? data : (data.results || []);
      const transformedDocs = docsArray.map((doc) => ({
        id: doc.document_id,
        name: doc.name,
        type: doc.document_type,
        client: doc.client_name,
        uploadDate: new Date(doc.upload_date).toISOString().slice(0, 10),
        status: doc.status,
        issues: doc.issues ? doc.issues.split(',').map(i => i.trim()).filter(i => i) : [],
      }));
      setDocuments(transformedDocs);
      
      alert(`Document ${id} validated successfully.`);
    } catch (err) {
      console.error('Error validating document:', err);
      alert('Failed to validate document. Please try again.');
      // Reload on error
      loadDocuments();
    }
  };

  const handleReject = async (id) => {
    try {
      const issueReason = prompt('Enter reason for rejection:', 'Rejected by legal team');
      if (!issueReason) return; // User cancelled

      // Update UI optimistically
      setDocuments(
        documents.map((doc) =>
          doc.id === id
            ? { 
                ...doc, 
                status: "Invalid", 
                issues: issueReason ? [issueReason] : ["Rejected by legal team"]
              }
            : doc
        )
      );

      // Call API
      await rejectDocument(id, issueReason);
      
      // Refresh from backend silently in background
      const data = await fetchDocuments();
      const docsArray = Array.isArray(data) ? data : (data.results || []);
      const transformedDocs = docsArray.map((doc) => ({
        id: doc.document_id,
        name: doc.name,
        type: doc.document_type,
        client: doc.client_name,
        uploadDate: new Date(doc.upload_date).toISOString().slice(0, 10),
        status: doc.status,
        issues: doc.issues ? doc.issues.split(',').map(i => i.trim()).filter(i => i) : [],
      }));
      setDocuments(transformedDocs);
      
      alert(`Document ${id} rejected.`);
    } catch (err) {
      console.error('Error rejecting document:', err);
      alert('Failed to reject document. Please try again.');
      // Reload on error
      loadDocuments();
    }
  };

  const handleUploadDocument = () => setIsUploadModalOpen(true);
  const handleCloseUploadModal = () => setIsUploadModalOpen(false);

  const handleDocumentUpload = async (file, type, client) => {
    try {
      // First, create the document record in the database
      const newDocRecord = await createDocument({
        name: file.name,
        document_type: type,
        client_name: client,
        status: "Pending",
      });

      // Then upload the actual file
      const formData = new FormData();
      formData.append('document_file', file);
      formData.append('document_type', type);
      formData.append('client_name', client);

      const uploadResponse = await uploadDocument(formData);

      // Add new document to the list
      const newDoc = {
        id: newDocRecord.document_id,
        name: newDocRecord.name,
        type: newDocRecord.document_type,
        client: newDocRecord.client_name,
        uploadDate: new Date(newDocRecord.upload_date).toISOString().slice(0, 10),
        status: newDocRecord.status,
        issues: [],
      };
      
      setDocuments((prevDocs) => [newDoc, ...prevDocs]);
      alert(`Document ${file.name} uploaded successfully!`);
      handleCloseUploadModal();
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document. Please try again.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadDocuments}
            className="mt-2 text-red-600 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Document Validation
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and validate submitted documents
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          onClick={handleUploadDocument}
          disabled={loading}
        >
          Upload Document
        </button>
      </div>

      {/* Summary Cards */}
      <DocumentVerificationMetrics
        items={[
          {
            title: "Total Documents",
            mainValue: documents.length,
            subText: `Total in system`,
            trendValue: documents.length,
            trendType: "up",
            icon: DocumentDuplicateIcon,
          },
          {
            title: "Pending Review",
            mainValue: documents.filter((doc) => doc.status === "Pending")
              .length,
            subText: "Awaiting validation",
            trendValue: documents.filter((doc) => doc.status === "Pending").length,
            trendType: "up",
            icon: EyeIcon,
          },
          {
            title: "Validated",
            mainValue: documents.filter((doc) => doc.status === "Valid").length,
            subText: documents.length > 0 
              ? `${Math.round((documents.filter((doc) => doc.status === "Valid").length / documents.length) * 100)}% success rate`
              : "No documents",
            trendValue: documents.filter((doc) => doc.status === "Valid").length,
            trendType: "up",
            icon: CheckBadgeIcon,
          },
          {
            title: "Issues Found",
            mainValue: documents.filter((doc) => doc.status === "Invalid")
              .length,
            subText: documents.length > 0
              ? `${Math.round((documents.filter((doc) => doc.status === "Invalid").length / documents.length) * 100)}% of total`
              : "No issues",
            trendValue: documents.filter((doc) => doc.status === "Invalid").length,
            trendType: documents.filter((doc) => doc.status === "Invalid").length > 0 ? "down" : "up",
            icon: ExclamationTriangleIcon,
          },
        ]}
      />

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm text-gray-600">Status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg w-full sm:w-auto"
              disabled={loading}
            >
              <option value="all">All Documents</option>
              <option value="pending">Pending</option>
              <option value="valid">Valid</option>
              <option value="invalid">Invalid</option>
            </select>
          </div>
          <input
            type="search"
            placeholder="Search by document name, ID or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            disabled={loading}
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading documents...</p>
          </div>
        ) : (
          <>
            {/* Table for large screens */}
            <div className="overflow-x-auto sm:block hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Document ID",
                  "Name",
                  "Type",
                  "Client",
                  "Upload Date",
                  "Status",
                  "Issues",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{doc.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {doc.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doc.client}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doc.uploadDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        doc.status === "Valid"
                          ? "bg-green-100 text-green-800"
                          : doc.status === "Invalid"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doc.issues.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {doc.issues.map((issue, idx) => (
                          <li key={idx} className="text-red-600">
                            {issue}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-green-600">No issues</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {doc.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleValidate(doc.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Validate
                        </button>
                        <button
                          onClick={() => handleReject(doc.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(`/legal/documents/${doc.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No documents match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card view for mobile */}
        <div className="sm:hidden space-y-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">{doc.name}</span>
                <span
                  className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                    doc.status === "Valid"
                      ? "bg-green-100 text-green-800"
                      : doc.status === "Invalid"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                <strong>ID:</strong> {doc.id}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Type:</strong> {doc.type}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Client:</strong> {doc.client}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Upload Date:</strong> {doc.uploadDate}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Issues:</strong>{" "}
                {doc.issues.length > 0 ? doc.issues.join(", ") : "No issues"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                {doc.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => handleValidate(doc.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Validate
                    </button>
                    <button
                      onClick={() => handleReject(doc.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/legal/documents/${doc.id}`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
          </>
        )}
      </div>

      {/* Document Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Document Guidelines
        </h3>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>All documents must be in PDF format</li>
          <li>File size should not exceed 10MB</li>
          <li>Ensure all pages are clearly scanned</li>
          <li>Documents must contain required signatures and stamps</li>
          <li>Personal information should be clearly visible</li>
        </ul>
      </div>

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
};

export default DocumentValidation;
