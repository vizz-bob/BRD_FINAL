import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CustomizeTemplateList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [templates, setTemplates] = useState([
    {
      id: 1,
      template_name: "Retail Loan Template",
      template_type: "Loan",
      purpose: "Customer Eligibility",
      requirement: "Mandatory Documents",
      status: "Active",
    },
    {
      id: 2,
      template_name: "Corporate Credit Template",
      template_type: "Credit",
      purpose: "Risk Assessment",
      requirement: "Financial Statements",
      status: "Inactive",
    },
  ]);

  const filteredTemplates = templates.filter(
    (t) =>
      t.template_name.toLowerCase().includes(search.toLowerCase()) ||
      t.template_type.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!window.confirm("Delete this customized template?")) return;
    setTemplates(templates.filter((t) => t.id !== id));
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Customize Template</h1>
          <p className="text-sm text-gray-500">
            Configure template structure, purpose and field masters
          </p>
        </div>


      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search template name or type..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Template Name</div>
          <div>Type</div>
          <div>Purpose</div>
          <div>Requirement</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredTemplates.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-6 gap-y-2 items-center text-sm"
          >
            <div className="font-medium">{t.template_name}</div>
            <div>{t.template_type}</div>
            <div>{t.purpose}</div>
            <div>{t.requirement}</div>
            <StatusBadge status={t.status} />

            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <IconButton color="gray" onClick={() => navigate(`/customize-template/view/${t.id}`)}>
                <FiEye />
              </IconButton>
              <IconButton color="blue" onClick={() => navigate(`/customize-template/edit/${t.id}`)}>
                <FiEdit3 />
              </IconButton>
              <IconButton color="red" onClick={() => handleDelete(t.id)}>
                <FiTrash2 />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default CustomizeTemplateList;

/* ---------- HELPERS ---------- */
const StatusBadge = ({ status }) => (
  <div className="flex">
    <span
      className={`px-3 py-1 text-xs rounded-full ${
        status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      }`}
    >
      {status}
    </span>
  </div>
);

const IconButton = ({ children, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full bg-${color}-100 hover:bg-${color}-200`}
  >
    <span className={`text-${color}-600`}>{children}</span>
  </button>
);
