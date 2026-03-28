import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  PageHeader,
  SearchFilterBar,
  ListView,
  DeleteConfirmButton,
} from "../../../components/Controls/SharedUIHelpers";

import { moratoriumService } from "../../../services/productManagementService";

export default function MoratoriumList() {
  const navigate = useNavigate();

  const [moratoriums, setMoratoriums] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    loadMoratoriums();
  }, []);

  const loadMoratoriums = async () => {
    try {
      setLoading(true);
      const data = await moratoriumService.getMoratoriums();
      setMoratoriums(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    await moratoriumService.deleteMoratorium(deleteId);
    setDeleteId(null);
    loadMoratoriums();
  };

  /* ================= FILTER ================= */
  const filtered = moratoriums.filter((m) =>
    m.moratorium_type?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= LIST CONFIG ================= */
  const columns = [
    {
      key: "moratorium_type",
      label: "Type",
      render: (v) => (v === "FULL" ? "Full" : "Interest-only"),
    },
    {
      key: "period_value",
      label: "Period",
      render: (_, row) =>
        `${row.period_value} ${
          row.period_unit === "DAY" ? "Days" : "Months"
        }`,
    },
    {
      key: "amount",
      label: "Amount",
      render: (v) => `₹${Number(v).toLocaleString()}`,
    },
    {
      key: "effect_of_moratorium",
      label: "Effect",
      render: (v) =>
        v === "DEFERRED" ? "Deferred" : "Interest-only",
    },
    {
      key: "interest_rationalisation",
      label: "Interest Waived",
      type: "status",
    },
    { key: "is_active", label: "Status", type: "status" },
  ];

  const actions = [
    {
      icon: <FiEye />,
      color: "gray",
      onClick: (row) => navigate(`/moratorium/${row.id}/view`),
    },
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/moratorium/${row.id}/edit`),
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
        title="Moratorium Management"
        subtitle="Manage payment deferral rules and interest impact"
        actionLabel="Add Moratorium"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/moratorium/add")}
      />

      {/* ================= SEARCH ================= */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by moratorium type..."
      />

      {/* ================= LIST ================= */}
      {loading ? (
        <p className="text-center py-6 text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-6 text-gray-500">
          No moratorium rules found
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
          title="Delete Moratorium"
          message="Are you sure you want to delete this moratorium rule?"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </MainLayout>
  );
}
