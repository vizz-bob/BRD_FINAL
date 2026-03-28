import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const VerificationAgencyList = () => {
  const navigate = useNavigate();

  const [agencies, setAgencies] = useState([
    {
      id: 1,
      name: "ABC Verifications",
      type: "Verification Agent",
      region: "North",
      status: "Active",
    },
    {
      id: 2,
      name: "Prime Valuers Pvt Ltd",
      type: "Valuation Agent",
      region: "West",
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredAgencies = agencies.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!window.confirm("Delete this agency?")) return;
    setAgencies(agencies.filter((a) => a.id !== id));
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            Verification Agency Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage verification, valuation, legal & fraud agencies
          </p>
        </div>

        <button
          onClick={() => navigate("/verification-agency/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Agency
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by agency name or agent type..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* HEADER ROW */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Agency Name</div>
          <div>Agent Type</div>
          <div>Region</div>
          <div>Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredAgencies.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-6 gap-y-2 items-center text-sm"
          >
            <div className="font-medium text-gray-900">{a.name}</div>
            <div className="text-gray-600">{a.type}</div>
            <div className="text-gray-600">{a.region}</div>

            <span
              className={`px-3 py-1 text-xs rounded-full justify-self-start ${
                a.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {a.status}
            </span>

            <div className="flex justify-end gap-2 col-span-2 md:col-span-2">
              <IconButton
                color="gray"
                onClick={() =>
                  navigate(`/verification-agency/view/${a.id}`)
                }
              >
                <FiEye />
              </IconButton>

              <IconButton
                color="blue"
                onClick={() =>
                  navigate(`/verification-agency/edit/${a.id}`)
                }
              >
                <FiEdit3 />
              </IconButton>

              <IconButton
                color="red"
                onClick={() => handleDelete(a.id)}
              >
                <FiTrash2 />
              </IconButton>
            </div>
          </div>
        ))}

        {filteredAgencies.length === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
            No agencies found
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default VerificationAgencyList;

/* ---------------- HELPERS ---------------- */
const IconButton = ({ children, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full bg-${color}-100 hover:bg-${color}-200 transition`}
  >
    <span className={`text-${color}-600`}>{children}</span>
  </button>
);
