// src/pages/branches/BranchList.jsx
import React, { useMemo, useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiEdit,
} from "react-icons/fi";
import { branchService } from "../../services/branchService";
import {
  DeleteConfirmButton,
  SearchFilterBar,
} from "../../components/Controls/SharedUIHelpers";

export default function BranchList() {
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filters = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  // delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBranchId, setDeleteBranchId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await branchService.getBranches();

      // ✅ FIX 2: normalize response
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.results)
        ? res.results
        : [];

      setBranches(list);
    } catch (error) {
      console.error("Error loading branches:", error);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = useMemo(() => {
    if (!Array.isArray(branches)) return [];

    return branches.filter((b) => {
      const matchesSearch =
        !search ||
        b.branch_name?.toLowerCase().includes(search.toLowerCase()) ||
        b.branch_code?.toLowerCase().includes(search.toLowerCase()) ||
        (b.phone_number || "").includes(search) ||
        (b.branch_address || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.tenant?.name || "").toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        !filter ||
        (filter === "active" && b.is_active === true) ||
        (filter === "inactive" && b.is_active === false);

      return matchesSearch && matchesFilter;
    });
  }, [branches, search, filter]);

  /* ---------------- DELETE FLOW ---------------- */
  const openDeleteModal = (id) => {
    setDeleteBranchId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteBranchId(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      await branchService.deleteBranch(deleteBranchId);
      closeDeleteModal();
      loadData();
    } catch (error) {
      console.error("Delete failed:", error);
      closeDeleteModal();
    }
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 shadow-sm transition"
          >
            <FiArrowLeft className="text-gray-700 text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Branches</h1>
            <p className="text-gray-500 text-sm">
              View and manage all branches in the system.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/organizations/branches/add")}
          className="flex items-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm"
        >
          <FiPlus className="text-lg" />
          Add Branch
        </button>
      </div>

      {/* SEARCH */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        filters={filters}
        placeholder="Search by branch name, code, phone or address..."
      />

      {/* LIST */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            Loading branches...
          </p>
        ) : filteredBranches.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            No branches found.
          </p>
        ) : (
          filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-white shadow hover:shadow-md transition"
            >
              {/* INFO */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Branch Name</p>
                  <p className="font-semibold">{branch.branch_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Branch Code</p>
                  <p>{branch.branch_code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p>{branch.phone_number || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Address</p>
                  <p>{branch.branch_address || "-"}</p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    navigate(`/organizations/branches/update/${branch.id}`)
                  }
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <FiEdit className="text-blue-600" />
                </button>

                <button
                  onClick={() => openDeleteModal(branch.id)}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200"
                >
                  <FiTrash2 className="text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <DeleteConfirmButton
          title="Delete Branch"
          message="Are you sure you want to delete this branch?"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </MainLayout>
  );
}
