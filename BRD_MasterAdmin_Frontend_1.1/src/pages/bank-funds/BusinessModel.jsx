import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { bankFundService } from "../../services/bankFundService";

const BusinessModelPage = () => {
  const navigate = useNavigate();

  const [models, setModels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch business models on mount
  useEffect(() => {
    fetchBusinessModels();
  }, []);

  const fetchBusinessModels = async () => {
    setLoading(true);
    try {
      const data = await bankFundService.getBusinessModels();
      setModels(data);
    } catch (err) {
      console.error("Error fetching business models:", err);
      alert("Failed to fetch business models");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this business model?")) return;
    setLoading(true);
    try {
      await bankFundService.deleteBusinessModel(id);
      setModels(models.filter((m) => m.id !== id));
      alert("Business model deleted successfully");
    } catch (err) {
      console.error("Failed to delete business model:", err);
      alert("Error deleting business model");
    } finally {
      setLoading(false);
    }
  };

  const filteredModels = models.filter(
    (m) =>
      m.model_type.toLowerCase().includes(search.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading)
    return (
      <MainLayout>
        <div className="text-center py-10">Loading...</div>
      </MainLayout>
    );

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Business Models</h1>
          <p className="text-sm text-gray-500">
            Configure financial engagement models
          </p>
        </div>

        <button
          onClick={() => navigate("/business-model/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Model
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search business model..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Model Name</div>
          <div className="col-span-2">Description</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-y-2 items-center text-sm"
          >
            {/* Name */}
            <div className="font-medium text-gray-900">
              {model.model_type}
            </div>

            {/* Description */}
            <div className="text-gray-600 md:col-span-2">
              {model.description}
            </div>

            {/* Status */}
            <span
              className={`px-3 py-1 text-xs rounded-full justify-self-start ${
                model.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {model.status}
            </span>

            {/* Actions */}
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <IconButton
                color="gray"
                onClick={() => navigate(`/business-model/view/${model.id}`)}
              >
                <FiEye />
              </IconButton>
              <IconButton
                color="blue"
                onClick={() => navigate(`/business-model/edit/${model.id}`)}
              >
                <FiEdit3 />
              </IconButton>
              <IconButton
                color="red"
                onClick={() => handleDelete(model.id)}
              >
                <FiTrash2 />
              </IconButton>
            </div>
          </div>
        ))}

        {filteredModels.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No business models found.
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BusinessModelPage;

/* ---------------- HELPERS ---------------- */
const IconButton = ({ children, onClick, color }) => {
  const colors = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red: "bg-red-100 hover:bg-red-200 text-red-600",
  };

  return (
    <button onClick={onClick} className={`p-2 rounded-full ${colors[color]}`}>
      {children}
    </button>
  );
};
