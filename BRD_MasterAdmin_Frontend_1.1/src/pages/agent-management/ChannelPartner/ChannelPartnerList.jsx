import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { agentManagementService } from "../../../services/agentManagementService";

export default function ChannelPartnerList() {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchChannelPartners = async () => {
    try {
      setLoading(true);
      const res = await agentManagementService.getChannelPartners();
      setAgents(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to fetch channel partners", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelPartners();
  }, []);

  /* ================= FILTER ================= */
  const filtered = agents.filter(
    (a) =>
      a.agent_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.agent_type_name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this channel partner?")) return;

    try {
      await agentManagementService.deleteChannelPartner(id);
      setAgents((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete agent", err);
      alert("Failed to delete agent. Try again.");
    }
  };

  /* ================= STATUS TOGGLE ================= */
  const handleToggleStatus = async (id) => {
    try {
      await agentManagementService.toggleStatus(id);
      fetchChannelPartners(); // refresh list
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Channel Partners</h1>
          <p className="text-sm text-gray-500">
            Manage referral agents and payout configurations
          </p>
        </div>

        <button
          onClick={() => navigate("/channel-partners/add")}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm"
        >
          <FiPlus /> Add Agent
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by agent name or type..."
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

        {/* ===== DESKTOP HEADER ===== */}
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600 sticky top-0 z-10">
          <div>Agent Name</div>
          <div>Type</div>
          <div>Category</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading channel partners...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No channel partners found
          </div>
        ) : (
          filtered.map((a) => (
            <React.Fragment key={a.id}>

              {/* ================= DESKTOP ROW ================= */}
              <div className="hidden md:grid bg-white rounded-2xl px-5 py-4 shadow-sm grid-cols-5 items-center text-sm">
                <div className="font-medium truncate">{a.agent_name}</div>
                <div className="text-gray-600">{a.agent_type_name || "-"}</div>
                <div className="text-gray-600">{a.agent_category_name || "-"}</div>

                <span
                  className={`w-fit px-3 py-1 text-xs rounded-full cursor-pointer ${
                    a.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                  onClick={() => handleToggleStatus(a.id)}
                  title="Toggle Status"
                >
                  {a.status}
                </span>

                <div className="flex justify-end gap-2">
                  <IconButton
                    color="gray"
                    onClick={() =>
                      navigate(`/channel-partners/view/${a.id}`)
                    }
                  >
                    <FiEye />
                  </IconButton>
                  <IconButton
                    color="blue"
                    onClick={() =>
                      navigate(`/channel-partners/edit/${a.id}`)
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

              {/* ================= MOBILE CARD ================= */}
              <div className="md:hidden bg-white rounded-2xl shadow-sm divide-y">
                {/* TOP */}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-semibold text-sm">
                    {a.agent_name}
                  </span>

                  <div className="flex gap-3 text-gray-600">
                    <FiEye
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/channel-partners/view/${a.id}`)
                      }
                    />
                    <FiEdit3
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/channel-partners/edit/${a.id}`)
                      }
                    />
                    <FiTrash2
                      className="cursor-pointer"
                      onClick={() => handleDelete(a.id)}
                    />
                  </div>
                </div>

                {/* BODY */}
                <div className="px-4 py-3 space-y-3 text-sm">
                  <Row label="Type" value={a.agent_type_name} />
                  <Row label="Category" value={a.agent_category_name} />

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Status</span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                        a.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                      onClick={() => handleToggleStatus(a.id)}
                      title="Toggle Status"
                    >
                      {a.status}
                    </span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))
        )}
      </div>
    </MainLayout>
  );
}

/* ================= HELPERS ================= */
const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-400 text-xs">{label}</span>
    <span className="font-medium text-gray-800 text-right">
      {value || "-"}
    </span>
  </div>
);

const IconButton = ({ children, onClick, color = "blue" }) => {
  const styles = {
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red: "bg-red-100 hover:bg-red-200 text-red-600",
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    green: "bg-green-100 hover:bg-green-200 text-green-600",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition ${styles[color]}`}
    >
      {children}
    </button>
  );
};
