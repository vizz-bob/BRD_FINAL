import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  PageHeader,
  SearchFilterBar,
  ListView,
  DeleteConfirmButton,
} from "../../components/Controls/SharedUIHelpers";

import { bankFundService } from "../../services/bankFundService";

export default function BankManagement() {
  const navigate = useNavigate();

  const [banks, setBanks] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      setLoading(true);
      const data = await bankFundService.getBanks();
      setBanks(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    await bankFundService.deleteBank(deleteId);
    setDeleteId(null);
    loadBanks();
  };

  /* ================= FILTER ================= */
  const filtered = banks.filter(
    (b) =>
      b.bank_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.ifsc_code?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= LIST CONFIG ================= */
  const columns = [
    { key: "bank_name", label: "Bank Name" },
    { key: "ifsc_code", label: "IFSC" },
    { key: "branch", label: "Branch" },
    { key: "bank_account_type", label: "Account Type" },
    { key: "status", label: "Status", type: "status" },
  ];

  const actions = [
    {
      icon: <FiEye />,
      color: "gray",
      onClick: (row) => navigate(`/bank-management/${row.id}/view`),
    },
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/bank-management/edit/${row.id}`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => setDeleteId(row.id),
    },
  ];

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Bank Management"
        subtitle="Manage operational banks and account types"
        actionLabel="Add Bank"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/bank-management/add")}
      />

      {/* ================= SEARCH ================= */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by bank name or IFSC..."
      />

      {/* ================= LIST ================= */}
      {loading ? (
        <p className="text-center py-6 text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-6 text-gray-500">
          No banks found
        </p>
      ) : (
        <ListView
          data={filtered}
          columns={columns}
          actions={actions}
          rowKey="id"
        />
      )}

      {/* ================= DELETE CONFIRM ================= */}
      {deleteId && (
        <DeleteConfirmButton
          title="Delete Bank"
          message="Are you sure you want to delete this bank?"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </MainLayout>
  );
}
