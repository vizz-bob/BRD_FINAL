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
import { organizationService } from "../../services/organizationService";
import {
  DeleteConfirmButton,
  SearchFilterBar,
} from "../../components/Controls/SharedUIHelpers";

export default function OrganizationList() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filters = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrgId, setDeleteOrgId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- LOAD DATA (FIXED) ---------------- */
  const loadData = async () => {
    try {
      const response = await organizationService.getOrganizations();

      // ✅ Normalize response (VERY IMPORTANT)
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.results)
        ? response.results
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setOrganizations(list);
    } catch (error) {
      console.error("Error loading organizations:", error);
      setOrganizations([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER (SAFE) ---------------- */
  const filteredOrgs = useMemo(() => {
    if (!Array.isArray(organizations)) return [];

    return organizations.filter((org) => {
      const matchesSearch =
        !search ||
        org.business_name?.toLowerCase().includes(search.toLowerCase()) ||
        org.email?.toLowerCase().includes(search.toLowerCase()) ||
        (org.mobile_number || "").includes(search) ||
        (org.full_address || "").toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        !filter ||
        (filter === "active" && org.is_active === true) ||
        (filter === "inactive" && org.is_active === false);

      return matchesSearch && matchesFilter;
    });
  }, [organizations, search, filter]);

  /* ---------------- DELETE FLOW ---------------- */
  const openDeleteModal = (id) => {
    setDeleteOrgId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteOrgId(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      await organizationService.deleteOrganization(deleteOrgId);
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
            <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
            <p className="text-gray-500 text-sm">
              View and manage all organizations in the system.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/organizations/add")}
          className="flex items-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm"
        >
          <FiPlus className="text-lg" />
          Add Organization
        </button>
      </div>

      {/* SEARCH */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        filters={filters}
        placeholder="Search by name, email, phone or address..."
      />

      {/* LIST */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            Loading organizations...
          </p>
        ) : filteredOrgs.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            No organizations found.
          </p>
        ) : (
          filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-white shadow hover:shadow-md transition"
            >
              {/* INFO */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs">Name</p>
                  <p className="font-semibold text-gray-800">
                    {org.business_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-sm text-gray-700">{org.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Phone</p>
                  <p className="text-sm text-gray-700">
                    {org.mobile_number || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Address</p>
                  <p className="text-sm text-gray-700">
                    {org.full_address || "-"}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/organizations/edit/${org.id}`)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <FiEdit className="text-blue-600" />
                </button>

                <button
                  onClick={() => openDeleteModal(org.id)}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200"
                >
                  <FiTrash2 className="text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <DeleteConfirmButton
          title="Delete Organization"
          message="Are you sure you want to delete this organization?"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </MainLayout>
  );
}
