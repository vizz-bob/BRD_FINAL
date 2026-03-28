// DocumentChecklist.jsx
import React, { useState } from 'react';
import {
  FileText, Upload, CheckCircle2, XCircle,
  Eye, Download, Trash2, AlertCircle
} from 'lucide-react';
import { REQUIRED_DOCUMENTS } from '../../../utils/constants';
import leadService from '../../../services/leadService';

const DocumentChecklist = ({ lead, onChange }) => {
  const [uploadingDoc, setUploadingDoc] = useState(null);

  const isDocumentCollected = (docId) => {
    return lead.documentsCollected?.includes(docId);
  };

  const handleDocumentToggle = (docId) => {
    const current = lead.documentsCollected || [];
    const updated = current.includes(docId)
      ? current.filter(id => id !== docId)
      : [...current, docId];
    onChange(updated);
  };

  const handleFileUpload = async (docId, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadingDoc(docId);
      try {
        const formData = new FormData();
        // Map frontend docId to backend field name
        const fieldMapping = {
          'pan': 'pan_card',
          'aadhar': 'aadhar_card',
          'salary-slip': 'salary_slips',
          'bank-statement': 'bank_statement',
          'employment-proof': 'employment_proof',
          'address-proof': 'address_proof'
        };

        formData.append(fieldMapping[docId] || docId, file);

        await leadService.uploadDocument(lead.pk || lead.id, formData);

        // Refresh the lead data to show collected document
        const current = lead.documentsCollected || [];
        if (!current.includes(docId)) {
          onChange([...current, docId]);
        }
      } catch (error) {
        console.error("Error uploading document:", error);
        alert("Failed to upload document. Please try again.");
      } finally {
        setUploadingDoc(null);
      }
    }
  };

  const requiredDocs = REQUIRED_DOCUMENTS.filter(doc => doc.required);
  const optionalDocs = REQUIRED_DOCUMENTS.filter(doc => !doc.required);
  const completedCount = lead.documentsCollected?.length || 0;
  const requiredCount = requiredDocs.length;
  const completionPercent = Math.round((completedCount / REQUIRED_DOCUMENTS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Document Collection</h4>
          <span className="text-2xl font-bold text-green-600">
            {completedCount}/{REQUIRED_DOCUMENTS.length}
          </span>
        </div>

        <div className="w-full bg-white rounded-full h-3 mb-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <p className="text-sm text-gray-600">
          {completedCount >= requiredCount
            ? '✓ All required documents collected'
            : `${requiredCount - completedCount} required documents pending`}
        </p>
      </div>

      {/* Required Documents */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h4 className="font-semibold text-gray-900">Required Documents</h4>
        </div>

        <div className="space-y-3">
          {requiredDocs.map(doc => {
            const isCollected = isDocumentCollected(doc.id);
            const isUploading = uploadingDoc === doc.id;

            return (
              <div
                key={doc.id}
                className={`bg-white border-2 rounded-xl p-4 transition ${isCollected
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${isCollected ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                      <FileText className={`w-5 h-5 ${isCollected ? 'text-green-600' : 'text-gray-400'
                        }`} />
                    </div>

                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{doc.label}</h5>
                      <p className="text-xs text-red-600 mt-1">* Required</p>

                      {isCollected && (
                        <div className="mt-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-700 font-medium">
                            Collected
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCollected ? (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(doc.id, e)}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <div className={`p-2 rounded-full transition ${isUploading
                          ? 'bg-indigo-100'
                          : 'bg-indigo-100 hover:bg-indigo-200'
                          }`}>
                          <Upload className={`w-4 h-4 ${isUploading ? 'text-indigo-600 animate-pulse' : 'text-indigo-600'
                            }`} />
                        </div>
                      </label>
                    ) : (
                      <>
                        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDocumentToggle(doc.id)}
                          className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Documents */}
      {optionalDocs.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Optional Documents</h4>

          <div className="space-y-3">
            {optionalDocs.map(doc => {
              const isCollected = isDocumentCollected(doc.id);
              const isUploading = uploadingDoc === doc.id;

              return (
                <div
                  key={doc.id}
                  className={`bg-white border-2 rounded-xl p-4 transition ${isCollected
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${isCollected ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                        <FileText className={`w-5 h-5 ${isCollected ? 'text-green-600' : 'text-gray-400'
                          }`} />
                      </div>

                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{doc.label}</h5>
                        <p className="text-xs text-gray-500 mt-1">Optional</p>

                        {isCollected && (
                          <div className="mt-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-700 font-medium">
                              Collected
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isCollected ? (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(doc.id, e)}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <div className={`p-2 rounded-full transition ${isUploading
                            ? 'bg-indigo-100'
                            : 'bg-indigo-100 hover:bg-indigo-200'
                            }`}>
                            <Upload className={`w-4 h-4 ${isUploading ? 'text-indigo-600 animate-pulse' : 'text-indigo-600'
                              }`} />
                          </div>
                        </label>
                      ) : (
                        <>
                          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDocumentToggle(doc.id)}
                            className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <h5 className="font-medium text-indigo-900 mb-2">Upload Guidelines</h5>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>• Accepted formats: PDF, JPG, PNG</li>
          <li>• Maximum file size: 5MB per document</li>
          <li>• Ensure documents are clear and readable</li>
          <li>• All required documents must be collected before proceeding</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentChecklist;