import React, { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  PageHeader,
  SearchFilterBar,
  ListView,
} from "../../../../components/master/Controls/SharedUIHelpers";

import { interestService } from "../../../../services/productManagementService";
import AddInterest from "./AddInterest";

const InterestList = () => {
  const navigate = useNavigate();

  const [interests, setInterests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadInterests = async () => {
    try {
      setLoading(true);
      const data = await interestService.getInterests();
      setInterests(Array.isArray(data) ? data : (data?.results || []));
    } catch (err) {
      console.error("Failed to fetch interests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterests();
  }, []);

  const filtered = interests.filter(
    (i) =>
      i.benchmark_type?.toLowerCase().includes(search.toLowerCase()) ||
      i.interest_type?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: "benchmark_type", label: "Benchmark" },
    { key: "interest_type", label: "Interest Type" },
    { key: "accrual_method", label: "Accrual Method" },
    { key: "benchmark_rate", label: "Benchmark Rate" },
    { key: "mark_up", label: "Mark Up" },
    { key: "interest_rate", label: "APR (%)" },
    { key: "is_active", label: "Status", type: "status" },
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interest?")) return;
    try {
      await interestService.deleteInterest(id);
      setInterests((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const actions = [
    {
      icon: <FiEye />,
      color: "gray",
      onClick: (row) => navigate(`/interest/${row.id}`),
    },
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/interest/${row.id}/edit`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => handleDelete(row.id),
    },
  ];

  return (
    <div className="px-8 py-6">
      <PageHeader
        title="Interest Management"
        subtitle="Manage interest, benchmark and APR configurations"
        actionLabel="Add Interest"
        actionIcon={<FiPlus />}
        onAction={() => setShowAddModal(true)}
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search benchmark or interest type..."
      />

      {loading ? (
        <p className="text-gray-500 text-sm">Loading interest configurations...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-sm mt-4">No interest configurations found.</p>
      ) : (
        <ListView data={filtered} columns={columns} actions={actions} rowKey="id" />
      )}

      {showAddModal && (
        <AddInterest
          onClose={() => setShowAddModal(false)}
          onSuccess={loadInterests}
        />
      )}
    </div>
  );
};

export default InterestList;