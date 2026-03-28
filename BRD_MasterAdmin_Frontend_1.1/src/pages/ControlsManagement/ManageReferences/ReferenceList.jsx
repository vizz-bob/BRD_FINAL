import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit3, FiEye, FiTrash2 } from "react-icons/fi";

import {
  PageHeader,
  ListView,
  SearchFilterBar,
  DeleteConfirmButton,
} from "../../../components/Controls/SharedUIHelpers";

import { controlsManagementService } from "../../../services/controlsManagementService";

export default function ReferenceList() {
  const navigate = useNavigate();

  const [references, setReferences] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteRow, setDeleteRow] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchReferences = async () => {
    const data = await controlsManagementService.references.list();
    setReferences(data || []);
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredData = useMemo(() => {
    if (!search) return references;

    return references.filter(
      (r) =>
        r.reference_type?.toLowerCase().includes(search.toLowerCase()) ||
        r.reference_role?.toLowerCase().includes(search.toLowerCase())
    );
  }, [references, search]);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteRow) return;

    setLoading(true);
    const success = await controlsManagementService.references.delete(
      deleteRow.uuid || deleteRow.id
    );

    if (success) {
      fetchReferences();
      setDeleteRow(null);
    }

    setLoading(false);
  };

  /* ================= TABLE CONFIG ================= */
  const columns = [
    {
      key: "reference_type",
      label: "Reference Type",
    },
    {
      key: "reference_role",
      label: "Reference Role",
    },
    {
      key: "status",
      label: "Status",
      type: "status",
    },
  ];

  const actions = [
    {
      icon: <FiEye />,
      color: "gray",
      onClick: (row) =>
        navigate(`/controls/references/view/${row.uuid || row.id}`),
    },
    {
      icon: <FiEdit3 />,
      color: "blue",
      onClick: (row) =>
        navigate(`/controls/references/edit/${row.uuid || row.id}`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => setDeleteRow(row),
    },
  ];

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Reference Management"
        subtitle="Configure reference types and roles"
        actionLabel="Add Reference"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/controls/references/add")}
      />

      {/* ================= SEARCH ================= */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search reference type or role..."
      />

      {/* ================= LIST ================= */}
      <ListView
        data={filteredData}
        columns={columns}
        actions={actions}
        rowKey="uuid"
      />

      {/* ================= DELETE CONFIRM ================= */}
      {deleteRow && (
        <DeleteConfirmButton
          title="Delete Reference"
          message="Are you sure you want to delete this reference configuration?"
          onCancel={() => setDeleteRow(null)}
          onConfirm={handleDelete}
          loading={loading}
        />
      )}
    </MainLayout>
  );
}
