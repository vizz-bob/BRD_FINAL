import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAgreementById } from "../../api/agreementApi";

const AgreementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAgreementDetails();
  }, [id]);

  const loadAgreementDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAgreementById(id);
      
      // Transform API response to component format
      const transformedAgreement = {
        id: data.id,
        agreement_id: data.agreement_id,
        type: data.agreement_type,
        client: data.client_name,
        amount: `₹${data.amount}`,
        submittedDate: data.submitted_date,
        priority: data.priority,
        status: data.status,
        assignedTo: data.assigned_to,
      };
      
      setAgreement(transformedAgreement);
    } catch (err) {
      console.error('Error loading agreement:', err);
      setError('Failed to load agreement details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading agreement details...</p>
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
              onClick={loadAgreementDetails}
            >
              Try again
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => navigate("/legal/agreements")}
            >
              Back to Agreements
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Agreement Not Found
        </h2>
        <p className="mt-2 text-gray-600">No agreement found with ID: {id}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/legal/agreements")}
        >
          Back to Agreements
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{agreement.type}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Agreement ID: {agreement.agreement_id}
          </p>
        </div>
        <span
          className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${
            agreement.status === "Approved"
              ? "bg-green-100 text-green-800"
              : agreement.status === "Rejected"
              ? "bg-red-100 text-red-800"
              : agreement.status === "Under Review"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {agreement.status}
        </span>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Agreement Information
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Client Name
            </label>
            <p className="text-gray-900">{agreement.client}</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Amount
            </label>
            <p className="text-gray-900 font-semibold">{agreement.amount}</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Submitted Date
            </label>
            <p className="text-gray-900">{agreement.submittedDate}</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Priority
            </label>
            <span
              className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                agreement.priority === "High"
                  ? "bg-red-100 text-red-800"
                  : agreement.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {agreement.priority}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Assigned To
            </label>
            <p className="text-gray-900">{agreement.assignedTo}</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Agreement Type
            </label>
            <p className="text-gray-900">{agreement.type}</p>
          </div>
        </div>

        {/* Status-based Information */}
        {agreement.status === "Approved" && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold">
              ✓ This agreement has been approved and is ready for execution.
            </p>
          </div>
        )}

        {agreement.status === "Rejected" && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold">
              ✗ This agreement has been rejected. Please review the comments and resubmit if necessary.
            </p>
          </div>
        )}

        {agreement.status === "Pending" && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-semibold">
              ⏳ This agreement is pending review. It will be processed soon.
            </p>
          </div>
        )}
      </div>

      {/* Additional Guidelines / Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Legal Review Guidelines
        </h3>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>Verify all party details and signatures</li>
          <li>Check compliance with current regulations</li>
          <li>Validate terms and conditions</li>
          <li>Review collateral documentation</li>
          <li>Ensure proper witnessing and notarization</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => navigate("/legal/agreements")}
        >
          Back to Agreements
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={loadAgreementDetails}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default AgreementDetails;
