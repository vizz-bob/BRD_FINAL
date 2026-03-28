import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiEye, FiPlus, FiEdit3, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ClientList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const clients = [
    { id: 1, category: "Individual", type: "Salaried", role: "Applicant" },
    { id: 2, category: "Business", type: "MSME", role: "Co-Applicant" },
  ];

  const filteredClients = clients.filter(
    (c) =>
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Client Profile Management</h1>
          <p className="text-sm text-gray-500">
            Manage client classification and employment details
          </p>
        </div>

        <button
          onClick={() => navigate("/profile-management/client/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-blue-700"
        >
          <FiPlus /> Add Client
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-3 mb-4 flex items-center gap-2 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by category or type..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* Table */}
      <div className="space-y-2">
        <div className="hidden md:grid grid-cols-4 px-4 py-2 text-xs font-semibold text-gray-500">
          <div>Category</div>
          <div>Type</div>
          <div>Role</div>
          <div className="text-right">Action</div>
        </div>

        {filteredClients.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl px-4 py-3 shadow-sm grid grid-cols-1 md:grid-cols-4 items-center gap-2 text-sm"
          >
            <div className="font-medium">{c.category}</div>
            <div className="text-gray-600">{c.type}</div>
            <div className="text-gray-600">{c.role}</div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  navigate(`/profile-management/client/view/${c.id}`)
                }
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() =>
                  navigate(`/profile-management/client/edit/${c.id}`)
                }
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                <FiEdit3 />
              </button>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-6">
            No clients found
          </div>
        )}
      </div>
    </MainLayout>
  );
}
