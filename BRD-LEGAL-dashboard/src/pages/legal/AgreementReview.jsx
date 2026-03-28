import React from "react";
import { useParams } from "react-router-dom";

// Demo data (same structure as in AgreementApprovals)
const agreementsDemo = [
  {
    id: "AGR-2101",
    type: "Loan Agreement",
    client: "Vikram Singh",
    amount: "₹450,000",
    submittedDate: "2025-11-03",
    priority: "High",
    status: "Pending",
    assignedTo: "Priya Mehta",
  },
  {
    id: "AGR-2102",
    type: "Collateral Agreement",
    client: "Sneha Kumar",
    amount: "₹750,000",
    submittedDate: "2025-11-03",
    priority: "Medium",
    status: "Under Review",
    assignedTo: "Rahul Sharma",
  },
  {
    id: "AGR-2103",
    type: "Property Mortgage",
    client: "Arun Patel",
    amount: "₹1,200,000",
    submittedDate: "2025-11-02",
    priority: "High",
    status: "Approved",
    assignedTo: "Priya Mehta",
  },
  {
    id: "AGR-2104",
    type: "Guarantor Agreement",
    client: "Maya Reddy",
    amount: "₹350,000",
    submittedDate: "2025-11-02",
    priority: "Low",
    status: "Pending",
    assignedTo: "Rahul Sharma",
  },
];

const AgreementDetails = () => {
  const { id } = useParams();
  const agreement = agreementsDemo.find((a) => a.id === id);

  if (!agreement) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Agreement not found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Agreement Details</h1>
      <p className="text-gray-500 text-sm">
        Detailed view of the selected agreement
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Agreement Info
          </h2>
          <p className="text-sm text-gray-600">
            <strong>ID:</strong> {agreement.id}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Type:</strong> {agreement.type}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Submitted Date:</strong> {agreement.submittedDate}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Client & Assignment
          </h2>
          <p className="text-sm text-gray-600">
            <strong>Client Name:</strong> {agreement.client}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Assigned To:</strong> {agreement.assignedTo}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Status & Priority
          </h2>
          <p className="text-sm text-gray-600">
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
          </p>
          <p className="text-sm text-gray-600">
            <strong>Priority:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                agreement.priority === "High"
                  ? "bg-red-100 text-red-800"
                  : agreement.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {agreement.priority}
            </span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Financial Details
          </h2>
          <p className="text-sm text-gray-600">
            <strong>Amount:</strong> {agreement.amount}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          Notes / Guidelines
        </h2>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>Verify all party details and signatures</li>
          <li>Check compliance with current regulations</li>
          <li>Validate terms and conditions</li>
          <li>Review collateral documentation</li>
          <li>Ensure proper witnessing and notarization</li>
        </ul>
      </div>
    </div>
  );
};

export default AgreementDetails;
