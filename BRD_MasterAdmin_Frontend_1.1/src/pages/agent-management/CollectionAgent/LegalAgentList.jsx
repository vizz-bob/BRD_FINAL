import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiEye,
} from "react-icons/fi";

export default function LegalAgentList() {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "Legal Shield LLP",
      expertise: "Loan Recovery",
      jurisdiction: "North Zone",
      status: "Active",
    },
    {
      id: 2,
      name: "Justice Partners",
      expertise: "SARFAESI & Litigation",
      jurisdiction: "West Zone",
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.expertise.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!window.confirm("Delete this legal agent?")) return;
    setAgents(agents.filter((a) => a.id !== id));
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Legal Agents</h1>
          <p className="text-sm text-gray-500">
            Manage legal agents involved in loan recovery and litigation
          </p>
        </div>

        <button
          onClick={() => navigate("/legal-agents/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Legal Agent
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by agent name or expertise..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* HEADER ROW */}
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Agent Name</div>
          <div>Legal Expertise</div>
          <div>Jurisdiction</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredAgents.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-y-2 items-center text-sm"
          >
            {/* Name */}
            <div className="font-medium text-gray-900">{a.name}</div>

            {/* Expertise */}
            <div className="text-gray-600">{a.expertise}</div>

            {/* Jurisdiction */}
            <div className="text-gray-600">{a.jurisdiction}</div>

            {/* Status */}
            <span
              className={`px-3 py-1 text-xs rounded-full justify-self-start ${
                a.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {a.status}
            </span>

            {/* Actions */}
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <IconButton
                color="gray"
                onClick={() =>
                  navigate(`/legal-agents/view/${a.id}`)
                }
              >
                <FiEye />
              </IconButton>

              <IconButton
                color="blue"
                onClick={() =>
                  navigate(`/legal-agents/edit/${a.id}`)
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
            No legal agents found
          </div>
        )}
      </div>
    </MainLayout>
  );
}

/* ---------------- HELPERS ---------------- */

const IconButton = ({ children, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full bg-${color}-100 hover:bg-${color}-200 transition`}
  >
    <span className={`text-${color}-600`}>{children}</span>
  </button>
);
