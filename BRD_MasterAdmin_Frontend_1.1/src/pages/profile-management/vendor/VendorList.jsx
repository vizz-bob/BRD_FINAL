import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiEye, FiPlus, FiSearch, FiEdit3 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function VendorList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const vendors = [
    { id: 1, type: "Company", category: "Legal", service: "Documentation" },
    { id: 2, type: "Individual", category: "Valuation", service: "Property Valuation" },
  ];

  const filteredVendors = vendors.filter(
    (v) =>
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      v.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Vendor Profile Management</h1>
          <p className="text-sm text-gray-500">
            Manage vendor categories and service types
          </p>
        </div>

        <button
          onClick={() => navigate("/profile-management/vendor/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-blue-700"
        >
          <FiPlus /> Add Vendor
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-3 mb-4 flex items-center gap-2 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by category or service..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        <div className="hidden md:grid grid-cols-4 px-4 py-2 text-xs font-semibold text-gray-500">
          <div>Category</div>
          <div>Vendor Type</div>
          <div>Service Type</div>
          <div className="text-right">Action</div>
        </div>

        {filteredVendors.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-xl px-4 py-3 shadow-sm grid grid-cols-1 md:grid-cols-4 items-center gap-2 text-sm"
          >
            <div className="font-medium">{v.category}</div>
            <div className="text-gray-600">{v.type}</div>
            <div className="text-gray-600">{v.service}</div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  navigate(`/profile-management/vendor/view/${v.id}`)
                }
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() =>
                  navigate(`/profile-management/vendor/edit/${v.id}`)
                }
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                <FiEdit3 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
