import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit3, FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function JointApplicantList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  // Fetch joint applicants
  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await controlsManagementService.joint_applicants.list();
      setList(data || []);
    } catch (err) {
      console.error("Error fetching joint applicants:", err);
      setError("Failed to load joint applicants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filter list safely
  const filtered = list.filter((i) => {
    const type = i.joint_applicant_type || "";
    const workflow = i.approval_workflow || "";
    return (
      type.toLowerCase().includes(search.toLowerCase()) ||
      workflow.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Delete joint applicant
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this joint applicant rule?")) return;
    try {
      const success = await controlsManagementService.joint_applicants.delete(id);
      if (success) setList((prev) => prev.filter((i) => i.id !== id));
      else alert("Failed to delete. Try again.");
    } catch {
      alert("Failed to delete. Try again.");
    }
  };

  if (loading) return <MainLayout>Loading...</MainLayout>;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Joint Applicant Management</h1>
          <p className="text-sm text-gray-500">
            Configure joint applicant rules & workflows
          </p>
        </div>
        <button
          onClick={() => navigate("/controls/joint-applicant/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          <FiPlus /> Add Joint Applicant
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          placeholder="Search by type or workflow..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* ERROR */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* TABLE */}
      <div className="space-y-3">
        <div className="hidden md:grid grid-cols-4 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Joint Applicant Type</div>
          <div>Approval Workflow</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.map((row) => (
          <div
            key={row.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-y-2 items-center text-sm"
          >
            <div className="font-medium">{row.joint_applicant_type || "-"}</div>
            <div className="text-gray-600">{row.approval_workflow || "-"}</div>

            <span
              className={`px-3 py-1 text-xs rounded-full justify-self-start ${
                row.status === "Active" || row.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {row.status === "Active" || row.status === "ACTIVE" ? "Active" : "Inactive"}
            </span>

            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <ActionBtn
                color="gray"
                onClick={() => navigate(`/controls/joint-applicant/view/${row.id}`)}
              >
                <FiEye />
              </ActionBtn>
              <ActionBtn
                color="blue"
                onClick={() => navigate(`/controls/joint-applicant/edit/${row.id}`)}
              >
                <FiEdit3 />
              </ActionBtn>
              <ActionBtn color="red" onClick={() => handleDelete(row.id)}>
                <FiTrash2 />
              </ActionBtn>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 text-center py-10">No joint applicants found.</p>
        )}
      </div>
    </MainLayout>
  );
}

// Action button component
const ActionBtn = ({ children, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full bg-${color}-100 hover:bg-${color}-200`}
  >
    <span className={`text-${color}-600`}>{children}</span>
  </button>
);
