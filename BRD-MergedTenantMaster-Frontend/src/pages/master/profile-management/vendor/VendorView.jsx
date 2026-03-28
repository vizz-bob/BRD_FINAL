import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit3, FiArrowLeft } from "react-icons/fi";

export default function VendorView() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data — replace with real fetch by id
  const vendor = {
    vendorType: "Company",
    constitution: "Pvt Ltd",
    location: "Mumbai",
    category: "Legal",
    serviceType: "Documentation",
    status: "Active",
  };

  const rows = [
    { label: "Vendor Type", value: vendor.vendorType },
    { label: "Constitution", value: vendor.constitution },
    { label: "Location", value: vendor.location },
    { label: "Category", value: vendor.category },
    { label: "Service Type", value: vendor.serviceType },
    { label: "Status", value: vendor.status },
  ];

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/profile-management/vendor")}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-xl font-semibold">Vendor Detail</h1>
          <p className="text-sm text-gray-500">Viewing vendor #{id}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">Vendor Information</h2>
          <button
            onClick={() => navigate(`/profile-management/vendor/edit/${id}`)}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <FiEdit3 size={13} /> Edit
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {rows.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-2 px-5 py-3 text-sm">
              <span className="text-gray-500 font-medium">{label}</span>
              <span className="text-gray-900 font-medium">
                {label === "Status" ? (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    value === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${value === "Active" ? "bg-green-500" : "bg-red-400"}`} />
                    {value}
                  </span>
                ) : value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}