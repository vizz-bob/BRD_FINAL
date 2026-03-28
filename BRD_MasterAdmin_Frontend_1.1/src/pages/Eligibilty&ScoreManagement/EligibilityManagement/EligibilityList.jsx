import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

import MainLayout from "../../../layout/MainLayout";
import {
  PageHeader,
  SearchFilterBar,
  ListView,
  DeleteConfirmButton,
} from "../../../components/Controls/SharedUIHelpers";

import { eligibilityManagementService } from "../../../services/eligibilityManagementService";

export default function EligibilityList() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteRow, setDeleteRow] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ================= FETCH ================= */
  const fetchEligibility = async () => {
    const data = await eligibilityManagementService.list();
    setRows(data || []);
  };

  useEffect(() => {
    fetchEligibility();
  }, []);

  /* ================= FILTER ================= */
  const filteredRows = rows.filter((row) =>
    `${row.applicant_type} ${row.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= COLUMNS ================= */
  const columns = [
    {
      key: "applicant_type",
      label: "Applicant Type",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "income_type",
      label: "Income Type",
    },
    {
      key: "margin",
      label: "Margin (%)",
    },
    {
      key: "is_active",
      label: "Status",
      type: "status",
    },
  ];

  /* ================= ACTIONS ================= */
  const actions = [
    {
      icon: <FiEye />,
      color: "gray",
      onClick: (row) => navigate(`/eligibility/view/${row.id}`),
    },
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/eligibility/edit/${row.id}`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => setDeleteRow(row),
    },
  ];

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteRow) return;

    setDeleting(true);
    await eligibilityManagementService.delete(deleteRow.id);
    setDeleting(false);
    setDeleteRow(null);
    fetchEligibility();
  };

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Eligibility Management"
        subtitle="Configure eligibility rules and margins"
        actionLabel="Add Eligibility"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/eligibility/add")}
      />

      {/* ================= SEARCH ================= */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by applicant type or category..."
      />

      {/* ================= LIST ================= */}
      <ListView
        data={filteredRows}
        columns={columns}
        actions={actions}
        rowKey="id"
      />

      {/* ================= DELETE CONFIRM ================= */}
      {deleteRow && (
        <DeleteConfirmButton
          title="Delete Eligibility"
          message="Are you sure you want to delete this eligibility rule?"
          confirmText="Delete"
          loading={deleting}
          onCancel={() => setDeleteRow(null)}
          onConfirm={handleDelete}
        />
      )}
    </MainLayout>
  );
}
