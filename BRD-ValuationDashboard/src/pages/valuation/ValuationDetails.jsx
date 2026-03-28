import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiDownload,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

const ValuationDetails = () => {
  const { id } = useParams();

  const [valuation, setValuation] = useState({
    id,
    propertyType: "Residential Apartment",
    address: "A-123, Skyline Apartments, Andheri West, Mumbai, 400058",
    requestDate: "2025-11-03",
    completionDate: "2025-11-10",
    estimatedValue: "₹85,00,000",
    assessedValue: "₹83,50,000",
    status: "Completed",
    assignedTo: "Ravi Sharma",
    client: {
      name: "Sunita Patel",
      contact: "+91 98765 43210",
      email: "sunita.patel@example.com",
    },
    documents: [
      { name: "Property Deed", url: "#" },
      { name: "Floor Plan", url: "#" },
      { name: "Owner's ID", url: "#" },
    ],
    history: [
      { date: "2025-11-03", event: "Valuation request created" },
      { date: "2025-11-04", event: "Assigned to Ravi Sharma" },
      { date: "2025-11-06", event: "Site visit scheduled" },
      { date: "2025-11-09", event: "Valuation report submitted" },
      { date: "2025-11-10", event: "Valuation marked as Completed" },
    ],
  });

  const employees = [
    "Ravi Sharma",
    "Priya Singh",
    "Amit Patel",
    "Sunita Williams",
  ];

  const handleUpdateStatus = (newStatus) => {
    const newHistoryEvent = {
      date: new Date().toISOString().split("T")[0],
      event: `Status updated to ${newStatus}`,
    };
    setValuation((prev) => ({
      ...prev,
      status: newStatus,
      history: [newHistoryEvent, ...prev.history],
    }));
  };

  const handleAssign = (employee) => {
    const newHistoryEvent = {
      date: new Date().toISOString().split("T")[0],
      event: `Assigned to ${employee}`,
    };
    setValuation((prev) => ({
      ...prev,
      assignedTo: employee,
      history: [newHistoryEvent, ...prev.history],
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FiCheckCircle className="text-green-500" />;
      case "Pending":
        return <FiClock className="text-yellow-500" />;
      case "Rejected":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Valuation Details
          </h1>
          <p className="text-sm text-gray-500">Valuation ID: {valuation.id}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
          <select
            onChange={(e) => handleUpdateStatus(e.target.value)}
            value={valuation.status}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            onChange={(e) => handleAssign(e.target.value)}
            value={valuation.assignedTo}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full sm:w-auto"
          >
            {employees.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Property Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-medium">{valuation.propertyType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{valuation.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Request Date</p>
                <p className="font-medium">{valuation.requestDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completion Date</p>
                <p className="font-medium">{valuation.completionDate}</p>
              </div>
            </div>
          </div>

          {/* Valuation Assessment */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Valuation Assessment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Estimated Value</p>
                <p className="font-medium text-blue-600">
                  {valuation.estimatedValue}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assessed Value</p>
                <p className="font-medium text-green-600">
                  {valuation.assessedValue}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="font-medium flex items-center gap-2">
                  <FiUser /> {valuation.assignedTo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium flex items-center gap-2">
                  {getStatusIcon(valuation.status)} {valuation.status}
                </p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Client Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{valuation.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{valuation.client.contact}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{valuation.client.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Documents & History */}
        <div className="space-y-6">
          {/* Documents */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <ul className="space-y-3">
              {valuation.documents.map((doc, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-gray-700">{doc.name}</span>
                  <a
                    href={doc.url}
                    download={`${doc.name.replace(/\s+/g, "_")}.pdf`}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FiDownload /> Download
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* History */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Valuation History</h2>
            <ul className="space-y-4">
              {valuation.history.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-800">{item.event}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuationDetails;
