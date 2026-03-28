import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

import { chargesService } from "../../../services/productManagementService";
import {
  PageHeader,
  SearchFilterBar,
  ListView,
  DeleteConfirmButton,
} from "../../../components/Controls/SharedUIHelpers";

export default function ChargeList() {
  const navigate = useNavigate();

  const [charges, setCharges] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    loadCharges();
  }, []);

  const loadCharges = async () => {
    try {
      setLoading(true);
      const data = await chargesService.getCharges();
      setCharges(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    await chargesService.deleteCharge(deleteId);
    setDeleteId(null);
    loadCharges();
  };

  /* ================= FILTER ================= */
  const filtered = charges.filter((c) =>
    c.charge_name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= LIST CONFIG ================= */
  const columns = [
    { key: "charge_name", label: "Charge Name" },
    { key: "frequency", label: "Frequency" },
    { key: "basis_of_recovery", label: "Basis" },
    { key: "recovery_stage", label: "Stage" },
    { key: "recovery_mode", label: "Mode" },
    {
      key: "rate_of_charges",
      label: "Rate",
      render: (v) => Number(v).toLocaleString(),
    },
    { key: "is_active", label: "Status", type: "status" },
  ];

  const actions = [
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/charges/edit/${row.id}`),
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
        title="Charges"
        subtitle="View and manage charges"
        actionLabel="Add Charge"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/charges/add")}
      />

      {/* ================= SEARCH ================= */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search charge name..."
      />

      {/* ================= LIST ================= */}
      {loading ? (
        <p className="text-center py-6 text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No charges found</p>
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
          title="Delete Charge"
          message="Are you sure you want to delete this charge?"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </MainLayout>
  );
}
