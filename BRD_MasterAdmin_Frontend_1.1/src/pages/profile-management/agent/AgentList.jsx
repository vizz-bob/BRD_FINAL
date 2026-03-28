import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiEye, FiPlus, FiEdit3, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import profileManagementService from "../../../services/profileManagementService";

// Mappings for IDs to labels (hardcoded for now; ideally fetch from API)
const AGENT_TYPES = { 1: "DSA", 2: "Sourcing", 3: "Field", 4: "Collection" };
const AGENT_CATEGORIES = { 1: "Freelance", 2: "Company", 3: "Employee" };
const AGENT_LEVELS = { 1: "Tier 1", 2: "Tier 2", 3: "Tier 3" };
const AGENT_CONSTITUTIONS = { 1: "Individual", 2: "Firm", 3: "Company" };
const AGENT_SERVICES = { 1: "Lead Gen", 2: "Documentation", 3: "Verification" };
const AGENT_RESPONSIBILITIES = { 1: "Sourcing", 2: "Collection", 3: "Support" };

export default function AgentList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await profileManagementService.getAllAgents();
        setAgents(data);
      } catch (error) {
        console.error("❌ Failed to fetch agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  // Filter agents based on search (search by readable labels)
  const filteredAgents = agents.filter((a) => {
    const typeLabel = AGENT_TYPES[a.agent_type] || "";
    const serviceLabel = AGENT_SERVICES[a.agent_service_type] || "";
    return (
      typeLabel.toLowerCase().includes(search.toLowerCase()) ||
      serviceLabel.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Agent Profile Management</h1>
          <p className="text-sm text-gray-500">
            Manage agent types, levels and responsibilities
          </p>
        </div>

        <button
          onClick={() => navigate("/profile-management/agent/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-blue-700"
        >
          <FiPlus /> Add Agent
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-3 mb-4 flex items-center gap-2 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by type or service..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* Table */}
      <div className="space-y-2">
        <div className="hidden md:grid grid-cols-5 px-4 py-2 text-xs font-semibold text-gray-500">
          <div>Agent Type</div>
          <div>Category</div>
          <div>Level</div>
          <div>Service</div>
          <div className="text-right">Action</div>
        </div>

        {loading ? (
          <div className="text-center text-sm text-gray-500 py-6">
            Loading agents...
          </div>
        ) : filteredAgents.length > 0 ? (
          filteredAgents.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl px-4 py-3 shadow-sm grid grid-cols-1 md:grid-cols-5 items-center gap-2 text-sm"
            >
              <div className="font-medium">{AGENT_TYPES[a.agent_type]}</div>
              <div className="text-gray-600">{AGENT_CATEGORIES[a.agent_category]}</div>
              <div className="text-gray-600">{AGENT_LEVELS[a.agent_level]}</div>
              <div className="text-gray-600">{AGENT_SERVICES[a.agent_service_type]}</div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() =>
                    navigate(`/profile-management/agent/view/${a.id}`)
                  }
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <FiEye />
                </button>

                <button
                  onClick={() =>
                    navigate(`/profile-management/agent/edit/${a.id}`)
                  }
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                >
                  <FiEdit3 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 py-6">
            No agents found
          </div>
        )}
      </div>
    </MainLayout>
  );
}
