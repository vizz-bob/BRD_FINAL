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

const CollectionAgentList = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "ABC Collections",
      type: "Collection",
      category: "Soft",
      status: "Active",
      zone: "North",
    },
    {
      id: 2,
      name: "Legal Shield LLP",
      type: "Legal",
      category: "Hard",
      status: "Inactive",
      zone: "West",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!window.confirm("Delete this agent?")) return;
    setAgents(agents.filter((a) => a.id !== id));
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Collection Agents</h1>
          <p className="text-sm text-gray-500">
            Manage collection and legal recovery agents
          </p>
        </div>

        <button
          onClick={() => navigate("/collection-agent/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Agent
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by agent name or type..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* HEADER ROW */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Agent Name</div>
          <div>Type</div>
          <div>Category</div>
          <div>Zone</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredAgents.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-6 gap-y-2 items-center text-sm"
          >
            <div className="font-medium text-gray-900">{a.name}</div>
            <div className="text-gray-600">{a.type}</div>
            <div className="text-gray-600">{a.category}</div>
            <div className="text-gray-600">{a.zone}</div>
            <span
              className={`px-3 py-1 text-xs rounded-full justify-self-start ${
                a.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {a.status}
            </span>

            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <IconButton
                color="gray"
                onClick={() =>
                  navigate(`/collection-agent/view/${a.id}`)
                }
              >
                <FiEye />
              </IconButton>

              <IconButton
                color="blue"
                onClick={() =>
                  navigate(`/collection-agent/edit/${a.id}`)
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

        {filteredAgents.length === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
            No agents found
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CollectionAgentList;

/* ---------------- HELPERS ---------------- */
const IconButton = ({ children, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full bg-${color}-100 hover:bg-${color}-200 transition`}
  >
    <span className={`text-${color}-600`}>{children}</span>
  </button>
);
