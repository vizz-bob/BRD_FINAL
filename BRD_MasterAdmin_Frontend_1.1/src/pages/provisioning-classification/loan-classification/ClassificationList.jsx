import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiRefreshCcw, FiSettings, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ClassificationList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setData([
      {
        id: 1,
        classification_name: "Standard Asset",
        classification_type: "Performing",
        status: "Active",
        criteria_description: "Loans with no overdue beyond 30 days"
      }
    ]);
  }, []);

  const filtered = data.filter((d) =>
    d.classification_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Loan Classification</h1>
          <p className="text-sm text-gray-500">
            Define provisioning and monitoring classification rules
          </p>
        </div>

        <button
          onClick={() => navigate("add")}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={16} /> Add Classification
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search classification..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="space-y-3">

        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Name</div>
          <div>Type</div>
          <div>Status</div>
          <div>Criteria</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.map((row) => (
          <div
            key={row.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-y-2 items-center text-sm"
          >
            <div className="font-medium text-gray-900">
              {row.classification_name}
            </div>

            <div className="hidden md:block text-gray-600">
              {row.classification_type}
            </div>

            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  row.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {row.status}
              </span>
            </div>

            <div className="hidden md:block text-gray-500 truncate">
              {row.criteria_description}
            </div>

            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <button
                onClick={() => navigate(`${row.id}/edit`)}
                className="icon-btn bg-blue-100 text-blue-600"
                title="Edit Classification"
              >
                <FiEdit size={16} />
              </button>

              <button
                onClick={() => navigate(`${row.id}/update`)}
                className="icon-btn bg-purple-100 text-purple-600"
                title="Update Policy"
              >
                <FiRefreshCcw size={16} />
              </button>

              <button
                onClick={() => navigate(`${row.id}/manage`)}
                className="icon-btn bg-gray-100 text-gray-700"
                title="Manage / Map Product"
              >
                <FiSettings size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
