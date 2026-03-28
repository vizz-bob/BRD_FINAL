import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiUpload, FiEdit3, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const PredefinedTemplates = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Mock template list
  const [templates, setTemplates] = useState([
    { id: 1, name: "Retail Loan Template", type: "Loan", version: "v1.0", uploaded_by: "Admin", status: "Active" },
    { id: 2, name: "Corporate Loan Template", type: "Loan", version: "v2.0", uploaded_by: "Admin", status: "Inactive" },
  ]);

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!window.confirm("Delete this template?")) return;
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleUpload = () => {
    console.log("Upload template logic here");
    // you can open a modal or file input
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold">Predefined Templates</h1>
          <p className="text-sm text-gray-500">Upload new templates or manage existing ones</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleUpload}
            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-green-700 transition"
          >
            <FiUpload /> Upload Templates
          </button>

        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by template name or type..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Template Name</div>
          <div>Type</div>
          <div>Version</div>
          <div>Uploaded By</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredTemplates.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-6 gap-y-2 items-center text-sm"
          >
            <div className="font-medium text-gray-900">{t.name}</div>
            <div className="text-gray-600">{t.type}</div>
            <div className="text-gray-600">{t.version}</div>
            <div className="text-gray-600">{t.uploaded_by}</div>
            <StatusBadge status={t.status} />
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <IconButton color="gray" onClick={() => navigate(`/predefine-template/view/${t.id}`)}>
                <FiEye />
              </IconButton>
              <IconButton color="blue" onClick={() => navigate(`/predefine-template/edit/${t.id}`)}>
                <FiEdit3 />
              </IconButton>
              <IconButton color="red" onClick={() => handleDelete(t.id)}>
                <FiTrash2 />
              </IconButton>
            </div>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-6">No templates found.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default PredefinedTemplates;

/* ---------------- HELPERS ---------------- */
const StatusBadge = ({ status }) => (
  <div className="flex justify-start md:justify-center">
    <span
      className={`px-3 py-1 text-xs rounded-full ${
        status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      {status}
    </span>
  </div>
);

const IconButton = ({ children, onClick, color }) => (
  <button onClick={onClick} className={`p-2 rounded-full bg-${color}-100 hover:bg-${color}-200`}>
    <span className={`text-${color}-600`}>{children}</span>
  </button>
);
