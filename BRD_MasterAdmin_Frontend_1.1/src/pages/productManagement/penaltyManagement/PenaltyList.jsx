import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  PageHeader,
  SearchFilterBar,
  ListView,
  Button,
  DeleteConfirmButton,
} from "../../../components/Controls/SharedUIHelpers";

import { penaltiesService } from "../../../services/productManagementService";

export default function PenaltyList() {
  const navigate = useNavigate();

  const [penalties, setPenalties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteRow, setDeleteRow] = useState(null);

  // Load penalties
  useEffect(() => {
    (async () => {
      try {
        const data = await penaltiesService.getPenalties();
        setPenalties(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter
  const filteredData = penalties.filter((p) =>
    p.penalty_name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: "penalty_name", label: "Penalty Name" },
    { key: "frequency", label: "Frequency" },
    { key: "basis_of_recovery", label: "Basis" },
    { key: "recovery_stage", label: "Recovery Stage" },
    { key: "recovery_mode", label: "Mode" },
    { key: "rate_of_penalty", label: "Rate" },
    { key: "is_active", label: "Status", type: "status" },
  ];

  const actions = [
    { icon: <FiEye />, color: "gray", onClick: (row) => navigate(`/penalties/${row.id}`) },
    { icon: <FiEdit />, color: "blue", onClick: (row) => navigate(`/penalties/${row.id}/edit`) },
    { icon: <FiTrash2 />, color: "red", onClick: (row) => setDeleteRow(row) },
  ];

  const handleDelete = async () => {
    try {
      await penaltiesService.deletePenalty(deleteRow.id);
      setPenalties((prev) => prev.filter((p) => p.id !== deleteRow.id));
      setDeleteRow(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Penalties Management"
        subtitle="Manage penalty rules for defaults and late payments"
        actionLabel="Add Penalty"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/penalties/add")}
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search penalty name..."
      />

      {loading ? (
        <p className="text-gray-500">Loading penalties...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-gray-500 text-sm">No penalties found.</p>
      ) : (
        <ListView data={filteredData} columns={columns} actions={actions} rowKey="id" />
      )}

      {deleteRow && (
        <DeleteConfirmButton
          title="Delete Penalty"
          message={`Are you sure you want to delete "${deleteRow.penalty_name}"?`}
          onCancel={() => setDeleteRow(null)}
          onConfirm={handleDelete}
        />
      )}
    </MainLayout>
  );
}
