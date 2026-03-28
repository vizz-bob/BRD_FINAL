import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

/* ===== SERVICES ===== */
import { obligationsManagementService } from "../../../services/eligibilityManagementService";

/* ===== SHARED UI ===== */
import {
  PageHeader,
  ListView,
  SearchFilterBar,
  DeleteConfirmButton,
} from "../../../components/Controls/SharedUIHelpers";

export default function ExistingObligationList() {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  /* ================= FETCH ================= */
  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await obligationsManagementService.list();
      setList(data || []);
    } catch (error) {
      console.error("Failed to fetch obligations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteId) return;

    const success = await obligationsManagementService.delete(deleteId);
    if (success) {
      setDeleteId(null);
      fetchList();
    }
  };

  /* ================= FILTER ================= */
  const filteredList = list.filter((item) =>
    item.loan_status?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      key: "loan_status",
      label: "Loan Status",
    },
    {
      key: "loan_performance",
      label: "Loan Performance",
    },
    {
      key: "card_type",
      label: "Card Type",
    },
    {
      key: "total_loans",
      label: "Total Loans",
    },
    {
      key: "is_active",
      label: "Status",
      type: "status", // 👈 ListView will auto-use StatusBadge
    },
  ];

  /* ================= ACTION CONFIG ================= */
  const actions = [
    {
      icon: <FiEye />,
      color: "gray",
      onClick: (row) => navigate(`/obligation/view/${row.id}`),
    },
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/obligation/edit/${row.id}`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => setDeleteId(row.id),
    },
  ];

  /* ================= UI ================= */
  return (
    <MainLayout>
      <PageHeader
        title="Existing Obligation Management"
        subtitle="Manage existing loan obligations"
        actionLabel="Add Obligation Rule"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/obligation/add")}
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by loan status..."
      />

      <ListView
        data={filteredList}
        columns={columns}
        actions={actions}
        rowKey="id"
      />

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deleteId && (
        <DeleteConfirmButton
          title="Delete Obligation Rule"
          message="Are you sure you want to delete this obligation rule?"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          loading={loading}
        />
      )}
    </MainLayout>
  );
}
