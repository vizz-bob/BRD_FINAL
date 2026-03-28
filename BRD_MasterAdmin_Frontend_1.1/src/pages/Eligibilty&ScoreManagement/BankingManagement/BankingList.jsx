import React, { useEffect, useState } from "react";
import { FiPlus, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../layout/MainLayout";
import {
  PageHeader,
  SearchFilterBar,
  ListView,
  DeleteConfirmButton,
} from "../../../components/Controls/SharedUIHelpers";

import { bankingManagementService } from "../../../services/eligibilityManagementService";

export default function BankingList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteRow, setDeleteRow] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    const res = await bankingManagementService.list();
    setData(res || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteRow) return;

    setLoading(true);
    await bankingManagementService.delete(deleteRow.id);
    setDeleteRow(null);
    await fetchData();
    setLoading(false);
  };

  /* ================= FILTER ================= */
  const filteredData = data.filter((row) =>
    row.bank_account_type
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= LIST CONFIG ================= */
  const columns = [
    {
      key: "bank_account_type",
      label: "Account Type",
    },
    {
      key: "average_banking_from",
      label: "Avg From",
    },
    {
      key: "average_banking_to",
      label: "Avg To",
    },
    {
      key: "average_banking_criteria",
      label: "Criteria",
    },
    {
      key: "is_active",
      label: "Status",
      type: "status",
    },
  ];

  const actions = [
    {
      icon: <FiEye />,
      color: "gray",
      onClick: (row) => navigate(`/banking/view/${row.id}`),
    },
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/banking/edit/${row.id}`),
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
        title="Banking Management"
        subtitle="Manage banking eligibility rules"
        actionLabel="Add Banking Rule"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/banking/add")}
      />

      {/* ================= SEARCH ================= */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search account type..."
      />

      {/* ================= LIST ================= */}
      <ListView
        data={filteredData}
        columns={columns}
        actions={actions}
        rowKey="id"
      />

      {!loading && filteredData.length === 0 && (
        <p className="text-center text-sm text-gray-500 mt-6">
          No banking rules found
        </p>
      )}

      {/* ================= DELETE CONFIRM ================= */}
      {deleteRow && (
        <DeleteConfirmButton
          title="Delete Banking Rule"
          message="Are you sure you want to delete this banking rule?"
          confirmText="Delete"
          loading={loading}
          onCancel={() => setDeleteRow(null)}
          onConfirm={handleDelete}
        />
      )}
    </MainLayout>
  );
}
