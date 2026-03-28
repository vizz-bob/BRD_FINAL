import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit3, FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function CoApplicantList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [coApplicants, setCoApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoApplicants = async () => {
    setLoading(true);
    const data = await controlsManagementService.co_applicants.list();
    setCoApplicants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoApplicants();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this co-applicant configuration?")) return;
    const success = await controlsManagementService.co_applicants.delete(id);
    if (success) {
      setCoApplicants((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const filtered = coApplicants.filter(
    (c) =>
      c.co_applicant_type?.toLowerCase().includes(search.toLowerCase()) ||
      c.relationship?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Co-Applicant Management</h1>
          <p className="text-sm text-gray-500">
            Configure co-applicant types and relationships
          </p>
        </div>
        <button
          onClick={() => navigate("/controls/co-applicant/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          <FiPlus /> Add Co-Applicant
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          placeholder="Search by type or relationship..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          <div className="hidden md:grid grid-cols-4 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
            <div>Co-Applicant Type</div>
            <div>Relationship</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-y-2 items-center text-sm"
            >
              <div className="font-medium">{c.co_applicant_type}</div>
              <div>{c.relationship}</div>

              <StatusBadge status={c.is_active ? "Active" : "Inactive"} />

              <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
                <IconButton variant="gray" onClick={() => navigate(`/controls/co-applicant/view/${c.id}`)}>
                  <FiEye />
                </IconButton>
                <IconButton variant="blue" onClick={() => navigate(`/controls/co-applicant/edit/${c.id}`)}>
                  <FiEdit3 />
                </IconButton>
                <IconButton variant="red" onClick={() => handleDelete(c.id)}>
                  <FiTrash2 />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}

/* =======================
   LOCAL UI HELPERS
======================= */

const IconButton = ({ children, onClick, variant = "gray" }) => {
  const styles = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red: "bg-red-100 hover:bg-red-200 text-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

const StatusBadge = ({ status }) => (
  <span
    className={`max-w-fit px-3 py-1 text-xs rounded-full ${
      status === "Active"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    }`}
  >
    {status}
  </span>
);
