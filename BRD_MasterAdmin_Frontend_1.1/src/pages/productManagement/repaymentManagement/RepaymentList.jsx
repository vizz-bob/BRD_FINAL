import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { PageHeader, SearchFilterBar, ListView, DeleteConfirmButton } from "../../../components/Controls/SharedUIHelpers";
import { repaymentsService } from "../../../services/productManagementService";

export default function RepaymentList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);

  // ---------------- LOAD LIST ----------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await repaymentsService.getRepayments();
        setData(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---------------- FILTER ----------------
  const filtered = useMemo(() => {
    return data.filter((r) =>
      r.repayment_type.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // ---------------- TABLE ----------------
  const columns = [
    { key: "repayment_type", label: "Type" },
    { key: "frequency", label: "Frequency" },
    { key: "limit_in_month", label: "Tenure (Months)" },
    { key: "number_of_repayments", label: "No. of Repayments" },
    { key: "mode_of_collection", label: "Collection Mode" },
    { key: "is_active", label: "Status" },
  ];

  const actions = [
    { icon: <FiEye />, onClick: (row) => navigate(`/repayment/${row.id}`) },
    { icon: <FiEdit />, onClick: (row) => navigate(`/repayment/${row.id}/edit`) },
    { icon: <FiTrash2 />, onClick: (row) => setDeleteItem(row) },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Repayment Management"
        subtitle="Manage loan repayment rules and schedules"
        actionLabel="Add Repayment Rule"
        onAction={() => navigate("/repayment/add")}
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by repayment type..."
      />

      <ListView
        data={filtered}
        columns={columns}
        actions={actions}
        rowKey="id"
      />

      {deleteItem && (
        <DeleteConfirmButton
          title="Delete Repayment Rule"
          message={`Are you sure you want to delete "${deleteItem.repayment_type}"?`}
          onConfirm={async () => {
            try {
              await repaymentsService.deleteRepayment(deleteItem.id);
              setData(data.filter(d => d.id !== deleteItem.id));
            } finally {
              setDeleteItem(null);
            }
          }}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </MainLayout>
  );
}
