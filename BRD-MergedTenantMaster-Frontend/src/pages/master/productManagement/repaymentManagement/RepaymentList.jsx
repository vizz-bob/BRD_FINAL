import React, { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  PageHeader,
  SearchFilterBar,
  ListView,
  DeleteConfirmButton,
} from "../../../../components/master/Controls/SharedUIHelpers";
import { repaymentsService } from "../../../../services/productManagementService";
import AddRepayment from "./AddRepayment";

export default function RepaymentList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadRepayments = async () => {
    setLoading(true);
    try {
      const res = await repaymentsService.getRepayments();
      setData(Array.isArray(res) ? res : (res?.results || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepayments();
  }, []);

  const filtered = useMemo(() => {
    return data.filter((r) =>
      r.repayment_type?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const columns = [
    { key: "repayment_type", label: "Type" },
    { key: "frequency", label: "Frequency" },
    { key: "limit_in_month", label: "Tenure (Months)" },
    { key: "number_of_repayments", label: "No. of Repayments" },
    { key: "mode_of_collection", label: "Collection Mode" },
    { key: "is_active", label: "Status", type: "status" },
  ];

  const actions = [
    {
      icon: <FiEye />,
      color: "gray",
      onClick: (row) => navigate(`/repayment/${row.id}`),
    },
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/repayment/${row.id}/edit`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => setDeleteItem(row),
    },
  ];

  return (
    <div className="px-8 py-6">
      <PageHeader
        title="Repayment Management"
        subtitle="Manage loan repayment rules and schedules"
        actionLabel="Add Repayment Rule"
        actionIcon={<FiPlus />}
        onAction={() => setShowAddModal(true)}
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by repayment type..."
      />

      {loading ? (
        <p className="text-gray-500 text-sm">Loading repayment rules...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-sm mt-4">No repayment rules found.</p>
      ) : (
        <ListView
          data={filtered}
          columns={columns}
          actions={actions}
          rowKey="id"
        />
      )}

      {deleteItem && (
        <DeleteConfirmButton
          title="Delete Repayment Rule"
          message={`Are you sure you want to delete "${deleteItem.repayment_type}"?`}
          onConfirm={async () => {
            try {
              await repaymentsService.deleteRepayment(deleteItem.id);
              setData(data.filter((d) => d.id !== deleteItem.id));
            } finally {
              setDeleteItem(null);
            }
          }}
          onCancel={() => setDeleteItem(null)}
        />
      )}

      {showAddModal && (
        <AddRepayment
          onClose={() => setShowAddModal(false)}
          onSuccess={loadRepayments}
        />
      )}
    </div>
  );
}